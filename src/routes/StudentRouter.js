import express from "express";
import StudentController from "../controllers/StudentController";
import AttendanceDetailController from "../controllers/AttendanceDetailController";
import StudentClassController from "../controllers/StudentClassController";
import Authorization from "../middlewares/Authorization";
import ReportController from "../controllers/ReportController";
import NotificationController from "../controllers/NotificationController";
import VerifyAccessToken from "../middlewares/verifyAccessToken";
import VerifyResetToken from "../middlewares/verifyResetToken";

const StudentRouter = express.Router();

//Student Authentication 
StudentRouter.post("/register", StudentController.register);
StudentRouter.post("/verifyRegister", StudentController.verifyRegister);
StudentRouter.post("/login",StudentController.loginWithCheckImage);
StudentRouter.post("/forgotPassword",StudentController.forgotPassword);
StudentRouter.post("/verifyForgotPassword", StudentController.verifyForgotPassword);
StudentRouter.post("/resetPassword",VerifyResetToken,StudentController.resetPassword);
StudentRouter.post("/resendOTPRegister", StudentController.resendOTPRegister);
StudentRouter.post("/resendOTP",StudentController.resendOTP);

StudentRouter.post("/newPassword", VerifyAccessToken, Authorization('student'), StudentController.newPassword);

//Proper student use case (classes)
StudentRouter.get("/classes", VerifyAccessToken, Authorization("student"), StudentClassController.getClassesByStudentID);
StudentRouter.get("/classes/detail/:id", VerifyAccessToken, Authorization("student"), AttendanceDetailController.getAttendanceRecordsOfStudentByClassID);
StudentRouter.get("/classes/detail/offline/:id", VerifyAccessToken, Authorization('student'), AttendanceDetailController.getOfflineAttendanceRecordsOfStudentByClassID);
StudentRouter.get("/classes/detail/:id/students", VerifyAccessToken, Authorization("student"), StudentClassController.getStudentsByClassIDForStudent);

//Proper student use case (report)
StudentRouter.get("/reports", VerifyAccessToken, Authorization("student"), ReportController.getReportsByStudentID);
StudentRouter.get("/reports/detail/:id", VerifyAccessToken, Authorization("student"), ReportController.getReportByID);
StudentRouter.get("/classes/:classid/reports", VerifyAccessToken, Authorization("student"), ReportController.getReportsByStudentIDInClassID);
StudentRouter.post("/report/submit", VerifyAccessToken, Authorization("student"), ReportController.submitReport);
StudentRouter.put("/report/edit/:id", VerifyAccessToken, Authorization("student"), ReportController.editReport);

StudentRouter.get("/images", VerifyAccessToken, Authorization("student"), StudentController.getStudentsImagesByStudentID);
//Student Use Cases test
//StudentRouter.get("/getStudentClasses", VerifyAccessToken, Authorization("student"), StudentClassController.getStudentClasses);
//StudentRouter.get("/classes/detail/:id", VerifyAccessToken, Authorization("student"), AttendanceDetailController.getAttendanceRecordsOfStudentByClassID);
StudentRouter.post("/sendImages", VerifyAccessToken, Authorization("student"), StudentController.sendImages);

StudentRouter.post("/takeAttendance", AttendanceDetailController.takeAttendance);
StudentRouter.post("/takeAttendanceoffline", AttendanceDetailController.takeAttendanceOffline);

StudentRouter.get("/notifications", VerifyAccessToken, Authorization('student'), NotificationController.getNotificationsByStudentID);

export default StudentRouter;