import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class FiltroNotaDto{
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    tipo_nota?: string; // 'compra' | 'venta'

    @ApiProperty()
    @IsOptional()
    @IsString()
    estado_nota?: string; // 'completado' | 'pendiente' | 'borrador'  |  'cancelado'

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    desde?: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    hasta?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    user_id?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    cliente_id?: string;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    
}