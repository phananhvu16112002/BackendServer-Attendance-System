import {DataSource} from 'typeorm';
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: ["./src/models/*.ts", "./src/models/*.js"],
    subscribers: [],
    migrations: ["./src/migrations/*.ts", "./src/migrations/*.js"]
})

export const entityManager = AppDataSource.manager;

const Connections = () => {
    AppDataSource.initialize().then(() => {
        console.log('DB Connected');
    }).catch((e: any) => {
        console.log('error'+e)
    });
}

export default Connections;