import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../../roles/entities/role.entity";

@Entity()
export class Permission {
     @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    action: string; // create, read, update, delete

    @Column({nullable: true})
    subject: string; // user, role, producto, categoria

    @Column({nullable: true})
    detalle: string

    @ManyToMany(() => Role,(rol) => rol.permissions)
    roles: Role[]

}
