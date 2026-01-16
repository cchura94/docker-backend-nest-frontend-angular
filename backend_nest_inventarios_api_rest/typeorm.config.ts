import { DataSource } from "typeorm"

export default new DataSource({
    type: 'postgres',
    host: 'postgres_inv',
    port: 5432,
    username: 'postgres',
    password: 'admin54321',
    database: 'bd_nest_backend',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts']
});
