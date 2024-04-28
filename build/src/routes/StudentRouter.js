"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StudentController_1 = __importDefault(require("../controllers/StudentController"));
const AttendanceDetailController_1 = __importDefault(require("../controllers/AttendanceDetailController"));
const StudentClassController_1 = __importDefault(require("../controllers/StudentClassController"));
const Authorization_1 = __importDefault(require("../middlewares/Authorization"));
const ReportController_1 = __importDefault(require("../controllers/ReportController"));
const NotificationController_1 = __importDefault(require("../controllers/NotificationController"));
const verifyAccessToken_1 = __importDefault(require("../middlewares/verifyAccessToken"));
const verifyResetToken_1 = __importDefault(require("../middlewares/verifyResetToken"));
const StudentRouter = express_1.default.Router();
//Student Authentication 
StudentRouter.post("/register", StudentController_1.default.register);
StudentRouter.post("/verifyRegister", StudentController_1.default.verifyRegister);
StudentRouter.post("/login", StudentController_1.default.loginWithCheckImage);
StudentRouter.post("/forgotPassword", StudentController_1.default.forgotPassword);
StudentRouter.post("/verifyForgotPassword", StudentController_1.default.verifyForgotPassword);
StudentRouter.post("/resetPassword", verifyResetToken_1.default, StudentController_1.default.resetPassword);
StudentRouter.post("/resendOTPRegister", StudentController_1.default.resendOTPRegister);
StudentRouter.post("/resendOTP", StudentController_1.default.resendOTP);
StudentRouter.post("/newPassword", verifyAccessToken_1.default, (0, Authorization_1.default)('student'), StudentController_1.default.newPassword);
//Proper student use case (classes)
StudentRouter.get("/classes", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), StudentClassController_1.default.getClassesByStudentID);
StudentRouter.get("/classes/detail/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), AttendanceDetailController_1.default.getAttendanceRecordsOfStudentByClassID);
StudentRouter.get("/classes/detail/offline/:id", verifyAccessToken_1.default, (0, Authorization_1.default)('student'), AttendanceDetailController_1.default.getOfflineAttendanceRecordsOfStudentByClassID);
StudentRouter.get("/classes/detail/:id/students", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), StudentClassController_1.default.getStudentsByClassIDForStudent);
//Proper student use case (report)
StudentRouter.get("/reports", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), ReportController_1.default.getReportsByStudentID);
StudentRouter.get("/reports/detail/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), ReportController_1.default.getReportByID);
StudentRouter.get("/classes/:classid/reports", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), ReportController_1.default.getReportsByStudentIDInClassID);
StudentRouter.post("/report/submit", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), ReportController_1.default.submitReport);
StudentRouter.put("/report/edit/:id", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), ReportController_1.default.editReport);
StudentRouter.get("/images", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), StudentController_1.default.getStudentsImagesByStudentID);
//Student Use Cases test
//StudentRouter.get("/getStudentClasses", VerifyAccessToken, Authorization("student"), StudentClassController.getStudentClasses);
//StudentRouter.get("/classes/detail/:id", VerifyAccessToken, Authorization("student"), AttendanceDetailController.getAttendanceRecordsOfStudentByClassID);
StudentRouter.post("/sendImages", verifyAccessToken_1.default, (0, Authorization_1.default)("student"), StudentController_1.default.sendImages);
StudentRouter.post("/takeAttendance", AttendanceDetailController_1.default.takeAttendance);
StudentRouter.post("/takeAttendanceoffline", AttendanceDetailController_1.default.takeAttendanceOffline);
StudentRouter.get("/notifications", verifyAccessToken_1.default, (0, Authorization_1.default)('student'), NotificationController_1.default.getNotificationsByStudentID);
exports.default = StudentRouter;
