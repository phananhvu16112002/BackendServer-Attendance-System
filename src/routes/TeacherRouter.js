import express from "express";
import VerifyAccessToken from "../middlewares/VerifyAccessToken";
import Authorization from "../middlewares/Authorization";
import AttendanceFormController from "../controllers/AttendanceFormController";

const TeacherRouter = express.Router();

//A route for create attendance form
TeacherRouter.post("/createAttendanceForm", VerifyAccessToken, 
                    Authorization("teacher"), AttendanceFormController.createAttendanceForm);

///

export default TeacherRouter;