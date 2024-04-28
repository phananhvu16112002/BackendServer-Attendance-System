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
const AttendanceDetailDTO_1 = __importDefault(require("../dto/AttendanceDetailDTO"));
const StudentClassDTO_1 = __importDefault(require("../dto/StudentClassDTO"));
const ClassService_1 = __importDefault(require("../services/ClassService"));
const StudentClassService_1 = __importDefault(require("../services/StudentClassService"));
const CompareCaseInsentitive_1 = __importDefault(require("../utils/CompareCaseInsentitive"));
class StudentClassController {
    constructor() {
        this.getStudentClass = (req, res) => {
            res.json(StudentClassService_1.default.getStudentClass("520H0380", "5202111_09_t000"));
        };
        this.getStudentClasses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                const studentClasses = yield StudentClassService_1.default.getClassesByStudentID(studentID);
                return res.status(200).json(studentClasses);
            }
            catch (e) {
                return res.status(500).json({ message: "Cannot get classes" });
            }
        });
        //oke
        this.getStudentsWithAllAttendanceDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                console.log(req.payload);
                console.log(teacherID);
                const classID = req.params.id;
                //Find class with id
                let { data: classData, error } = yield ClassService_1.default.getClassesWithStudentsCourseTeacher(classID);
                if (error) {
                    return res.status(500).json({ message: error });
                }
                if (classData == null) {
                    return res.status(204).json({ message: "Class with this ID does not exist" });
                }
                //Check if teacher is in charge of this class
                if ((0, CompareCaseInsentitive_1.default)(teacherID, classData.teacher.teacherID) == false) {
                    return res.status(422).json({ message: "Teacher is not in charge of this class" });
                }
                //get all students along with their attendance Detail
                let { data, error: err } = yield StudentClassService_1.default.getStudentsAttendanceDetailsByClassID(classID);
                if (err) {
                    return res.status(500).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "There are no records for students' attendance details" });
                }
                let offset = classData.course.totalWeeks - classData.course.requiredWeeks;
                let { total, pass, ban, warning, data: result } = AttendanceDetailDTO_1.default.transformStudentsAttendanceDetails(data, offset);
                classData.total = total;
                classData.pass = pass;
                classData.ban = ban;
                classData.warning = warning;
                return res.status(200).json({ classData: classData, data: result });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //oke
        this.getClassesByStudentID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                let { data, error } = yield StudentClassService_1.default.getClassesByStudentID(studentID);
                if (error) {
                    return res.status(500).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "Student's not been enrolled in any class" });
                }
                StudentClassDTO_1.default.transformStudentClassesDTO(data);
                return res.status(200).json(data);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //must test 
        this.getStudentsByClassIDForTeacher = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const classID = req.params.id;
                const teacherID = req.payload.userID;
                let checkAuth = yield ClassService_1.default.getClassByID(classID);
                if (checkAuth == null) {
                    return res.status(503).json({ message: "Cannot authorize teacher to perform this action" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, checkAuth.teacher.teacherID) == false) {
                    return res.status(403).json({ message: "Action Denied. Teacher is not authorized" });
                }
                let { data, error } = yield StudentClassService_1.default.getStudentsByClassID(classID);
                if (error) {
                    return res.status(500).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //must test 
        this.getStudentsByClassIDForStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const classID = req.params.id;
                const studentID = req.payload.userID;
                let { data: data1, error: error1 } = yield StudentClassService_1.default.checkStudentEnrolledInClass(studentID, classID);
                if (error1) {
                    return res.status(503).json({ message: error1 });
                }
                if (data1 == null) {
                    return res.status(422).json({ message: "Student is not enrolled in this class" });
                }
                let { data, error } = yield StudentClassService_1.default.getStudentsByClassID(classID);
                if (error) {
                    return res.status(500).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new StudentClassController();
