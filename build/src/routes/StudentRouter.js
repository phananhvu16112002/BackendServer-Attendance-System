"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StudentController_1 = __importDefault(require("../controllers/StudentController"));
const StudentRouter = express_1.default.Router();
StudentRouter.post("/register", StudentController_1.default.register);
StudentRouter.post("/verifyRegister", StudentController_1.default.verifyRegister);
StudentRouter.get("/test", StudentController_1.default.test);
exports.default = StudentRouter;
