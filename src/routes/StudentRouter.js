import express from "express";
import StudentController from "../controllers/StudentController"
const {verifyToken} = require('../middlewares/verifyToken');
const StudentRouter = express.Router();

StudentRouter.post("/register", StudentController.register);
StudentRouter.post("/verifyRegister", StudentController.verifyRegister);
StudentRouter.post("/login",StudentController.login);
export default StudentRouter;