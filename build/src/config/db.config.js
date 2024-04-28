"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityManager = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "mysql",
    port: 3306,
    username: "root",
    password: "123456",
    database: "ATTENDANCESYSTEM",
    synchronize: true,
    logging: true,
    entities: ["./src/models/*.ts", "./src/models/*.js"],
    subscribers: [],
    migrations: [],
});
exports.entityManager = exports.AppDataSource.manager;
const Connections = () => {
    exports.AppDataSource.initialize().then(() => {
        console.log('DB Connected');
    }).catch((e) => {
        console.log('error' + e);
    });
};
exports.default = Connections;
