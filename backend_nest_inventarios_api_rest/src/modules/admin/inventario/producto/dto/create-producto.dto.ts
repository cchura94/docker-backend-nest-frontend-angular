import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsDateString, IsDecimal, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateProductoDto {

    @ApiProperty()
    @IsString()
    @MaxLength(200)
    @IsNotEmpty()
    nombre: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    descripcion?: string;


    @ApiProperty()
    @IsString()
    @MaxLength(200)
    @IsOptional()
    marca?: string;

    @ApiProperty()
    @IsDecimal()
    precio_venta_actual: number;
    
    @ApiProperty()
    @IsString()
    @MaxLength(255)
    @IsOptional()
    imagen?: string;

    @ApiProperty({ type: 'boolean'})
    @IsBoolean()
    activo: boolean;

    @ApiProperty()
    @IsString()
    fecha_registro:string;

    @ApiProperty()
    @IsInt()
    categoria: number;
}
