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
const exceljs_1 = __importDefault(require("exceljs"));
const Course_1 = require("../models/Course");
const Teacher_1 = require("../models/Teacher");
const Student_1 = require("../models/Student");
const StudentClass_1 = require("../models/StudentClass");
class ExcelService {
    constructor() {
        this.uploadExcel = () => __awaiter(this, void 0, void 0, function* () {
        });
        this.checkInfo = (teacherID, teacherEmail) => {
            try {
                let prefix = teacherEmail.split("@");
                if (prefix[1] != "student.tdtu.edu.vn") {
                    return false;
                }
                if (teacherID.toUpperCase() != prefix[0]) {
                    return false;
                }
                return true;
            }
            catch (e) {
                return false;
            }
        };
        this.readStudentsFromExcel = (fileExcel) => __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = fileExcel.data;
                const workbook = new exceljs_1.default.Workbook();
                const content = yield workbook.xlsx.load(buffer, { type: "buffer" });
                const worksheet = content.worksheets[0];
                let students = [];
                for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
                    let row = worksheet.getRow(rowIndex);
                    let student = new Student_1.Student();
                    student.studentID = row.getCell(1).text;
                    student.studentName = row.getCell(2).text;
                    student.studentEmail = row.getCell(3).text;
                    console.log(student);
                    if (student.studentID != "") {
                        if (this.checkInfo(student.studentID, student.studentEmail) == false) {
                            return { data: [], error: `Error detected at row ${rowIndex}. Invalid data for studentID: ${student.studentID}, studentEmail: ${student.studentEmail}` };
                        }
                        students.push(student);
                    }
                }
                return { data: students, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Error exporting students" };
            }
        });
        this.readTeachersFromExcel = (fileExcel) => __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = fileExcel.data;
                const workbook = new exceljs_1.default.Workbook();
                const content = yield workbook.xlsx.load(buffer, { type: "buffer" });
                const worksheet = content.worksheets[0];
                let teachers = [];
                for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
                    let row = worksheet.getRow(rowIndex);
                    let teacher = new Teacher_1.Teacher();
                    teacher.teacherID = row.getCell(1).text;
                    teacher.teacherName = row.getCell(2).text;
                    teacher.teacherEmail = row.getCell(3).text;
                    console.log(teacher);
                    if (teacher.teacherID != "") {
                        if (this.checkInfo(teacher.teacherID, teacher.teacherEmail) == false) {
                            return { data: [], error: `Error detected at row ${rowIndex}. Invalid data for teacherID: ${teacher.teacherID}, teacherEmail: ${teacher.teacherEmail}` };
                        }
                        teachers.push(teacher);
                    }
                }
                return { data: teachers, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Error exporting teachers" };
            }
        });
        this.readCoursesFromExcel = (fileExcel) => __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = fileExcel.data;
                const workbook = new exceljs_1.default.Workbook();
                const content = yield workbook.xlsx.load(buffer, { type: "buffer" });
                const worksheet = content.worksheets[0];
                let courses = [];
                for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
                    let row = worksheet.getRow(rowIndex);
                    let course = new Course_1.Course();
                    course.courseID = row.getCell(1).text;
                    course.courseName = row.getCell(2).text;
                    course.totalWeeks = parseInt(row.getCell(3).text);
                    course.requiredWeeks = parseInt(row.getCell(4).text);
                    course.credit = parseInt(row.getCell(5).text);
                    console.log(course);
                    if (course.courseID != "") {
                        courses.push(course);
                    }
                }
                return { data: courses, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Error exporting course" };
            }
        });
        //testable
        this.readStudentsInClassFromExcel = (fileExcel, classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                const buffer = fileExcel.data;
                const workbook = new exceljs_1.default.Workbook();
                const content = yield workbook.xlsx.load(buffer, { type: "buffer" });
                const worksheet = content.worksheets[0];
                let studentClasses = [];
                for (let rowIndex = 2; rowIndex <= worksheet.rowCount; rowIndex++) {
                    let row = worksheet.getRow(rowIndex);
                    let studentClass = new StudentClass_1.StudentClass();
                    studentClass.studentDetail = row.getCell(1).text;
                    studentClass.classDetail = classID;
                    if (studentClass.studentDetail != "") {
                        studentClasses.push(studentClass);
                    }
                }
                return { data: studentClasses, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Error teacher to class" };
            }
        });
    }
}
exports.default = new ExcelService();
