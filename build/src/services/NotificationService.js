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
const notification_config_1 = __importDefault(require("../config/notification.config"));
const AttendanceDetailDTO_1 = __importDefault(require("../dto/AttendanceDetailDTO"));
const StudentClassService_1 = __importDefault(require("./StudentClassService"));
const StudentService_1 = __importDefault(require("./StudentService"));
class NotificationService {
    constructor() {
        this.sendAttendanceFormToStudents = (classID, offset) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { data, error } = yield StudentClassService_1.default.getStudentsAttendanceDetailsWithDeviceTokenByClassID(classID);
                if (error) {
                    return false;
                }
                ;
                let { passTokens, warningTokens } = this.getPassTokensAndWarningTokens(data, offset);
                console.log('passToken', passTokens);
                console.log('warningToken', warningTokens);
                // const messageToPassTokens = {
                //     notification: {
                //         title: "Attendance Form",
                //         body: "Your teacher has created attendance detail. Please take attendance!"
                //     },
                //     tokens: passTokens
                // }
                // const messageToWarningTokens = {
                //     notification: {
                //         title: "Attendance Form",
                //         body: "Please take attendance now! You cannot be absent today!"
                //     },
                //     tokens: warningTokens
                // }
                const message = [];
                // message.push(messageToPassTokens)
                // message.push(messageToWarningTokens)
                for (let i = 0; i < passTokens.length; i++) {
                    message.push({
                        notification: {
                            title: "Attendance Form",
                            body: "Your teacher has created attendance detail. Please take attendance!"
                        },
                        token: passTokens[i]
                    });
                }
                for (let i = 0; i < warningTokens.length; i++) {
                    message.push({
                        notification: {
                            title: "Attendance Form",
                            body: "Please take attendance now! You cannot be absent today!"
                        },
                        token: warningTokens[i]
                    });
                }
                console.log(message);
                notification_config_1.default.messaging().sendAll(message);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        this.sendFeedbackNotificationToStudentID = (studentID, feedback) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { data: studentDeviceTokens, error } = yield StudentService_1.default.getDeviceTokensByStudentID(studentID);
                if (error) {
                    return false;
                }
                let tokens = this.getTokensFromStudentDeviceTokens(studentDeviceTokens);
                const message = {
                    notification: {
                        title: "Feedback",
                        body: "Your teacher has sent a feedback to your report!"
                    },
                    tokens: tokens
                };
                notification_config_1.default.messaging().sendMulticast(message);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        this.getTokensFromStudentDeviceTokens = (studentDeviceTokens) => {
            let tokens = [];
            for (let i = 0; i < studentDeviceTokens.length; i++) {
                tokens.push(studentDeviceTokens[i].token);
            }
            return tokens;
        };
        this.getPassTokensAndWarningTokens = (studentDetails, offset) => {
            let passTokens = [];
            let warningTokens = [];
            for (let i = 0; i < studentDetails.length; i++) {
                let studentDetail = studentDetails[i];
                let status = AttendanceDetailDTO_1.default.getStatusBasedOnAttendanceDetails(studentDetail.attendancedetails, offset);
                studentDetail.status = status;
                let tokens = this.getTokensFromStudentDeviceTokens(studentDetail.tokens);
                if (studentDetail.tokens != null && status == "Warning") {
                    warningTokens.push(...tokens);
                }
                else if (studentDetail.tokens != null && status == "Pass") {
                    passTokens.push(...tokens);
                }
            }
            console.log('asd', passTokens);
            console.log('asasdad', warningTokens);
            return { passTokens, warningTokens };
        };
        // must test
        this.getNotificationsBasedOnFeedbackAndAttendanceDetail = (feedbacks, attendancedetails) => {
            let notifications = [];
            for (let i = 0; i < feedbacks.length; i++) {
                let feedbackNoti = feedbacks[i];
                let notification = {
                    type: "report",
                    feedback: {
                        feedbackID: feedbackNoti.feedbackID,
                        topic: feedbackNoti.topic,
                        message: feedbackNoti.message,
                        confirmStatus: feedbackNoti.confirmStatus
                    },
                    report: feedbackNoti.report,
                    formID: null,
                    course: feedbackNoti.course.courseName,
                    lecturer: feedbackNoti.teacher.teacherName,
                    createdAt: feedbackNoti.createdAt,
                    seen: feedbackNoti.seen
                };
                notifications.push(notification);
            }
            for (let i = 0; i < attendancedetails.length; i++) {
                let attendance = attendancedetails[i];
                let notification = {
                    type: "attendance",
                    reportID: null,
                    form: attendance.form,
                    attendancedetail: {
                        studentDetail: attendance.studentDetail,
                        classDetail: attendance.classDetail,
                        attendanceForm: attendance.attendanceForm,
                        result: (attendance.result) ? attendance.result.toString() : attendance.result,
                    },
                    classID: attendance.classDetail,
                    course: attendance.course.courseName,
                    lecturer: attendance.teacher.teacherName,
                    createdAt: attendance.createdAt,
                    seen: attendance.seen
                };
                notifications.push(notification);
            }
            return this.sortNotificationsByDate(notifications);
        };
        //must test
        this.sortNotificationsByDate = (notifications) => {
            notifications.sort((b, a) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                // Handle invalid dates by placing them at the end
                if (isNaN(dateA.getTime())) {
                    return 1;
                }
                if (isNaN(dateB.getTime())) {
                    return -1;
                }
                return dateA.getTime() - dateB.getTime();
            });
            return notifications;
        };
    }
}
exports.default = new NotificationService();
