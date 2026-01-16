import { DataSource } from "typeorm"

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'postgres',
    password: 'postgresql',
    database: 'bd_nest_backend',
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts']
});
