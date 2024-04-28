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
const FeedbackService_1 = __importDefault(require("../services/FeedbackService"));
const NotificationService_1 = __importDefault(require("../services/NotificationService"));
const ReportService_1 = __importDefault(require("../services/ReportService"));
const CompareCaseInsentitive_1 = __importDefault(require("../utils/CompareCaseInsentitive"));
const TimeConvert_1 = require("../utils/TimeConvert");
class FeedbackController {
    constructor() {
        //oke
        this.sendFeedback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                const reportID = req.body.reportID;
                const topic = req.body.topic;
                const message = req.body.message;
                const confirmStatus = req.body.confirmStatus;
                const createdAt = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
                console.log(reportID);
                console.log(confirmStatus);
                console.log(topic);
                console.log(message);
                let { data, error } = yield ReportService_1.default.getReportByID(reportID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: `Report with id ${reportID} does not exist` });
                }
                if (data.feedback != null) {
                    return res.status(422).json({ message: "Feedback for this report has only been responsed once. Please edit feedback" });
                }
                let checkAuth = yield ClassService_1.default.getClassByID(data.attendanceDetail.classID);
                if (checkAuth == null) {
                    return res.status(503).json({ message: "Cannot authorize teacher to perform this action" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, checkAuth.teacher.teacherID) == false) {
                    return res.status(403).json({ message: "Action Denied. Teacher is not authorized" });
                }
                let feedback = FeedbackService_1.default.feedBackObject(topic, message, confirmStatus, createdAt);
                let { data: result, error: err } = yield FeedbackService_1.default.updateReportAttendanceDetail(feedback, data);
                if (err) {
                    return res.status(503).json({ message: err });
                }
                yield NotificationService_1.default.sendFeedbackNotificationToStudentID(data.attendanceDetail.studentID, feedback);
                return res.status(200).json(result);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //oke
        this.editFeedback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                const reportID = req.params.id;
                const topic = req.body.topic;
                const message = req.body.message;
                const confirmStatus = req.body.confirmStatus;
                const createdAt = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
                console.log(reportID);
                console.log(topic);
                console.log(message);
                console.log(confirmStatus);
                let { data, error } = yield ReportService_1.default.getReportByID(reportID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: `Report with id ${reportID} does not exist` });
                }
                if (data.feedback == null) {
                    return res.status(422).json({ message: "Feedback for this report has not been created. Please create feedback" });
                }
                let checkAuth = yield ClassService_1.default.getClassByID(data.attendanceDetail.classID);
                if (checkAuth == null) {
                    return res.status(503).json({ message: "Cannot authorize teacher to perform this action" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, checkAuth.teacher.teacherID) == false) {
                    return res.status(403).json({ message: "Action Denied. Teacher is not authorized" });
                }
                let feedback = data.feedback;
                feedback.topic = topic;
                feedback.message = message;
                feedback.confirmStatus = confirmStatus;
                feedback.createdAt = createdAt;
                let { data: result, error: err } = yield FeedbackService_1.default.updateReportAttendanceDetail(feedback, data);
                if (err) {
                    return res.status(503).json({ message: err });
                }
                return res.status(200).json(result);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new FeedbackController();
