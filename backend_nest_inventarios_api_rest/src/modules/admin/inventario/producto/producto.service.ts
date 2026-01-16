import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Repository } from 'typeorm';
import { Categoria } from '../categoria/entities/categoria.entity';
import PDFDocument from 'pdfkit'
import { Response } from 'express';

@Injectable()
export class ProductoService {

  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ){}

  async create(createProductoDto: CreateProductoDto) {
    // verificar si la categoria existe
    const categoria = await this.categoriaRepository.findOne({where: {id: createProductoDto.categoria}})
    if(!categoria)throw new NotFoundException('Categoria no encontrada');

    createProductoDto.fecha_registro = new Date().toISOString().split('T')[0];
    const producto = this.productoRepository.create({...createProductoDto, categoria});
    return this.productoRepository.save(producto);
  }

  async subidaImagen(file: Express.Multer.File, id: number){

    // validar
    const valid = ['image/jpeg', 'image/png', 'image/jpg'];
    if(!valid.includes(file.mimetype)){
      throw new BadRequestException('Formato Invalido');
    }

    // validar el tamaño de archivo

    const maxSize = 5 * 1024*1024;

    if(file.size > maxSize){
      throw new BadRequestException('El archivo es muy grande');
    }

    const producto = await this.findOne(id);
    producto.imagen = file.path;
    this.productoRepository.save(producto);

    return {message: 'Archivo subido', filepath: file.path};
  }

  // paginación
  
  async findAll(page: number = 1, limit: number = 10, search: string='', sortBy: string = 'id', order: 'ASC'|'DESC' = 'DESC', almacen: number = 0, activo: boolean = true) {
    
    const queryBuilder = this.productoRepository.createQueryBuilder('producto')
              .leftJoinAndSelect('producto.almacenes', 'productoAlmacen')
              .leftJoinAndSelect('productoAlmacen.almacen', 'almacen')
              .where('producto.activo = :activo', {activo})

              // busqueda
              if(search){
                queryBuilder.andWhere(
                  '(producto.nombre ILIKE :search OR producto.marca ILIKE :search)', {search: `%${search}%`}
                )
              }

              if(almacen && almacen > 0) {
                queryBuilder.andWhere('almacen.id = :almacen', {almacen});
              }

              // ordenación
              queryBuilder.orderBy(`producto.${sortBy}`, order);

              
      queryBuilder.skip((page-1)*limit).take(limit)

      const [productos, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(total/limit)

      return {
        data: productos,
        total,
        limit,
        page, 
        totalPages,
        activo,
        almacen, 
        order,
        search,
        sortBy

      }

  }
  /*
  async findAll(page: number = 1, limit: number = 10, search: string='', sortBy: string = 'id', order: 'ASC'|'DESC' = 'DESC', almacen: number = 0, activo: boolean = true) {
    
    const queryBuilder = this.productoRepository.createQueryBuilder('producto')
              .leftJoinAndSelect('producto.almacenes', 'almacen')
              .where('producto.nombre ILIKE :search OR producto.marca LIKE :search', {
                search: `%${search}%`
              })
              .andWhere('producto.activo = :activo', {activo: activo});

      // ordenación
      queryBuilder.skip((page-1)*limit).take(limit)

      const [productos, total] = await queryBuilder.getManyAndCount();
      const totalPages = Math.ceil(total/limit)

      return {
        data: productos,
        total,
        limit,
        page, 
        totalPages,
        activo,
        almacen, 
        order,
        search,
        sortBy

      }

  }
  */

  async findOne(id: number) {
    const producto = await this.productoRepository.findOne({where: {id}});

    if(!producto) throw new NotFoundException('Producto no encontrado');

    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.findOne(id)
    if(updateProductoDto.categoria){
      const categoria = await this.categoriaRepository.findOne({where: {id: updateProductoDto.categoria}})
      if(!categoria)throw new NotFoundException('Categoria no encontrada');
      producto.categoria = categoria;
    }
    Object.assign(producto, updateProductoDto)

    return this.productoRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id)
    producto.activo = false;
    await this.productoRepository.save(producto);
  }

  /*
  async generatePDF() {

    const pdfBuffer: Buffer = await new Promise(resolve => {
      const doc = new PDFDocument({
        size: 'LETTER',
        bufferPages: true,
      })

      // customize your PDF document
      doc.text('Hola Mundo', 100, 50)
      doc.end()

      const buffer = []
      doc.on('data', buffer.push.bind(buffer))
      doc.on('end', () => {
        const data = Buffer.concat(buffer)
        resolve(data)
      })
    })

    return pdfBuffer
  }
  */

  async generatePDF(res: Response) {

    const productos = this.productoRepository.find();

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
  
    doc.pipe(res);

    doc.fontSize(20).text('Lista de Productos', {
      align: 'center'
    });
    doc.moveDown();

    doc.fontSize(12);

    (await productos).forEach((producto, index) => {
      doc.text(`${index+1}. ${producto.nombre} - ${producto.precio_venta_actual} - ${producto.descripcion}`)

      doc.moveDown(0.5);

    });


    doc.end()

  }
}
