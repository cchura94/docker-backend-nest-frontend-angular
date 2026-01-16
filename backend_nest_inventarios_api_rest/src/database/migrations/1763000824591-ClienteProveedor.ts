import { MigrationInterface, QueryRunner } from "typeorm";

export class ClienteProveedor1763000824591 implements MigrationInterface {
    name = 'ClienteProveedor1763000824591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clientes" ("id" SERIAL NOT NULL, "tipo" character varying NOT NULL, "razon_social" character varying(255) NOT NULL, "identificacion" character varying(100), "telefono" character varying(20), "direccion" character varying(255), "correo" character varying(200), "estado" boolean NOT NULL, CONSTRAINT "PK_d76bf3571d906e4e86470482c08" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clientes"`);
    }

}
