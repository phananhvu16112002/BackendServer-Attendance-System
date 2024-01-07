import express from "express";
import TestController from "../controllers/TestController";
import AttendanceFormController from "../controllers/AttendanceFormController";
const TestRouter = express.Router();

TestRouter.get("/createStudentTable", TestController.testCreateStudentTable)
TestRouter.get("/createTeacherTable", TestController.testCreateTeacherTable)
TestRouter.get("/createCourseTable", TestController.testCreateCourseTable)
TestRouter.get("/createClassTable", TestController.testCreateClassTable)
TestRouter.get("/createFormTable", TestController.testCreateFormTable)
TestRouter.get("/takeAttendance", TestController.testTakeAttendance)

TestRouter.get("/getAttendanceDetail", TestController.testGetAttendanceDetail)
TestRouter.get("/getStudentClass", TestController.testGetStudentClasses)
TestRouter.get("/getStudent", TestController.testGetStudent)
TestRouter.get("/getTeacher", TestController.testGetTeacher)
TestRouter.get("/getCourse", TestController.testGetCourse)
TestRouter.get("/getClass", TestController.testGetClasses)

TestRouter.post("/upload", TestController.testUpload)
TestRouter.get("/delete", TestController.testDelete)

//Test endpoint
TestRouter.get("/endpoint", TestController.testEndpoint)

//Test Token
TestRouter.post("/testCreateAccessTokenAndRefreshTokenForStudent", TestController.testCreateAccessTokenAndRefreshTokenForStudent)
TestRouter.post("/testCreateAccessTokenAndRefreshTokenForTeacher", TestController.testCreateAccessTokenAndRefreshTokenForTeacher)

TestRouter.post("/testVerifyAccessToken", TestController.testVerifyAccessToken)
TestRouter.post("/testRefreshAccessToken", TestController.testRefreshAccessToken)

TestRouter.get("/studentClass", TestController.getStudentClass)
TestRouter.get("/attendanceForm", TestController.createAttendanceForm)
TestRouter.get("/attendanceDetail", TestController.createAttendanceDetail)
TestRouter.get("/getAllAttendanceForm", AttendanceFormController.getAllFormByClassID)

//Test Imgur
TestRouter.post("/imgur", TestController.testImgur)

export default TestRouter


