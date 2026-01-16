import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsArray()
    permissionIds?: number[];
}
