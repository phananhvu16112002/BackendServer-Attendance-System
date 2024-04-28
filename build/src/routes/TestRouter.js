"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TestController_1 = __importDefault(require("../controllers/TestController"));
const AttendanceFormController_1 = __importDefault(require("../controllers/AttendanceFormController"));
const TestRouter = express_1.default.Router();
TestRouter.get("/createStudentTable", TestController_1.default.testCreateStudentTable);
TestRouter.get("/createTeacherTable", TestController_1.default.testCreateTeacherTable);
TestRouter.get("/createCourseTable", TestController_1.default.testCreateCourseTable);
TestRouter.get("/createClassTable", TestController_1.default.testCreateClassTable);
TestRouter.get("/createFormTable", TestController_1.default.testCreateFormTable);
TestRouter.get("/takeAttendance", TestController_1.default.testTakeAttendance);
TestRouter.get("/getAttendanceDetail", TestController_1.default.testGetAttendanceDetail);
TestRouter.get("/getStudent", TestController_1.default.testGetStudent);
TestRouter.get("/getTeacher", TestController_1.default.testGetTeacher);
TestRouter.get("/getCourse", TestController_1.default.testGetCourse);
TestRouter.get("/getClass", TestController_1.default.testGetClasses);
TestRouter.post("/upload", TestController_1.default.testUpload);
TestRouter.get("/delete", TestController_1.default.testDelete);
//Test endpoint
TestRouter.get("/endpoint", TestController_1.default.testEndpoint);
//Test Token
TestRouter.post("/testCreateAccessTokenAndRefreshTokenForStudent", TestController_1.default.testCreateAccessTokenAndRefreshTokenForStudent);
TestRouter.post("/testCreateAccessTokenAndRefreshTokenForTeacher", TestController_1.default.testCreateAccessTokenAndRefreshTokenForTeacher);
TestRouter.post("/testCreateAccessTokenAndRefreshTokenForAdmin", TestController_1.default.testCreateAccessTokenAndRefreshTokenForAdmin);
TestRouter.post("/testVerifyAccessToken", TestController_1.default.testVerifyAccessToken);
TestRouter.post("/testRefreshAccessToken", TestController_1.default.testRefreshAccessToken);
TestRouter.get("/studentClass", TestController_1.default.getStudentClass);
TestRouter.get("/attendanceForm", TestController_1.default.createAttendanceForm);
TestRouter.get("/attendanceDetail", TestController_1.default.createAttendanceDetail);
//TestRouter.get("/getAllAttendanceForm", AttendanceFormController.getAllFormByClassID)
//Test Imgur
TestRouter.post("/imgur", TestController_1.default.testImgur);
//Test File Excel
TestRouter.post("/uploadExcel", TestController_1.default.uploadExcel);
//Test upload multiple files to imgur
TestRouter.post("/uploadMultipleFiles", TestController_1.default.uploadMultipleFiles);
TestRouter.get("/fetchImage", TestController_1.default.fetchImage);
TestRouter.post("/testGetClassesVersion1", TestController_1.default.testGetClassesVersion1);
TestRouter.post("/testGetAttendanceDetailVersion1", TestController_1.default.testGetAttendanceDetailVersion1);
TestRouter.get("/testHello", TestController_1.default.testOffline);
exports.default = TestRouter;
