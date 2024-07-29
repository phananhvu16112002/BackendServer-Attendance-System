import express from "express";
import Authorization from "../middlewares/Authorization";
import AttendanceFormController from "../controllers/AttendanceFormController";
import TeacherController from "../controllers/TeacherController";
import ClassesController from "../controllers/ClassesController";
import StudentClassController from "../controllers/StudentClassController";
import FeedbackController from "../controllers/FeedbackController";
import AttendanceDetailController from "../controllers/AttendanceDetailController";
import ReportController from "../controllers/ReportController";
import VerifyAccessToken from "../middlewares/verifyAccessToken";
import VerifyResetToken from "../middlewares/verifyResetToken";
import SemesterController from "../controllers/SemesterController";

const TeacherRouter = express.Router();

//Authentication
TeacherRouter.post("/register", TeacherController.register);
TeacherRouter.post("/verifyRegister", TeacherController.verifyRegister);
TeacherRouter.post("/login", TeacherController.login);
TeacherRouter.post("/forgotPassword", TeacherController.forgotPassword);
TeacherRouter.post("/verifyForgotPassword", TeacherController.verifyForgotPassword);
TeacherRouter.post("/resetPassword", VerifyResetToken, TeacherController.resetPassword);
TeacherRouter.post("/resendOTPRegister", TeacherController.resendOTPRegister);
TeacherRouter.post("/resendOTP", TeacherController.resendOTP);

TeacherRouter.post("/newPassword",VerifyAccessToken, Authorization('teacher'), TeacherController.newPassword);
//Proper get method
TeacherRouter.get("/classes", VerifyAccessToken, Authorization("teacher"), ClassesController.getClassesWithCourse);
TeacherRouter.get("/classes/page/:page", VerifyAccessToken, Authorization('teacher'), ClassesController.getClassesWithCourseWithPagination);

TeacherRouter.get("/classes/detail/:id", VerifyAccessToken, Authorization("teacher"), StudentClassController.getStudentsWithAllAttendanceDetails);
TeacherRouter.get("/classes/detail/:id/forms", VerifyAccessToken, Authorization('teacher'), AttendanceFormController.getAttendanceFormsByClassID);

TeacherRouter.get("/reports", VerifyAccessToken, Authorization('teacher'), ReportController.getAllReportsByTeacherID);
TeacherRouter.get("/reports/page/:page", VerifyAccessToken, Authorization('teacher'), ReportController.getAllReportsByTeacherIDWithPagination);

TeacherRouter.get("/reports/detail/:reportid/:classid", VerifyAccessToken, Authorization('teacher'), ReportController.getReportDetailByReportID);
TeacherRouter.get("/historyreports/detail/:historyid/:classid", VerifyAccessToken, Authorization('teacher'), ReportController.getHistoryReportByHistoryID);

TeacherRouter.get("/attendancedetail/:classid/:studentid/:formid", VerifyAccessToken, Authorization('teacher'), AttendanceDetailController.getAttendanceDetailByStudentIDClassIDFormID);

TeacherRouter.get("/attendance/detail/:id", VerifyAccessToken, Authorization("teacher"), AttendanceDetailController.getAttendanceDetailsByFormID)

TeacherRouter.get("/classes/detail/:id/students", VerifyAccessToken, Authorization("teacher"), StudentClassController.getStudentsByClassIDForTeacher);
//Proper post method
TeacherRouter.post("/feedback/submit", VerifyAccessToken, Authorization('teacher'), FeedbackController.sendFeedback);
TeacherRouter.put("/feedback/edit/:id", VerifyAccessToken, Authorization('teacher'), FeedbackController.editFeedback);

TeacherRouter.put("/attendancedetail/edit/:classid/:studentid/:formid", VerifyAccessToken, Authorization('teacher'), AttendanceDetailController.editAttendanceDetail);

TeacherRouter.post("/form/submit", VerifyAccessToken, Authorization("teacher"), AttendanceFormController.activateAttendanceForm)
// TeacherRouter.post("/createAttendanceForm", AttendanceFormController.createAttendanceForm);
///
TeacherRouter.get("/notifications", VerifyAccessToken, Authorization('teacher'), ReportController.getNotificationReport);
//Pagination
TeacherRouter.get("/notifications/page/:page", VerifyAccessToken, Authorization('teacher'), ReportController.getNotificationReportWithPagination);

TeacherRouter.put("/edit/attendanceform/:classid/:formid", VerifyAccessToken, Authorization("teacher"), AttendanceFormController.editAttendanceFormByFormID);
TeacherRouter.put("/editstatus/attendanceform/:classid/:formid", VerifyAccessToken, Authorization('teacher'), AttendanceFormController.closeOrOpenFormByFormID);

TeacherRouter.delete("/classes/:classid/edit/:formid", VerifyAccessToken, Authorization('teacher'), AttendanceFormController.deleteAttendanceFormByFormID);

TeacherRouter.get("/classes/:id/stats", VerifyAccessToken, Authorization('teacher'), AttendanceDetailController.getTotalStatsByClassIDForTeacher);
TeacherRouter.get("/semester", VerifyAccessToken, Authorization("teacher"), SemesterController.getAllSemester);

TeacherRouter.put("/classes/archives/:id", VerifyAccessToken, Authorization('teacher'), ClassesController.editClassInArchivesByClassID);


export default TeacherRouter;