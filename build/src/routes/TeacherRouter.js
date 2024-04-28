"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Authorization_1 = __importDefault(require("../middlewares/Authorization"));
const AttendanceFormController_1 = __importDefault(require("../controllers/AttendanceFormController"));
const TeacherController_1 = __importDefault(require("../controllers/TeacherController"));
const ClassesController_1 = __importDefault(require("../controllers/ClassesController"));
const StudentClassController_1 = __importDefault(require("../controllers/StudentClassController"));
const FeedbackController_1 = __importDefault(require("../controllers/FeedbackController"));
const AttendanceDetailController_1 = __importDefault(require("../controllers/AttendanceDetailController"));
const ReportController_1 = __importDefault(require("../controllers/ReportController"));
const verifyAccessToken_1 = __importDefault(require("../middlewares/verifyAccessToken"));
const verifyResetToken_1 = __importDefault(require("../middlewares/verifyResetToken"));
const TeacherRouter = express_1.default.Router();
//Authentication
TeacherRouter.post("/register", TeacherController_1.default.register);
TeacherRouter.post("/verifyRegister", TeacherController_1.default.verifyRegister);
TeacherRouter.post("/login", TeacherController_1.default.login);
TeacherRouter.post("/forgotPassword", TeacherController_1.default.forgotPassword);
TeacherRouter.post("/verifyForgotPassword", TeacherController_1.default.verifyForgotPassword);
TeacherRouter.post("/resetPassword", verifyResetToken_1.default, TeacherController_1.default.resetPassword);
TeacherRouter.post("/resendOTPRegister", TeacherController_1.default.resendOTPRegister);
TeacherRouter.post("/resendOTP", TeacherController_1.default.resendOTP);
TeacherRouter.post("/newPassword", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), TeacherController_1.default.newPassword);
//Proper get method
TeacherRouter.get("/classes", verifyAccessToken_1.default, (0, Authorization_1.default)("teacher"), ClassesController_1.default.getClassesWithCourse);
TeacherRouter.get("/classes/page/:page", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), ClassesController_1.default.getClassesWithCourseWithPagination);
TeacherRouter.get("/classes/detail/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("teacher"), StudentClassController_1.default.getStudentsWithAllAttendanceDetails);
TeacherRouter.get("/classes/detail/:id/forms", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), AttendanceFormController_1.default.getAttendanceFormsByClassID);
TeacherRouter.get("/reports", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), ReportController_1.default.getAllReportsByTeacherID);
TeacherRouter.get("/reports/page/:page", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), ReportController_1.default.getAllReportsByTeacherIDWithPagination);
TeacherRouter.get("/reports/detail/:reportid/:classid", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), ReportController_1.default.getReportDetailByReportID);
TeacherRouter.get("/historyreports/detail/:historyid/:classid", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), ReportController_1.default.getHistoryReportByHistoryID);
TeacherRouter.get("/attendancedetail/:classid/:studentid/:formid", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), AttendanceDetailController_1.default.getAttendanceDetailByStudentIDClassIDFormID);
TeacherRouter.get("/attendance/detail/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("teacher"), AttendanceDetailController_1.default.getAttendanceDetailsByFormID);
TeacherRouter.get("/classes/detail/:id/students", verifyAccessToken_1.default, (0, Authorization_1.default)("teacher"), StudentClassController_1.default.getStudentsByClassIDForTeacher);
//Proper post method
TeacherRouter.post("/feedback/submit", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), FeedbackController_1.default.sendFeedback);
TeacherRouter.put("/feedback/edit/:id", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), FeedbackController_1.default.editFeedback);
TeacherRouter.put("/attendancedetail/edit/:classid/:studentid/:formid", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), AttendanceDetailController_1.default.editAttendanceDetail);
TeacherRouter.post("/form/submit", verifyAccessToken_1.default, (0, Authorization_1.default)("teacher"), AttendanceFormController_1.default.createAttendanceForm);
// TeacherRouter.post("/createAttendanceForm", AttendanceFormController.createAttendanceForm);
///
TeacherRouter.get("/notifications", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), ReportController_1.default.getNotificationReport);
//Pagination
TeacherRouter.get("/notifications/page/:page", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), ReportController_1.default.getNotificationReportWithPagination);
TeacherRouter.put("/edit/attendanceform/:classid/:formid", verifyAccessToken_1.default, (0, Authorization_1.default)("teacher"), AttendanceFormController_1.default.editAttendanceFormByFormID);
TeacherRouter.put("/editstatus/attendanceform/:classid/:formid", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), AttendanceFormController_1.default.closeOrOpenFormByFormID);
TeacherRouter.delete("/classes/:classid/edit/:formid", verifyAccessToken_1.default, (0, Authorization_1.default)('teacher'), AttendanceFormController_1.default.deleteAttendanceFormByFormID);
exports.default = TeacherRouter;
