import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Almacen } from "../../almacen/entities/almacen.entity";
import { User } from "./../../../users/entities/user.entity";
import { Role } from "./../../../roles/entities/role.entity";
import { Sucursal } from "./sucursal.entity";

@Entity('sucursal_user')
export class SucursalUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id, {eager: true})
    user: string;

    @ManyToOne(() => Sucursal, sucursal => sucursal.usuarios, {eager: true})
    sucursal:Sucursal;

    @ManyToOne(() => Role, {nullable: true, eager: true})
    role: Role;

}
