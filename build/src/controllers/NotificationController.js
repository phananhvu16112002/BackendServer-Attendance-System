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
const FeedbackService_1 = __importDefault(require("../services/FeedbackService"));
const NotificationService_1 = __importDefault(require("../services/NotificationService"));
class NotificationController {
    constructor() {
        //must test
        this.getNotificationsByStudentID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let studentID = req.payload.userID;
                let { data: feedbacks, error: e1 } = yield FeedbackService_1.default.getFeedBackByStudentID(studentID);
                if (e1) {
                    return res.status(503).json({ message: e1 });
                }
                let { data: attendanceDetails, error: e2 } = yield AttendanceDetailService_1.default.getAttendanceDetailsByStudentID(studentID);
                if (e2) {
                    return res.status(503).json({ message: e2 });
                }
                return res.status(200).json(NotificationService_1.default.getNotificationsBasedOnFeedbackAndAttendanceDetail(feedbacks, attendanceDetails));
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
    }
}
exports.default = new NotificationController();
