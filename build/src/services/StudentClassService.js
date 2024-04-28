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
const db_config_1 = require("../config/db.config");
const StudentClass_1 = require("../models/StudentClass");
const Course_1 = require("../models/Course");
const Teacher_1 = require("../models/Teacher");
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const Classes_1 = require("../models/Classes");
const Student_1 = require("../models/Student");
const StudentClassDTO_1 = __importDefault(require("../dto/StudentClassDTO"));
const StudentDeviceToken_1 = require("../models/StudentDeviceToken");
const studentClassRepository = db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass);
class StudentClassService {
    constructor() {
        this.getStudentClass = (studentID, classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield studentClassRepository.findOne({
                    where: {
                        studentDetail: studentID,
                        classDetail: classID
                    },
                    relations: {
                        studentDetail: true,
                        classDetail: true
                    }
                });
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
        this.checkStudentEnrolledInClass = (studentID, classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentClassRepository.findOne({
                    where: {
                        studentDetail: studentID,
                        classDetail: classID
                    }
                });
                return { data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed fetching data" };
            }
        });
        // getClassesByStudentID = async (studentID) => {
        //     try {
        //         const studentClasses = await studentClassRepository.find({
        //             where: {studentDetail : studentID},
        //             select : {
        //                 studentDetail : {
        //                     studentID : true,
        //                 },
        //                 classDetail : {
        //                     classID : true,
        //                     roomNumber : true,
        //                     shiftNumber : true,
        //                     classType : true,
        //                     group : true,
        //                     subGroup : true,
        //                     teacher : {
        //                         teacherID : true,
        //                         teacherName : true
        //                     },
        //                     course : {
        //                         courseID : true,
        //                         courseName : true,
        //                         totalWeeks : true
        //                     }
        //                 }
        //             },
        //             relations: {
        //                 studentDetail: true,
        //                 classDetail : {
        //                     teacher : true,
        //                     course : true,
        //                 }
        //             }
        //         });
        //         // return 
        //         return {data:await StudentClassDTO.injectTotalDetails(studentClasses), error: null};
        //     } catch (e) {
        //         return null;
        //     }
        // }
        //oke used in studentcontroller
        // getClassesByStudentID = async (studentID) => {
        //     try {
        //         let data = await studentClassRepository.createQueryBuilder("student_class"). 
        //             innerJoinAndMapOne('student_class.classDetail', Classes, 'classes', "student_class.classID = classes.classID").
        //             innerJoinAndMapOne('classes.course', Course, 'course', "course.courseID = classes.courseID").
        //             innerJoinAndMapOne('classes.teacher', Teacher, 'teacher', "classes.teacherID = teacher.teacherID").
        //             innerJoinAndMapMany('student_class.attendancedetails', AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
        //             select('student_class.*').addSelect('COUNT(*) as Total').addSelect(`SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS TotalPresence`,).
        //             addSelect(`SUM(CASE WHEN result = 0 THEN 1 ELSE 0 END) AS TotalAbsence`,).addSelect(`SUM(CASE WHEN result = 0.5 THEN 1 else 0 END) AS TotalLate`,).
        //             addSelect('classes.*').addSelect('course.*').addSelect('teacher.teacherID, teacher.teacherEmail ,teacher.teacherName').
        //             groupBy('student_class.classID').
        //             where("student_class.studentID = :id", {id : studentID}).
        //             getRawMany();
        //         return {data, error: null};
        //     } catch(e){
        //         return {data: null, error: "Fetching failed"};
        //     }
        // }
        //oke used in studentcontroller
        this.getClassesByStudentID = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                // const studentID = studentID;
                let data = yield studentClassRepository.createQueryBuilder("student_class").
                    innerJoinAndMapOne('student_class.classDetail', Classes_1.Classes, 'classes', "student_class.classID = classes.classID").
                    innerJoinAndMapOne('classes.course', Course_1.Course, 'course', "course.courseID = classes.courseID").
                    innerJoinAndMapOne('classes.teacher', Teacher_1.Teacher, 'teacher', "classes.teacherID = teacher.teacherID").
                    leftJoinAndMapMany('student_class.attendancedetails', AttendanceDetail_1.AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
                    select('student_class.*').addSelect('COUNT(attendancedetail.formID) as total').addSelect(`SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS totalPresence`).
                    addSelect(`SUM(CASE WHEN result = 0 THEN 1 ELSE 0 END) AS totalAbsence`).addSelect(`SUM(CASE WHEN result = 0.5 THEN 1 else 0 END) AS totalLate`).
                    addSelect('classes.*').addSelect('course.*').addSelect('teacher.teacherID, teacher.teacherEmail ,teacher.teacherName').
                    groupBy('student_class.classID').
                    where("student_class.studentID = :id", { id: studentID }).
                    getRawMany();
                return { data, error: null };
            }
            catch (e) {
                return { data: null, error: "Fetching failed" };
            }
        });
        //oke used in studentcontroller
        this.getStudentsAttendanceDetailsByClassID = (classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentClassRepository.createQueryBuilder("student_class").
                    innerJoinAndMapOne("student_class.student", Student_1.Student, "student", "student.studentID = student_class.studentID").
                    leftJoinAndMapMany('student_class.attendancedetails', AttendanceDetail_1.AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
                    //will be sorted by created date
                    orderBy('attendancedetail.createdAt', 'ASC').
                    where("student_class.classID = :id", { id: classID }).getMany();
                return { data: data, error: null };
            }
            catch (e) {
                return { data: [], error: "Failed fecthing" };
            }
        });
        //oke
        this.getStudentsAttendanceDetailsWithDeviceTokenByClassID = (classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentClassRepository.createQueryBuilder("student_class").
                    innerJoinAndMapOne("student_class.student", Student_1.Student, "student", "student.studentID = student_class.studentID").
                    leftJoinAndMapMany("student_class.tokens", StudentDeviceToken_1.StudentDeviceToken, "tokens", "tokens.studentID = student_class.studentID").
                    leftJoinAndMapMany('student_class.attendancedetails', AttendanceDetail_1.AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
                    where("student_class.classID = :id", { id: classID }).getMany();
                return { data: data, error: null };
            }
            catch (e) {
                return { data: [], error: "Failed fetching" };
            }
        });
        //upload class for student 
        this.uploadClass = (classes, studentclass) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    yield transactionalEntityManager.save(classes);
                    yield transactionalEntityManager.save(studentclass);
                }));
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //must test
        this.uploadStudentsInClass = (studentClass) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield studentClassRepository.save(studentClass);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //must test
        this.getStudentsByClassID = (classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentClassRepository.find({
                    where: {
                        classDetail: classID
                    },
                    select: {
                        studentDetail: {
                            studentID: true,
                            studentEmail: true,
                            studentName: true
                        }
                    },
                    relations: {
                        studentDetail: true,
                        classDetail: false
                    }
                });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: [], error: "Cannot fetch all the student inside this class" };
            }
        });
        //must test
        this.addStudentInClass = (classID, studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let studentClass = new StudentClass_1.StudentClass();
                studentClass.classDetail = classID;
                studentClass.studentDetail = studentID;
                yield studentClassRepository.insert(studentClass);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //must test
        this.removeStudentFromClass = (classID, studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield studentClassRepository.delete({
                    studentDetail: studentID,
                    classDetail: classID
                });
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //must test
        this.removeAllStudentsFromClass = (classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield studentClassRepository.delete({
                    classDetail: classID
                });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = new StudentClassService();
