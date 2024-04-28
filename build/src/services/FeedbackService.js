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
Object.defineProperty(exports, "__esModule", { value: true });
const Feedback_1 = require("../models/Feedback");
const db_config_1 = require("../config/db.config");
const Report_1 = require("../models/Report");
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const Classes_1 = require("../models/Classes");
const Course_1 = require("../models/Course");
const Teacher_1 = require("../models/Teacher");
const reportRepository = db_config_1.AppDataSource.getRepository(Report_1.Report);
const feedbackRepository = db_config_1.AppDataSource.getRepository(Feedback_1.Feedback);
class FeedbackService {
    constructor() {
        this.updateReportAttendanceDetail = (feedback, report) => __awaiter(this, void 0, void 0, function* () {
            let { result, status } = this.resultAndStatusBasedOnConfirmStatus(feedback.confirmStatus, report.attendanceDetail.result);
            report.new = false;
            report.status = status;
            report.feedback = feedback;
            let attendanceDetail = report.attendanceDetail;
            attendanceDetail.result = result;
            report.attendanceDetail = attendanceDetail;
            try {
                //await reportRepository.save(report);
                yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    yield transactionalEntityManager.save(report);
                    yield transactionalEntityManager.update(AttendanceDetail_1.AttendanceDetail, {
                        studentDetail: attendanceDetail.studentDetail,
                        classDetail: attendanceDetail.classDetail,
                        attendanceForm: attendanceDetail.attendanceForm
                    }, { result: result });
                }));
                return { data: feedback, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: null, error: "Failed creating feedback" };
            }
        });
        this.resultAndStatusBasedOnConfirmStatus = (confirmStatus, attendanceResult) => {
            if (confirmStatus == "Present") {
                return { result: 1, status: "Approved" };
            }
            if (confirmStatus == "Late") {
                return { result: 0.5, status: "Approved" };
            }
            if (confirmStatus == "Absent") {
                return { result: 0, status: "Denied" };
            }
            return { result: attendanceResult, status: "Pending" };
        };
        this.feedBackObject = (topic, message, confirmStatus, createdAt) => {
            let feedback = new Feedback_1.Feedback();
            feedback.topic = topic;
            feedback.message = message;
            feedback.confirmStatus = confirmStatus;
            feedback.createdAt = createdAt;
            return feedback;
        };
        //must test
        this.getFeedBackByStudentID = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield feedbackRepository.createQueryBuilder('feedback').
                    innerJoinAndMapOne("feedback.report", Report_1.Report, "report", "feedback.reportID = report.reportID").andWhere("report.studentID = :id", { id: studentID }).
                    innerJoin(Classes_1.Classes, "classes", "report.classID = classes.classID").
                    innerJoinAndMapOne("feedback.course", Course_1.Course, "course", "course.courseID = classes.courseID").
                    innerJoinAndMapOne("feedback.teacher", Teacher_1.Teacher, "teacher", "teacher.teacherID = classes.teacherID").
                    getMany();
                return { data, error: null };
            }
            catch (e) {
                return { data: [], error: "Failed getting student feedback" };
            }
        });
        //
        this.seenFeedback = (feedbackID) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield feedbackRepository.update({
                    feedbackID: feedbackID
                }, {
                    seen: true
                });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = new FeedbackService();
