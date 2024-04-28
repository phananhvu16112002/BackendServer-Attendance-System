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
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const AttendanceForm_1 = require("../models/AttendanceForm");
const Report_1 = require("../models/Report");
const StudentClass_1 = require("../models/StudentClass");
const UploadImageService_1 = __importDefault(require("./UploadImageService"));
const TimeConvert_1 = require("../utils/TimeConvert");
const Feedback_1 = require("../models/Feedback");
const Classes_1 = require("../models/Classes");
const Teacher_1 = require("../models/Teacher");
const Course_1 = require("../models/Course");
const Student_1 = require("../models/Student");
const HistoryReport_1 = require("../models/HistoryReport");
const ReportImage_1 = require("../models/ReportImage");
const reportRepository = db_config_1.AppDataSource.getRepository(Report_1.Report);
const attendanceDetailRepository = db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail);
const studentClassRepository = db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass);
const attendanceFormRepository = db_config_1.AppDataSource.getRepository(AttendanceForm_1.AttendanceForm);
const classesRepository = db_config_1.AppDataSource.getRepository(Classes_1.Classes);
const historyReportRepository = db_config_1.AppDataSource.getRepository(HistoryReport_1.HistoryReport);
class ReportService {
    constructor() {
        this.getInfoReportImage = (editedImage, imageReportList) => {
            let keepImageReportList = [];
            let editReportImageList = [];
            for (let i = 0; i < imageReportList.length; i++) {
                if (editedImage.includes(imageReportList[i].imageID)) {
                    editReportImageList.push(imageReportList[i]);
                }
                else {
                    keepImageReportList.push(imageReportList[i]);
                }
            }
            return { keep: keepImageReportList, edit: editReportImageList };
        };
        //oke
        this.getEditedReportImage = (editedImage) => {
            let editReportImageList = [];
            for (let i = 0; i < editedImage.length; i++) {
                let editReportImage = new ReportImage_1.ReportImage();
                editReportImage.imageID = editedImage[i];
                editReportImage.imageURL = "https://i.imgur.com/" + editedImage[i] + ".png";
                editReportImageList.push(editReportImage);
            }
            return editReportImageList;
        };
        //oke
        this.getReportDetail = (reportID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield reportRepository.findOne({
                    where: { reportID: reportID },
                    relations: {
                        reportImage: true,
                        attendanceDetail: true,
                        feedback: true,
                    }
                });
                return { data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed fetching report" };
            }
        });
        this.getReportByID = (reportID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield reportRepository.findOne({
                    where: { reportID: reportID },
                    relations: {
                        attendanceDetail: true,
                        feedback: true
                    }
                });
                return { data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed fetching report" };
            }
        });
        //oke
        this.checkReportExist = (attendanceDetail) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield reportRepository.findOne({
                    where: {
                        attendanceDetail: attendanceDetail
                    }
                });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed fetching report" };
            }
        });
        //oke
        this.getReportWithRelation = (reportID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield reportRepository.findOne({
                    where: { reportID: reportID },
                    relations: {
                        attendanceDetail: true,
                        reportImage: true,
                        feedback: true
                    }
                });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed getting report" };
            }
        });
        //not oke
        this.createReport = (message, studentID, classID, formID) => __awaiter(this, void 0, void 0, function* () {
            let studentClass = yield studentClassRepository.findOneBy({ studentID: studentID, classID: classID });
            let attendanceForm = yield attendanceFormRepository.findOneBy({ formID: formID });
            if (studentClass == null || attendanceForm == null) {
                return null;
            }
            let attendanceDetail = yield attendanceDetailRepository.findOneBy({ studentClass: studentClass, attendanceForm: attendanceForm });
            let report = new Report_1.Report();
            report.message = message;
            report.attendanceDetail = attendanceDetail;
            yield reportRepository.save(report);
            return report;
        });
        //oke testable
        this.reportObject = (data, topic, problem, message, imageReportList) => {
            let report = new Report_1.Report();
            report.attendanceDetail = data;
            report.topic = topic;
            report.problem = problem;
            report.message = message;
            report.reportImage = imageReportList;
            report.status = "Pending";
            report.important = false;
            report.new = true;
            report.createdAt = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
            return report;
        };
        //oke testable, test it
        this.loadReportWithImages = (data, topic, problem, message, imageReportList) => __awaiter(this, void 0, void 0, function* () {
            try {
                let report = this.reportObject(data, topic, problem, message, imageReportList);
                let result = yield reportRepository.save(report);
                return { data: result, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: null, error: "Failed creating report" };
            }
        });
        //
        this.getAllReportsByStudentID = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield reportRepository.createQueryBuilder("report").
                    innerJoinAndMapOne("report.classes", Classes_1.Classes, "classes", 'report.classID = classes.classID').
                    innerJoinAndMapOne("report.teacher", Teacher_1.Teacher, "teacher", 'classes.teacherID = teacher.teacherID').
                    innerJoinAndMapOne("report.course", Course_1.Course, "course", "classes.courseID = course.courseID").
                    leftJoinAndMapOne("report.feedback", Feedback_1.Feedback, "feedback", "report.reportID = feedback.reportID").
                    select('report.*').addSelect('classes').addSelect('course').addSelect('teacher.teacherID, teacher.teacherEmail ,teacher.teacherName').addSelect("feedback").
                    orderBy("report.createdAt", "DESC").
                    where("report.studentID = :id", { id: studentID }).getRawMany();
                return { data: data, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Failed fetching data" };
            }
        });
        //
        this.getAllReportsByStudentID_ClassID = (studentID, classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield reportRepository.createQueryBuilder("report").
                    leftJoinAndMapOne("report.feedback", Feedback_1.Feedback, 'feedback', 'feedback.reportID = report.reportID').
                    orderBy("report.createdAt", "DESC").
                    where("report.studentID = :studentid", { studentid: studentID }).
                    andWhere("report.classID = :classid", { classid: classID }).
                    getMany();
                return { data: data, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Failed fetching reports" };
            }
        });
        //
        this.getAllReportsByTeacherID = (teacherID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield classesRepository.createQueryBuilder("classes").
                    innerJoinAndMapMany("classes.report", Report_1.Report, 'report', "report.classID = classes.classID").
                    innerJoinAndMapOne("classes.course", Course_1.Course, 'course', "course.courseID = classes.courseID").
                    innerJoinAndMapOne("classes.student", Student_1.Student, 'student', "report.studentID = student.studentID").
                    select('classes.*').addSelect("course.*").addSelect("report.*").addSelect('student.studentID, student.studentEmail ,student.studentName').
                    orderBy('report.new', "DESC").addOrderBy("report.createdAt", "DESC").
                    where("classes.teacherID = :id", { id: teacherID }).
                    getRawMany();
                return { data: data, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Failed fetching reports" };
            }
        });
        //
        this.getReportDetailByReportID = (reportID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield reportRepository.findOne({
                    where: { reportID: reportID },
                    relations: {
                        attendanceDetail: true,
                        feedback: true,
                        historyReports: true,
                        reportImage: true
                    },
                    order: {
                        historyReports: {
                            createdAt: {
                                direction: "DESC"
                            }
                        }
                    }
                });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed fetching report detail" };
            }
        });
        this.getHistoryReportByHistoryID = (historyID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield historyReportRepository.findOne({
                    where: { historyReportID: historyID },
                    relations: {
                        historyFeedbacks: true,
                        historyReportImages: true
                    }
                });
                return { data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed fetching report detail" };
            }
        });
        this.getNotificationReport = (teacherID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let importantNews = yield reportRepository.createQueryBuilder("report").
                    innerJoin(Classes_1.Classes, "classes", "report.classID = classes.classID").
                    orderBy('report.important', 'DESC').addOrderBy('report.new', 'DESC').addOrderBy('report.createdAt', 'DESC').
                    where("classes.teacherID = :id", { id: teacherID }).skip(0).take(6).getRawMany();
                let lastestNews = yield reportRepository.createQueryBuilder("report").
                    innerJoin(Classes_1.Classes, "classes", "report.classID = classes.classID").
                    orderBy('report.new', 'DESC').addOrderBy('report.createdAt', 'DESC').
                    where("classes.teacherID = :id", { id: teacherID }).skip(0).take(5).getRawMany();
                let stats = yield reportRepository.createQueryBuilder("report").
                    select('COUNT(*) as total').addSelect(`SUM(CASE WHEN new = 1 THEN 1 ELSE 0 END) AS totalNew`).
                    addSelect(`SUM(CASE WHEN new = 0 THEN 1 ELSE 0 END) AS totalOld`).
                    innerJoin(Classes_1.Classes, "classes", "report.classID = classes.classID").
                    where("classes.teacherID = :id", { id: teacherID }).getRawOne();
                return { importantNews, lastestNews, stats, error: null };
            }
            catch (e) {
                return { importantNews: [], lastestNews: [], stats: null, error: "Failed getting stats" };
            }
        });
        //must test
        this.getNotificationReportWithPagination = (teacherID, skip, take) => __awaiter(this, void 0, void 0, function* () {
            try {
                let importantNews = yield reportRepository.createQueryBuilder("report").
                    innerJoin(Classes_1.Classes, "classes", "report.classID = classes.classID").
                    orderBy('report.createdAt', 'DESC').where("classes.teacherID = :id", { id: teacherID }).skip(skip).take(take).getRawMany();
                return { importantNews: importantNews, eror: null };
            }
            catch (e) {
                return { importantNews: [], error: "Failed getting stats" };
            }
        });
        //
        this.getAllReportsByTeacherIDWithPagination = (teacherID, skip, take) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield classesRepository.createQueryBuilder("classes").
                    innerJoinAndMapMany("classes.report", Report_1.Report, 'report', "report.classID = classes.classID").
                    innerJoinAndMapOne("classes.course", Course_1.Course, 'course', "course.courseID = classes.courseID").
                    innerJoinAndMapOne("classes.student", Student_1.Student, 'student', "report.studentID = student.studentID").
                    select('classes.*').addSelect("course.*").addSelect("report.*").addSelect('student.studentID, student.studentEmail ,student.studentName').
                    orderBy('report.new', "DESC").addOrderBy("report.createdAt", "DESC").
                    where("classes.teacherID = :id", { id: teacherID }).skip(skip).take(take).
                    getRawMany();
                return { data: data, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Failed fetching reports" };
            }
        });
    }
}
exports.default = new ReportService();
