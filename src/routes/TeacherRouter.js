import express from "express";
import Authorization from "../middlewares/Authorization";
import AttendanceFormController from "../controllers/AttendanceFormController";
import TeacherController from "../controllers/TeacherController";
import VerifyResetToken from "../middlewares/VerifyResetToken";
import ClassesController from "../controllers/ClassesController";
import StudentClassController from "../controllers/StudentClassController";
import VerifyAccessToken from "../middlewares/verifyAccessToken";
import FeedbackController from "../controllers/FeedbackController";
import AttendanceDetailController from "../controllers/AttendanceDetailController";
import ReportController from "../controllers/ReportController";

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

//Proper get method
TeacherRouter.get("/classes", VerifyAccessToken, Authorization("teacher"), ClassesController.getClassesWithCourse);
TeacherRouter.get("/classes/detail/:id", VerifyAccessToken, Authorization("teacher"), StudentClassController.getStudentsWithAllAttendanceDetails);
TeacherRouter.get("/classes/detail/:id/forms", VerifyAccessToken, Authorization('teacher'), AttendanceFormController.getAttendanceFormsByClassID);

TeacherRouter.get("/reports", VerifyAccessToken, Authorization('teacher'), ReportController.getAllReportsByTeacherID);

TeacherRouter.get("/attendancedetail/:classid/:studentid/:formid", VerifyAccessToken, Authorization('teacher'), AttendanceDetailController.getAttendanceDetailByStudentIDClassIDFormID);

//Proper post method
TeacherRouter.post("/feedback/submit", VerifyAccessToken, Authorization('teacher'), FeedbackController.sendFeedback);
TeacherRouter.put("/feedback/edit/:id", VerifyAccessToken, Authorization('teacher'), FeedbackController.editFeedback);

TeacherRouter.post("/form/submit", AttendanceFormController.createAttendanceForm)
// TeacherRouter.post("/createAttendanceForm", AttendanceFormController.createAttendanceForm);
///


export default TeacherRouter;