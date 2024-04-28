"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const CompareCaseInsentitive_1 = __importDefault(require("../utils/CompareCaseInsentitive"));
const db_config_1 = require("../config/db.config");
const Employee_1 = require("../models/Employee");
const adminRepository = db_config_1.AppDataSource.getRepository(Employee_1.Employee);
class AdminService {
    constructor() {
        this.checkAdminExist = (email) => __awaiter(this, void 0, void 0, function* () {
            try {
                let admin = yield adminRepository.findOneBy({
                    employeeEmail: email
                });
                return admin;
            }
            catch (e) {
                return null;
            }
        });
        //testable
        this.login = (admin, email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield bcrypt_1.default.compare(password, admin.employeeHashedPassword);
                if ((0, CompareCaseInsentitive_1.default)(email, admin.employeeEmail) && result) {
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = new AdminService();
