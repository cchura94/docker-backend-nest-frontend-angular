import { Module } from '@nestjs/common';
import { NotaService } from './nota.service';
import { NotaController } from './nota.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nota } from './entities/nota.entity';
import { Movimiento } from './entities/movimiento.entity';
import { User } from '../users/entities/user.entity';
import { ClienteProveedor } from '../cliente-proveedor/entities/cliente-proveedor.entity';
import { Producto } from '../inventario/producto/entities/producto.entity';
import { Almacen } from '../inventario/almacen/entities/almacen.entity';
import { AlmacenProducto } from '../inventario/almacen/entities/almacen_producto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nota, Movimiento, User, ClienteProveedor, Producto, Almacen, AlmacenProducto
    ])],
  controllers: [NotaController],
  providers: [NotaService],
})
export class NotaModule {}
