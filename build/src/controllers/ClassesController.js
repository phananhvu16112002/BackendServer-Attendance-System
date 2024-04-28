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
const ClassService_1 = __importDefault(require("../services/ClassService"));
const classService = ClassService_1.default;
class ClassesController {
    constructor() {
        this.getClassesWithCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                const { data, error } = yield classService.getClassesWithCoursesByTeacherID(teacherID);
                if (error) {
                    return res.status(500).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "Teacher is not in charge of any class" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        this.getClassesWithCourseWithPagination = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                let page = req.params.page;
                if (page <= 0) {
                    page = 1;
                }
                let skip = (page - 1) * 9;
                const { data, error } = yield classService.getClassesWithCoursesByTeacherIDWithPagination(teacherID, skip, 9);
                if (error) {
                    return res.status(500).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "Teacher is not in charge of any class" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new ClassesController();
