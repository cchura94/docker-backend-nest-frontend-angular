import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotaMovimientosTable1763086268214 implements MigrationInterface {
    name = 'CreateNotaMovimientosTable1763086268214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movimientos" ("id" SERIAL NOT NULL, "cantidad" integer NOT NULL, "tipo_movimiento" character varying(20) NOT NULL, "precio_unitario_compra" numeric(12,2) NOT NULL, "precio_unitario_venta" numeric(12,2) NOT NULL, "observaciones" text, "notaId" integer, "productoId" integer, "almacenId" integer, CONSTRAINT "PK_519702aa97def3e7c1b6cc5e2f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notas" ("id" SERIAL NOT NULL, "fecha" TIMESTAMP NOT NULL, "tipo_nota" character varying NOT NULL, "impuestos" numeric(12,2), "descuento" numeric(12,2), "estado_nota" character varying(50) NOT NULL, "observaciones" text, "clienteId" integer, "userId" uuid, CONSTRAINT "UQ_b96326a7b67dcea6caea376982b" UNIQUE ("fecha"), CONSTRAINT "PK_1f3d47f136b291534c128bb4516" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "movimientos" ADD CONSTRAINT "FK_6b86c0b2260b156dab7e1da872b" FOREIGN KEY ("notaId") REFERENCES "notas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos" ADD CONSTRAINT "FK_bb83d42e45a0025561edbf6652a" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos" ADD CONSTRAINT "FK_f0715d29735042ca1b992a550ab" FOREIGN KEY ("almacenId") REFERENCES "almacenes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notas" ADD CONSTRAINT "FK_d5012b51542e1b0f08ecbb112ef" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notas" ADD CONSTRAINT "FK_4037433a40a6d913c18a9ea6948" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notas" DROP CONSTRAINT "FK_4037433a40a6d913c18a9ea6948"`);
        await queryRunner.query(`ALTER TABLE "notas" DROP CONSTRAINT "FK_d5012b51542e1b0f08ecbb112ef"`);
        await queryRunner.query(`ALTER TABLE "movimientos" DROP CONSTRAINT "FK_f0715d29735042ca1b992a550ab"`);
        await queryRunner.query(`ALTER TABLE "movimientos" DROP CONSTRAINT "FK_bb83d42e45a0025561edbf6652a"`);
        await queryRunner.query(`ALTER TABLE "movimientos" DROP CONSTRAINT "FK_6b86c0b2260b156dab7e1da872b"`);
        await queryRunner.query(`DROP TABLE "notas"`);
        await queryRunner.query(`DROP TABLE "movimientos"`);
    }

}
