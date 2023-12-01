import express from "express";
import TestController from "../controllers/TestController";
const TestRouter = express.Router();

TestRouter.get("/createStudentTable", TestController.testCreateStudentTable)
TestRouter.get("/createTeacherTable", TestController.testCreateTeacherTable)
TestRouter.get("/createCourseTable", TestController.testCreateCourseTable)
TestRouter.get("/createClassTable", TestController.testCreateClassTable)

export default TestRouter

