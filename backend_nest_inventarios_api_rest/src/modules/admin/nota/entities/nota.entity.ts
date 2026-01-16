import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ClienteProveedor } from "../../cliente-proveedor/entities/cliente-proveedor.entity";
import { User } from "../../users/entities/user.entity";
import { Movimiento } from "./movimiento.entity";

@Entity('notas')
export class Nota {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    fecha: Date;

    @Column()
    tipo_nota: string // 'compra' || 'venta'

    @ManyToOne(() => ClienteProveedor, {eager: true})
    cliente: ClienteProveedor;

    @ManyToOne(() => User, {eager: true})
    user: User;

    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true})
    impuestos: number;

    @Column({type: 'decimal', precision: 12, scale: 2, nullable: true})
    descuento: number;

    @Column({length: 50})
    estado_nota: string;

    @Column({type: 'text', nullable: true})
    observaciones: string;

    @OneToMany(() => Movimiento, mov => mov.nota)
    movimientos: Movimiento[]
}
