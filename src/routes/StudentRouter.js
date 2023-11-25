import express from "express";
import StudentController from "../controllers/StudentController"
import verifyToken from "../middlewares/verifyToken";
const StudentRouter = express.Router();

StudentRouter.post("/register", StudentController.register);
StudentRouter.post("/verifyRegister", StudentController.verifyRegister);
StudentRouter.post("/login",StudentController.login);
StudentRouter.post("/forgotPassword",StudentController.forgotPassword);
StudentRouter.post("/verifyForgotPassword", StudentController.verifyForgotPassword);
StudentRouter.post("/resetPassword",verifyToken,StudentController.resetPassword);
export default StudentRouter;