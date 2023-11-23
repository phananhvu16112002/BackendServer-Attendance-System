"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_config_1 = __importDefault(require("./src/config/db.config"));
const body_parser_1 = __importDefault(require("body-parser"));
const StudentRouter_1 = __importDefault(require("./src/routes/StudentRouter"));
const app = (0, express_1.default)();
(0, db_config_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api/student", StudentRouter_1.default);
app.listen(8080, () => console.log("Hello"));
