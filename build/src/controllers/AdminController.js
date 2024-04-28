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
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ExcelService_1 = __importDefault(require("../services/ExcelService"));
const StudentService_1 = __importDefault(require("../services/StudentService"));
const CourseService_1 = __importDefault(require("../services/CourseService"));
const uuid_1 = require("uuid");
const StudentClass_1 = require("../models/StudentClass");
const db_config_1 = require("../config/db.config");
const Classes_1 = require("../models/Classes");
const Student_1 = require("../models/Student");
const ClassService_1 = __importDefault(require("../services/ClassService"));
const StudentClassService_1 = __importDefault(require("../services/StudentClassService"));
const TeacherService_1 = __importDefault(require("../services/TeacherService"));
const AdminService_1 = __importDefault(require("../services/AdminService"));
//$2b$10$Jy/x6brNkjrtIpPRRbHrQu8jh8k8o.l9qXPxAORF6G9fFAvmHr4JO //520h0380password!
//$2b$10$jf1lWevTaxoTjvYTr34l9.qDb0ZQoDNGFUK2uj2DPdrA7pXrgOc2G //520h0696password!
const studentClassRepository = db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass);
class AdminController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const password = req.body.password;
                let admin = yield AdminService_1.default.checkAdminExist(email);
                if (admin == null) {
                    return res.status(422).json({ message: "Account does not exist" });
                }
                if ((yield AdminService_1.default.login(admin, email, password)) == false) {
                    return res.status(422).json({ message: "Email or password incorrect" });
                }
                const accessToken = jsonwebtoken_1.default.sign({ userID: email, role: "admin" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
                const refreshToken = jsonwebtoken_1.default.sign({ userID: email, role: "admin" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' });
                return res.status(200).json({
                    message: "Login Successfully",
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                    adminEmail: admin.adminEmail
                });
            }
            catch (e) {
                console.error(e);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //oke
        this.uploadStudents = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const excelFile = req.files.file;
                let { data, error } = yield ExcelService_1.default.readStudentsFromExcel(excelFile);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                let { data: result, error: err } = yield StudentService_1.default.loadStudentsToDatabase(data);
                if (err) {
                    return res.status(503).json({ message: err });
                }
                return res.status(200).json({ data: data, message: `Upload students successfully. Row insert ${result.length}` });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //oke
        this.uploadTeachers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const excelFile = req.files.file;
                let { data, error } = yield ExcelService_1.default.readTeachersFromExcel(excelFile);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                let { data: result, error: err } = yield TeacherService_1.default.loadTeachersToDatabase(data);
                if (err) {
                    return res.status(503).json({ message: err });
                }
                return res.status(200).json({ data: data, message: `Upload teachers successfully. Row insert ${result.length}` });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //oke
        this.uploadCourses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const excelFile = req.files.file;
                let { data, error } = yield ExcelService_1.default.readCoursesFromExcel(excelFile);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                let { data: result, error: err } = yield CourseService_1.default.loadCoursesToDatabase(data);
                if (err) {
                    return res.status(503).json({ message: err });
                }
                if (result.length == 0) {
                    return res.status(204).json({ message: "No content" });
                }
                return res.status(200).json({ data: result, message: "Uploading course successfully" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //oke
        this.uploadClasses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseID = req.body.courseID;
                const teacherID = req.body.teacherID;
                const classID = (0, uuid_1.v4)();
                const roomNumber = req.body.roomNumber;
                const shiftNumber = req.body.shiftNumber;
                const startTime = req.body.startTime;
                const endTime = req.body.endTime;
                const classType = req.body.classType; // Lecture or Laboratory
                const group = req.body.group;
                const subGroup = req.body.subGroup;
                const fileExcel = req.files.file;
                let { data, error } = yield ExcelService_1.default.readStudentsInClassFromExcel(fileExcel, classID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                let classes = new Classes_1.Classes();
                classes.classID = classID;
                classes.roomNumber = roomNumber;
                classes.shiftNumber = shiftNumber;
                classes.startTime = startTime;
                classes.endTime = endTime;
                classes.classType = classType;
                classes.group = group;
                classes.subGroup = subGroup;
                classes.course = courseID;
                classes.teacher = teacherID;
                if (yield StudentClassService_1.default.uploadClass(classes, data)) {
                    let { data: result, error: err } = yield ClassService_1.default.getClassesByID(classID);
                    if (err) {
                        return res.status(503).json({ message: err });
                    }
                    return res.status(200).json({ data: result, message: "Class was formed" });
                }
                return res.status(503).json({ message: "Failed creating class" });
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //oke
        this.uploadMoreStudentsToClass = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const classID = req.params.id;
                const fileExcel = req.files.file;
                let { data, error } = yield ExcelService_1.default.readStudentsInClassFromExcel(fileExcel, classID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                if (yield StudentClassService_1.default.uploadStudentsInClass(data)) {
                    let { data: result, error: err } = yield ClassService_1.default.getClassesByID(classID);
                    if (err) {
                        return res.status(503).json({ message: err });
                    }
                    return res.status(200).json({ data: result, message: "Successfully uploading stundents" });
                }
                return res.status(503).json({ message: "Failed uploading students in class" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testable
        this.getCourses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { data, error } = yield CourseService_1.default.getCourses();
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testable
        this.getClassesByCourseID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseID = req.params.id;
                let { data, error } = yield ClassService_1.default.getClassesWithCourseAndTeacherByCourseID(courseID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testabel
        this.getClasses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { data, error } = yield ClassService_1.default.getClasses();
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testable
        this.getStudents = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { data, error } = yield StudentService_1.default.getStudents();
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testable
        this.getTeachers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { data, error } = yield TeacherService_1.default.getTeachers();
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testable
        this.postStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.body.studentID;
                const studentName = req.body.studentName;
                const studentEmail = req.body.studentEmail;
                if (ExcelService_1.default.checkInfo(studentID, studentEmail) == false) {
                    return res.status(422).json({ message: "Student ID and email must match the domain format" });
                }
                let { data, error } = yield StudentService_1.default.postStudent(studentID, studentName, studentEmail);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "No content" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testable
        this.postTeacher = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.body.teacherID;
                const teacherName = req.body.teacherName;
                const teacherEmail = req.body.teacherEmail;
                let { data, error } = yield TeacherService_1.default.postTeacher(teacherID, teacherName, teacherEmail);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "No content" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testalbe
        this.postCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseID = req.body.courseID;
                const courseName = req.body.courseName;
                const totalWeeks = req.body.totalWeeks;
                const requiredWeeks = req.body.requiredWeeks;
                const credit = req.body.credit;
                let { data, error } = yield CourseService_1.default.postCourse(courseID, courseName, totalWeeks, requiredWeeks, credit);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "No content" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.editStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let studentName = req.body.studentName;
                let studentID = req.params.id;
                if (yield StudentService_1.default.editStudent(studentID, studentName)) {
                    return res.status(200).json({ message: "Edit successfully" });
                }
                return res.status(503).json({ message: "Failed editing" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.editTeacher = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let teacherName = req.body.teacherName;
                let teacherID = req.params.id;
                if (yield TeacherService_1.default.editTeacher(teacherID, teacherName)) {
                    return res.status(200).json({ message: "Edit successfully" });
                }
                return res.status(503).json({ message: "Failed editing" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.editCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let courseID = req.params.id;
                let courseName = req.body.courseName;
                let totalWeeks = req.body.totalWeeks;
                let requiredWeeks = req.body.requiredWeeks;
                let credit = req.body.credit;
                if (yield CourseService_1.default.editCourse(courseID, courseName, totalWeeks, requiredWeeks, credit)) {
                    return res.status(200).json({ message: "Edit successfully" });
                }
                return res.status(503).json({ message: "Failed editing" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.editClass = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let classID = req.params.id;
                let roomNumber = req.body.roomNumber;
                let shiftNumber = req.body.shiftNumber;
                let startTime = req.body.startTime;
                let endTime = req.body.endTime;
                let classType = req.body.classType;
                let group = req.body.group;
                let subGroup = req.body.subGroup;
                let courseID = req.body.courseID;
                let teacherID = req.body.teacherID;
                if (yield ClassService_1.default.editClass(classID, roomNumber, shiftNumber, startTime, endTime, classType, group, subGroup, courseID, teacherID)) {
                    return res.status(200).json({ message: "Edit successfully" });
                }
                return res.status(503).json({ message: "Failed editing" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.getCoursesWithPagination = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let page = req.params.page;
                let { data, error } = yield CourseService_1.default.getCoursesWithPagination(page);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testable
        this.getClassesByCourseIDWithPagination = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const courseID = req.params.id;
                let page = req.params.page;
                let { data, error } = yield ClassService_1.default.getClassesWithCourseAndTeacherByCourseIDWithPagination(courseID, page);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                console.log(data);
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.getClassesWithPagination = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let page = req.params.page;
                let { data, error } = yield ClassService_1.default.getClassesWithPagination(page);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "No content found in this excel" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.deleteCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let courseID = req.params.id;
                let valid = yield CourseService_1.default.deleteCourse(courseID);
                if (!valid) {
                    return res.status(503).json({ message: `Failed deleting course with ${courseID}` });
                }
                return res.status(200).json({ id: courseID, message: "Successfully deleted course" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.deleteClass = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let classID = req.params.id;
                let valid = yield ClassService_1.default.deleteClass(classID);
                if (!valid) {
                    return res.status(503).json({ message: `Failed deleting class with ${courseID}` });
                }
                return res.status(200).json({ id: classID, message: "Successfully deleted class" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.deleteStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let studentID = req.params.id;
                let valid = yield StudentService_1.default.deleteStudent(studentID);
                if (!valid) {
                    return res.status(503).json({ message: `Failed deleting student with ${studentID}` });
                }
                return res.status(200).json({ id: studentID, message: "Successfully deleted student" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.deleteTeacher = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let teacherID = req.params.id;
                let valid = yield TeacherService_1.default.deleteTeacher(teacherID);
                if (!valid) {
                    return res.status(503).json({ message: `Failed deleting teacher with ${teacherID}` });
                }
                return res.status(200).json({ id: teacherID, message: "Successfully deleted teacher" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.addStudentInClass = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let studentID = req.body.studentID;
                let classID = req.body.classID;
                let valid = yield StudentClassService_1.default.addStudentInClass(classID, studentID);
                if (!valid) {
                    return res.status(503).json({ message: `Failed adding student with id ${studentID} in class id ${classID}` });
                }
                return res.status(200).json({ id: studentID, message: `Successfully adding student with id ${studentID} in class id ${classID}` });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.removeStudentInClass = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let studentID = req.params.studentid;
                let classID = req.params.classid;
                let valid = yield StudentClassService_1.default.removeStudentFromClass(classID, studentID);
                if (!valid) {
                    return res.status(503).json({ message: `Failed removing student with id ${studentID} in class id ${classID}` });
                }
                return res.status(200).json({ id: studentID, message: `Successfully removing student with id ${studentID} in class id ${classID}` });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.removeAllStudentsInClass = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let classID = req.params.id;
                let valid = yield StudentClassService_1.default.removeAllStudentsFromClass(classID);
                if (!valid) {
                    return res.status(503).json({ message: `Failed removing students in class id ${classID}` });
                }
                return res.status(200).json({ message: `Successfully removing students in class id ${classID}` });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //search for student
        this.searchStudentByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let studentID = req.params.id;
                let { data, error } = yield StudentService_1.default.searchStudent(studentID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //search for teacher
        this.searchTeacherByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let teacherID = req.params.id;
                let { data, error } = yield TeacherService_1.default.searchTeacher(teacherID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        this.getStudentsByClassID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const classID = req.params.id;
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
exports.default = new AdminController();
