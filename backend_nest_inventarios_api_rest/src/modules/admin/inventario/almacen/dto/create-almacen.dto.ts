import { ApiProperty } from "@nestjs/swagger"
import { IsInt, IsString } from "class-validator"

export class CreateAlmacenDto {
    
    @ApiProperty()
    @IsString()
    nombre: string;

    @ApiProperty()
    @IsString()
    codigo: string

    @ApiProperty()
    @IsString()
    descripcion?: string

    @ApiProperty()
    @IsInt()
    sucursal:number
}
