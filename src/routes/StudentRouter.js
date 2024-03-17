import express from "express";
import StudentController from "../controllers/StudentController";
import VerifyResetToken from "../middlewares/verifyResetToken";
import AttendanceDetailController from "../controllers/AttendanceDetailController";
import StudentClassController from "../controllers/StudentClassController";
import Authorization from "../middlewares/Authorization";
import VerifyAccessToken from "../middlewares/verifyAccessToken";
import ReportController from "../controllers/ReportController";

const StudentRouter = express.Router();

//Student Authentication 
StudentRouter.post("/register", StudentController.register);
StudentRouter.post("/verifyRegister", StudentController.verifyRegister);
StudentRouter.post("/login",StudentController.login);
StudentRouter.post("/forgotPassword",StudentController.forgotPassword);
StudentRouter.post("/verifyForgotPassword", StudentController.verifyForgotPassword);
StudentRouter.post("/resetPassword",VerifyResetToken,StudentController.resetPassword);
StudentRouter.post("/resendOTPRegister", StudentController.resendOTPRegister);
StudentRouter.post("/resendOTP",StudentController.resendOTP);

//Proper student use case
StudentRouter.get("/classes", VerifyAccessToken, Authorization("student"), StudentClassController.getClassesByStudentID);
StudentRouter.get("/classes/detail/:id", VerifyAccessToken, Authorization("student"), AttendanceDetailController.getAttendanceRecordsOfStudentByClassID);

//Student Use Cases test
//StudentRouter.get("/getStudentClasses", VerifyAccessToken, Authorization("student"), StudentClassController.getStudentClasses);
//StudentRouter.get("/classes/detail/:id", VerifyAccessToken, Authorization("student"), AttendanceDetailController.getAttendanceRecordsOfStudentByClassID);

StudentRouter.post("/report/submit", VerifyAccessToken, Authorization("student"), ReportController.submitReport);
StudentRouter.put("/report/edit/:id", VerifyAccessToken, Authorization("student"), ReportController.editReport);


StudentRouter.post("/takeAttendance", AttendanceDetailController.takeAttendance);
StudentRouter.post("/takeAttendanceoffline", AttendanceDetailController.takeAttendanceOffline);
export default StudentRouter;