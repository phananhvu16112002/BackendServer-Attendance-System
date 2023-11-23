import express from "express";
import StudentController from "../controllers/StudentController"
const StudentRouter = express.Router();

StudentRouter.post("/register", StudentController.register);
StudentRouter.post("/verifyRegister", StudentController.verifyRegister);
StudentRouter.get("/test", StudentController.test);

export default StudentRouter;