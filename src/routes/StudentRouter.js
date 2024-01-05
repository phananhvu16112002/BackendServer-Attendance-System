import express from "express";
import StudentController from "../controllers/StudentController";
import VerifyResetToken from "../middlewares/VerifyResetToken";
const StudentRouter = express.Router();

StudentRouter.post("/register", StudentController.register);
StudentRouter.post("/verifyRegister", StudentController.verifyRegister);
StudentRouter.post("/login",StudentController.login);
StudentRouter.post("/forgotPassword",StudentController.forgotPassword);
StudentRouter.post("/verifyForgotPassword", StudentController.verifyForgotPassword);
StudentRouter.post("/resetPassword",VerifyResetToken,StudentController.resetPassword);
StudentRouter.post("/resendOTP",StudentController.resendOTP);

///

export default StudentRouter;