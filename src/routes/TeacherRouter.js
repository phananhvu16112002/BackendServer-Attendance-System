import express from "express";
import VerifyAccessToken from "../middlewares/VerifyAccessToken";
import Authorization from "../middlewares/Authorization";
import AttendanceFormController from "../controllers/AttendanceFormController";
import TeacherController from "../controllers/TeacherController";
import VerifyResetToken from "../middlewares/VerifyResetToken";
import ClassesController from "../controllers/ClassesController";


const TeacherRouter = express.Router();
//Authentication
TeacherRouter.post("/register", TeacherController.register);
TeacherRouter.post("/verifyRegister", TeacherController.verifyRegister);
TeacherRouter.post("/login", TeacherController.login);
TeacherRouter.post("/forgotPassword", TeacherController.forgotPassword);
TeacherRouter.post("/verifyForgotPassword", TeacherController.verifyForgotPassword);
TeacherRouter.post("/resetPassword", VerifyResetToken, TeacherController.resetPassword)
TeacherRouter.post("/resendOTP", TeacherController.resendOTP);
//Insert  VerifyAccessToken, Authorization("teacher") for authenticate and authorize
//A route for create attendance form
TeacherRouter.get("/classes", VerifyAccessToken, Authorization("teacher"), ClassesController.getClassesWithCourse);
TeacherRouter.post("/createAttendanceForm", AttendanceFormController.createAttendanceForm);
///


export default TeacherRouter;