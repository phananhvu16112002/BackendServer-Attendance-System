import {DataSource} from 'typeorm';


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1234",
    database: "ATTENDANCESYSTEM",
    synchronize: true,
    logging: true,
    entities: ["./src/models/*.ts", "./src/models/*.js"],
    subscribers: [],
    migrations: [],
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