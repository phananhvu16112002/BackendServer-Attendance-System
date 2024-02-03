import express from "express";
import StudentController from "../controllers/StudentController";
import VerifyResetToken from "../middlewares/VerifyResetToken";
import AttendanceDetailController from "../controllers/AttendanceDetailController";
import StudentClassController from "../controllers/StudentClassController";
import VerifyAccessToken from "../middlewares/VerifyAccessToken";
import Authorization from "../middlewares/Authorization";

const StudentRouter = express.Router();

//Student Authentication 
StudentRouter.post("/register", StudentController.register);
StudentRouter.post("/verifyRegister", StudentController.verifyRegister);
StudentRouter.post("/login",StudentController.login);
StudentRouter.post("/forgotPassword",StudentController.forgotPassword);
StudentRouter.post("/verifyForgotPassword", StudentController.verifyForgotPassword);
StudentRouter.post("/resetPassword",VerifyResetToken,StudentController.resetPassword);
StudentRouter.post("/resendOTP",StudentController.resendOTP);

//Student Use Cases
StudentRouter.get("/getStudentClasses", VerifyAccessToken, Authorization("student"), StudentClassController.getStudentClasses);
StudentRouter.post("/takeAttendance", AttendanceDetailController.takeAttendance);
export default StudentRouter;