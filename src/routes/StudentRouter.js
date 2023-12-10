import express from "express";
import StudentController from "../controllers/StudentController"
import verifyResetToken from "../middlewares/verifyResetToken";
import verifyAccessToken from "../middlewares/verifyAccessToken";
const StudentRouter = express.Router();

StudentRouter.post("/register", StudentController.register);
StudentRouter.post("/verifyRegister", StudentController.verifyRegister);
StudentRouter.post("/login",StudentController.login);
StudentRouter.post("/forgotPassword",StudentController.forgotPassword);
StudentRouter.post("/verifyForgotPassword", StudentController.verifyForgotPassword);
StudentRouter.post("/resetPassword",verifyResetToken,StudentController.resetPassword);
StudentRouter.post("/resendOTP",StudentController.resendOTP);

//will put verify access token later
StudentRouter.post("/takeAttendance", StudentController.takeAttendance);
export default StudentRouter;