import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res, UseGuards, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get("/reporte-pdf")
  reportePDF(@Res() res: any){
    return this.productoService.generatePDF(res)
  }

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @Post(':id/actualizar-imagen')
  @UseInterceptors(FileInterceptor('imagen'))
  subirImagen(@UploadedFile() file: Express.Multer.File, @Param('id') id: number){
    return this.productoService.subidaImagen(file, id);
  }
  // page: number = 1, limit: number = 10, search: string='', sortBy: string = 'id', order: 'ASC'|'DESC' = 'DESC', almacen: number = 0, activo: boolean = true
  @Get()
  findAll(
    @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search: string = '',
        @Query('sortBy') sortBy: string = '',
        @Query('order') order: "ASC"|"DESC" = 'DESC',
        @Query('almacen') almacen: number = 0,
        @Query('activo') activo: boolean = true
  ) {
    return this.productoService.findAll(page, limit, search,sortBy, order, almacen, activo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
}
