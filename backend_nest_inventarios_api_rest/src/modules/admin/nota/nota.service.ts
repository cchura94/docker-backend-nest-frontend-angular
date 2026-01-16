import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { FiltroNotaDto } from './dto/filtro-nota.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Nota } from './entities/nota.entity';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ClienteProveedor } from '../cliente-proveedor/entities/cliente-proveedor.entity';
import { Producto } from '../inventario/producto/entities/producto.entity';
import { Almacen } from '../inventario/almacen/entities/almacen.entity';
import { Movimiento } from './entities/movimiento.entity';

import { AlmacenProducto } from '../inventario/almacen/entities/almacen_producto.entity';

@Injectable()
export class NotaService {

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(Nota)
    private notaRepo: Repository<Nota>,

    @InjectRepository(Movimiento)
    private movRepo: Repository<Movimiento>,
    
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>,

    @InjectRepository(Almacen)
    private almacenRepo: Repository<Almacen>,

    @InjectRepository(ClienteProveedor)
    private clienteRepo: Repository<ClienteProveedor>,

    @InjectRepository(AlmacenProducto)
    private almacenProductoRepo: Repository<AlmacenProducto>
    
  ){

  }

  async create(createNotaDto: CreateNotaDto) {
    // transacciones
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const clienteRepo = queryRunner.manager.getRepository(ClienteProveedor);
      const notaRepo = queryRunner.manager.getRepository(Nota);
      const productoRepo = queryRunner.manager.getRepository(Producto);
      const almacenRepo = queryRunner.manager.getRepository(Almacen);
      const movimientoRepo = queryRunner.manager.getRepository(Movimiento);

      // Procedimientos almacenado
      // await queryRunner.manager.query('CALL buscar_usuario($1, $2)',[nombreUsuario, emailUsuario])

      const user = await userRepo.findOneBy({id: createNotaDto.user_id});
      if(!user) throw new NotFoundException('Usuario no encontrado');

      const cliente = await clienteRepo.findOneBy({id: createNotaDto.cliente_id});
      if(!cliente) throw new NotFoundException('Cliente no encontrado');

      // crear nota
      const nota = await notaRepo.create({
        ...createNotaDto,
        cliente: cliente,
        user: user
      })

      // Primero debemos guardar la nota para obtener el ID para registrar movimientos
      await notaRepo.save(nota);

      // registrar ingresos y salidas de inventario
      const movimientosGuardados: Movimiento[] = []

      for (const m of createNotaDto.movimientos) {
        const producto = await productoRepo.findOneBy({id: m.producto_id});
        if(!producto) throw new NotFoundException('Producto no encontrado');

        const almacen = await almacenRepo.findOneBy({id: m.almacen_id});
        if(!almacen) throw new NotFoundException('Almacen no encontrado');

        const movimiento = movimientoRepo.create({
          ...m,
          nota: nota,
          producto,
          almacen
        });

        // actualizar stock de inventario
        await this.actualizarStockConQueryRunner(queryRunner, almacen, producto, m.cantidad, m.tipo_movimiento)

        const movGuardado = await movimientoRepo.save(movimiento);
        movimientosGuardados.push(movGuardado);
        
      }
      nota.movimientos = movimientosGuardados;
      
      await queryRunner.commitTransaction(); 

      return nota;     
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;      
    } finally {
      await queryRunner.release();
    }
    
    
  }

  private async actualizarStockConQueryRunner(queryRunner: QueryRunner, almacen: Almacen, producto: Producto, cantidad: number, tipo: 'ingreso' | 'salida' | 'devolucion'){
    const almacenProductoRepo = queryRunner.manager.getRepository(AlmacenProducto);
    
    let ap = await almacenProductoRepo.findOne({
      where: {
        almacen: {id: almacen.id},
        producto: {id: producto.id}
      },
      relations: ['almacen', 'producto']
    });

    if(!ap){
      if(tipo === 'salida'){
        throw new BadRequestException('No hay stock registrado para este producto en este almacen');
      }

      ap = almacenProductoRepo.create({
        almacen, producto, cantidad_actual: cantidad, fecha_actualizacion: new Date()
      });
      
    }else{
      if(tipo === 'ingreso' || tipo === 'devolucion'){
        console.log("ANTES: ", ap.cantidad_actual)
        ap.cantidad_actual += cantidad;
        console.log("DESPUES: ", ap.cantidad_actual)
      }else if(tipo === 'salida'){
        if(ap.cantidad_actual < cantidad){
          throw new BadRequestException('Stock insuficiente para la salida');
        }
        ap.cantidad_actual -= cantidad;
      }
      ap.fecha_actualizacion = new Date()
    }

    await almacenProductoRepo.save(ap);
  }

  async findAll(filtro: FiltroNotaDto) {
    const query = this.notaRepo.createQueryBuilder('nota')
                    .leftJoinAndSelect('nota.user', 'user')
                    .leftJoinAndSelect('nota.cliente', 'cliente')
                    .leftJoinAndSelect('nota.movimientos', 'movimientos')
                    .leftJoinAndSelect('movimientos.producto', 'producto');
    
    if(filtro.tipo_nota){
      query.andWhere('nota.tipo_nota = :tipo_nota', {tipo_nota: filtro.tipo_nota});
    }

    if(filtro.estado_nota){
      query.andWhere('nota.estado_nota = :estado_nota', {estado_nota: filtro.estado_nota});
    }

    if(filtro.desde){
      query.andWhere('nota.fecha = :desde', {desde: filtro.desde});
    }

    if(filtro.hasta){
      query.andWhere('nota.fecha = :hasta', {hasta: filtro.tipo_nota});
    }

    if(filtro.user_id){
      query.andWhere('nota.user_id = :user_id', {user_id: filtro.user_id});
    }


    if(filtro.cliente_id){
      query.andWhere('nota.cliente_id = :cliente_id', {cliente_id: filtro.cliente_id});
    }

    query.orderBy('nota.fecha', 'DESC');

    // paginación
    const limit = filtro.limit || 10;
    const page = filtro.page || 1;

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {data, total}
    
  }

  findOne(id: number) {
    return this.notaRepo.findOne({
      where: {id},
      relations: ['movimientos']
    })
  }

  update(id: number, updateNotaDto: UpdateNotaDto) {
    return `This action updates a #${id} nota`;
  }

  remove(id: number) {
    return `This action removes a #${id} nota`;
  }
}
