import express from "express";
import VerifyAccessToken from "../middlewares/VerifyAccessToken";
import Authorization from "../middlewares/Authorization";
import AttendanceFormController from "../controllers/AttendanceFormController";
import TeacherController from "../controllers/TeacherController";

const TeacherRouter = express.Router();

TeacherRouter.post("/register", TeacherController)

//Insert  VerifyAccessToken, Authorization("teacher") for authenticate and authorize
//A route for create attendance form
TeacherRouter.post("/createAttendanceForm", AttendanceFormController.createAttendanceForm);
///
TeacherRouter.post("/getClasses", TeacherController.getClassesWithCourse);

export default TeacherRouter;