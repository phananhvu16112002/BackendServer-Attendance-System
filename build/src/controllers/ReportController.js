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
const AttendanceDetailService_1 = __importDefault(require("../services/AttendanceDetailService"));
const HistoryReportService_1 = __importDefault(require("../services/HistoryReportService"));
const ReportImageService_1 = __importDefault(require("../services/ReportImageService"));
const ReportService_1 = __importDefault(require("../services/ReportService"));
const TimeConvert_1 = require("../utils/TimeConvert");
const CompareCaseInsentitive_1 = __importDefault(require("../utils/CompareCaseInsentitive"));
const ClassService_1 = __importDefault(require("../services/ClassService"));
class ReportController {
    constructor() {
        //oke 
        this.submitReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                const classID = req.body.classID;
                const formID = req.body.formID;
                const topic = req.body.topic;
                const problem = req.body.problem;
                const message = req.body.message;
                if (req.files == null) {
                    return res.status(422).json({ message: "Please send at least one image" });
                }
                let files = req.files.file;
                if (files == null) {
                    files = [];
                }
                if (!Array.isArray(files)) {
                    files = [files];
                }
                if (files.length > 3) {
                    return res.status(422).json({ message: "Only three image files allowed" });
                }
                //check student attendance detail exists
                let { data, error } = yield AttendanceDetailService_1.default.checkAttendanceDetailExist(studentID, classID, formID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(422).json({ message: "Your attendance records do not exist" });
                }
                //check report exists
                let { data: reportData, error: reportError } = yield ReportService_1.default.checkReportExist(data);
                if (reportError) {
                    return res.status(503).json({ message: reportError });
                }
                if (reportData) {
                    return res.status(422).json({ message: "Report's only been created once. Please edit report" });
                }
                //send files to Imgur
                let imageReportList = yield ReportImageService_1.default.imageReportListFromImage(files);
                if (imageReportList.length == 0) {
                    return res.status(503).json({ message: "Failed to upload images. Please upload again" });
                }
                //Transactions
                let { data: result, error: err } = yield ReportService_1.default.loadReportWithImages(data, topic, problem, message, imageReportList);
                if (err) {
                    yield ReportImageService_1.default.deleteImageReportList(imageReportList);
                    return res.status(503).json({ message: err });
                }
                return res.status(200).json(result);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //Oke
        this.editReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('--------' + req.body.listDelete);
                const reportID = req.params.id;
                const studentID = req.payload.userID;
                const topic = req.body.topic;
                const problem = req.body.problem;
                const message = req.body.message;
                const status = "Pending";
                const createdAt = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
                let listDelete = [];
                if (req.body.listDelete != null) {
                    listDelete = req.body.listDelete;
                    listDelete = listDelete.replace(/'/g, '"');
                    console.log('Xuwr ly anh cu:' + listDelete);
                    listDelete = JSON.parse(listDelete);
                    // console.log(listDelete);
                }
                let files = null;
                if (req.files != null) {
                    files = req.files.file;
                }
                if (files == null) {
                    files = [];
                }
                if (!Array.isArray(files)) {
                    files = [files];
                }
                if (files.length > 3) {
                    return res.status(422).json({ message: "Only three image files allowed" });
                }
                let { data, error } = yield ReportService_1.default.getReportWithRelation(reportID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: `Report with id ${reportID} does not exist` });
                }
                if ((0, CompareCaseInsentitive_1.default)(studentID, data.attendanceDetail.studentDetail) == false) {
                    return res.status(403).json({ message: "Action Denied. Student is not authorized" });
                }
                // console.log(data.reportImage);
                console.log(listDelete);
                console.log('Report service run---');
                let { keep, edit } = ReportService_1.default.getInfoReportImage(listDelete, data.reportImage); //need to check
                console.log('Danh sach hinh anh duoc giu lai' + keep);
                let historyReport = HistoryReportService_1.default.copyReport(data);
                console.log('Danh sach hinh anh se bi xoa' + edit);
                let imageReportList = yield ReportImageService_1.default.imageReportListFromImage(files);
                if (imageReportList.length == 0 && files.length > 0) {
                    return res.status(503).json({ message: "Failed to upload images. Please upload again" });
                }
                let imageFinalList = imageReportList.concat(keep);
                let { data: result, error: err } = yield HistoryReportService_1.default.updateReportAndInsertHistory(data, historyReport, imageFinalList, edit, topic, message, status, createdAt, problem);
                if (err) {
                    yield ReportImageService_1.default.deleteImageReportList(imageReportList);
                    return res.status(503).json({ message: err });
                }
                return res.status(200).json(result);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //oke
        this.getReportByID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                const reportID = req.params.id;
                let { data, error } = yield ReportService_1.default.getReportDetail(reportID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "Report with this id does not exist" });
                }
                if ((0, CompareCaseInsentitive_1.default)(studentID, data.attendanceDetail.studentDetail) == false) {
                    return res.status(403).json({ message: "Action Denied. Student is not authorized" });
                }
                delete data.attendanceDetail;
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //oke
        this.getReportsByStudentIDInClassID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                const classID = req.params.classid;
                console.log(studentID);
                console.log(classID);
                let { data, error } = yield ReportService_1.default.getAllReportsByStudentID_ClassID(studentID, classID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "There is no reports in this class" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //oke
        this.getReportsByStudentID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                let { data, error } = yield ReportService_1.default.getAllReportsByStudentID(studentID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "There is no reports in this class" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //testable
        this.getAllReportsByTeacherID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                let { data, error } = yield ReportService_1.default.getAllReportsByTeacherID(teacherID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "There is no reports yet" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        this.getAllReportsByTeacherIDWithPagination = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                let page = req.params.page;
                if (page <= 0) {
                    page = 1;
                }
                let skip = (page - 1) * 8;
                let { data, error } = yield ReportService_1.default.getAllReportsByTeacherIDWithPagination(teacherID, skip, 8);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data.length == 0) {
                    return res.status(204).json({ message: "There is no reports yet" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //testable
        this.getReportDetailByReportID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const reportID = req.params.reportid;
            const classID = req.params.classid;
            const teacherID = req.payload.userID;
            try {
                let checkAuth = yield ClassService_1.default.getClassByID(classID);
                if (checkAuth == null) {
                    return res.status(503).json({ message: "Cannot authorize teacher to perform this action" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, checkAuth.teacher.teacherID) == false) {
                    return res.status(403).json({ message: "Action Denied. Teacher is not authorized" });
                }
                let { data, error } = yield ReportService_1.default.getReportDetailByReportID(reportID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "Report detail cannot be found" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //testable
        this.getHistoryReportByHistoryID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const historyID = req.params.historyid;
            const classID = req.params.classid;
            const teacherID = req.payload.userID;
            try {
                let checkAuth = yield ClassService_1.default.getClassByID(classID);
                if (checkAuth == null) {
                    return res.status(503).json({ message: "Cannot authorize teacher to perform this action" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, checkAuth.teacher.teacherID) == false) {
                    return res.status(403).json({ message: "Action Denied. Teacher is not authorized" });
                }
                let { data, error } = yield ReportService_1.default.getHistoryReportByHistoryID(historyID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "Report detail cannot be found" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //must test
        this.getNotificationReport = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                let { importantNews, lastestNews, stats, error } = yield ReportService_1.default.getNotificationReport(teacherID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (importantNews.length == 0 || lastestNews.length == 0 || stats == null) {
                    return res.status(204).json({ message: "empty" });
                }
                return res.status(200).json({ importantNews, lastestNews, stats });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        this.getNotificationReportWithPagination = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                let page = req.params.page;
                if (page <= 0) {
                    page = 1;
                }
                let skip = (page - 1) * 10;
                let { importantNews, error } = yield ReportService_1.default.getNotificationReportWithPagination(teacherID, skip, 10);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                return res.status(200).json(importantNews);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server" });
            }
        });
    }
}
exports.default = new ReportController();
