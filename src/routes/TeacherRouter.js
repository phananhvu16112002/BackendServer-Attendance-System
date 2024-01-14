import express from "express";
import VerifyAccessToken from "../middlewares/VerifyAccessToken";
import Authorization from "../middlewares/Authorization";
import AttendanceFormController from "../controllers/AttendanceFormController";
import TeacherController from "../controllers/TeacherController";

const TeacherRouter = express.Router();

//Insert  VerifyAccessToken, Authorization("teacher") for authenticate and authorize
//A route for create attendance form
TeacherRouter.post("/createAttendanceForm", VerifyAccessToken, 
                    Authorization("teacher"), AttendanceFormController.createAttendanceForm);
///
TeacherRouter.post("/getClasses", TeacherController.getClasses);

export default TeacherRouter;