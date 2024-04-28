"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AttendanceDetailService_1 = __importDefault(require("../services/AttendanceDetailService"));
const TimeConvert_1 = require("../utils/TimeConvert");
const Distance_1 = __importDefault(require("../utils/Distance"));
const UploadImageService_1 = __importDefault(require("../services/UploadImageService"));
const FaceMatchingService_1 = __importDefault(require("../services/FaceMatchingService"));
const db_config_1 = require("../config/db.config");
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const StudentClassService_1 = __importDefault(require("../services/StudentClassService"));
const ClassService_1 = __importDefault(require("../services/ClassService"));
const CompareCaseInsentitive_1 = __importDefault(require("../utils/CompareCaseInsentitive"));
const AttendanceFormService_1 = __importDefault(require("../services/AttendanceFormService"));
const attendanceDetailRepository = db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail);
class AttendanceDetailController {
    constructor() {
        this.takeAttendance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentID = req.body.studentID;
            const classID = req.body.classID;
            const formID = req.body.formID;
            const dateTimeAttendance = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date(req.body.dateTimeAttendance));
            const location = req.body.location;
            const latitude = req.body.latitude;
            const longtitude = req.body.longitude;
            const image = null;
            if (req.files != null) {
                image = req.files.file;
            }
            //Check
            console.log("StudentID: ", studentID);
            console.log("ClassID: ", classID);
            console.log("FormID ", formID);
            console.log("Location ", location);
            console.log("Latitude ", latitude);
            console.log("Longitude ", longtitude);
            console.log("Image ", image);
            console.log("Attendanced at", dateTimeAttendance);
            //Call database to get attendance detail
            let attendanceDetail = yield AttendanceDetailService_1.default.getAttendanceDetail(studentID, classID, formID);
            if (attendanceDetail == null) {
                return res.status(422).json({ message: "Your attendance detail is not recorded" });
            }
            let attendanceForm = attendanceDetail.attendanceForm;
            //Check location first (has a service to check)
            let lat = attendanceForm.latitude;
            let long = attendanceForm.longitude;
            console.log("-----------------------------------------------------");
            console.log("Latitude in form: ", lat);
            console.log("Longitude in form: ", long);
            console.log("Latitude in student: ", latitude);
            console.log("Longitude in student: ", longtitude);
            //will emit later
            console.log((0, Distance_1.default)(latitude, longtitude, lat, long));
            if ((0, Distance_1.default)(latitude, longtitude, lat, long) > attendanceForm.radius) {
                return res.status(422).json({ message: "Your location is not in range" });
            }
            //Check if attendance Detail exist
            if (attendanceDetail == null) {
                return res.status(422).json({ message: "Your attendance record does not exist" });
            }
            //Check form status and dateOpen
            if (attendanceForm.status == false) {
                return res.status(422).json({ message: "Form has been closed by lecturer" });
            }
            //Check form time will emit later
            let start = (0, TimeConvert_1.MySQLDatetimeToJSDatetime)(attendanceForm.startTime);
            let end = (0, TimeConvert_1.MySQLDatetimeToJSDatetime)(attendanceForm.endTime);
            let offset = new Date(start);
            offset.setMinutes(offset.getMinutes() + 10);
            offset = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(offset);
            if (dateTimeAttendance < start
                || dateTimeAttendance > end) {
                return res.status(422).json({ message: "Your attendance time is not in range. Please contact your lecturer" });
            }
            console.log("Start time: ", start);
            console.log("Offset time: ", offset);
            console.log("Student take attendance at: ", dateTimeAttendance);
            let result = 1;
            if (dateTimeAttendance >= start && dateTimeAttendance <= offset) {
                console.log("present cho sinh vien");
                result = 1;
            }
            else if (dateTimeAttendance > offset && dateTimeAttendance <= end) {
                console.log("late cho sinh vien");
                result = 0.5;
            }
            else if (dateTimeAttendance > end) {
                result = 0;
            }
            if (attendanceForm.type == 2) {
                attendanceDetail.location = location;
                attendanceDetail.latitude = latitude;
                attendanceDetail.longitude = longtitude;
                attendanceDetail.result = result;
                attendanceDetail.dateAttendanced = dateTimeAttendance;
                attendanceDetailRepository.save(attendanceDetail);
                return res.status(200).json(attendanceDetail);
            }
            //Send image to Imgur
            const data = yield UploadImageService_1.default.uploadAttendanceEvidenceFile(image);
            if (data == null) {
                return res.status(500).json({ message: "Cannot upload image. Please take attendance again." });
            }
            if (attendanceForm.type == 0) {
                let check = yield FaceMatchingService_1.default.faceMatching(image, studentID);
                if (!check) {
                    yield UploadImageService_1.default.deleteImageByImageHash(data.id);
                    return res.status(422).json({ message: "Your face does not match" });
                }
            }
            //If only type == 1
            //After send image success, do face matching
            //if face matching is not match, then delete image in Imgur
            //after all work successfully, store attendance detail in server
            attendanceDetail.url = data.link;
            attendanceDetail.location = location;
            attendanceDetail.latitude = latitude;
            attendanceDetail.longitude = longtitude;
            attendanceDetail.result = result;
            attendanceDetail.dateAttendanced = dateTimeAttendance;
            yield attendanceDetailRepository.save(attendanceDetail);
            return res.status(200).json(attendanceDetail);
        });
        //oke
        this.getAttendanceRecordsOfStudentByClassID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                const classID = req.params.id;
                let { data, error } = yield StudentClassService_1.default.checkStudentEnrolledInClass(studentID, classID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(422).json({ message: "Student is not enrolled in this class" });
                }
                let { data: result, error: err } = yield AttendanceDetailService_1.default.getAttendanceDetailByClassID(studentID, classID);
                if (err) {
                    return res.status(503).json({ message: err });
                }
                if (result.length == 0) {
                    return res.status(204).json({ message: "You haven't taken any attendance yet!" });
                }
                return res.status(200).json(result);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //oke
        this.getOfflineAttendanceRecordsOfStudentByClassID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                const classID = req.params.id;
                let { data, error } = yield StudentClassService_1.default.checkStudentEnrolledInClass(studentID, classID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(422).json({ message: "Student is not enrolled in this class" });
                }
                let { data: result, error: err } = yield AttendanceDetailService_1.default.getOfflineAttendanceDetailByClassID(studentID, classID);
                if (err) {
                    return res.status(503).json({ message: err });
                }
                if (result.length == 0) {
                    return res.status(204).json({ message: "You haven't taken any attendance yet!" });
                }
                return res.status(200).json(result);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        this.takeAttendanceOffline = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentID = req.body.studentID;
            const classID = req.body.classID;
            const formID = req.body.formID;
            const dateTimeAttendance = req.body.dateTimeAttendance;
            const location = req.body.location;
            const latitude = req.body.latitude;
            const longtitude = req.body.longitude;
            const image = req.files.file;
            //Check
            console.log("StudentID: ", studentID);
            console.log("ClassID: ", classID);
            console.log("FormID ", formID);
            console.log("Location ", location);
            console.log("Latitude ", latitude);
            console.log("Longitude ", longtitude);
            console.log("Image ", image);
            //Call database to get attendance detail
            let attendanceDetail = yield AttendanceDetailService_1.default.getAttendanceDetail(studentID, classID, formID);
            if (attendanceDetail == null) {
                return res.status(422).json({ message: "Your attendance detail is not recorded" });
            }
            let attendanceForm = attendanceDetail.attendanceForm;
            //Check location first (has a service to check)
            let lat = attendanceForm.latitude;
            let long = attendanceForm.longitude;
            //will emit later
            if ((0, Distance_1.default)(latitude, longtitude, lat, long) > attendanceForm.radius) {
                return res.status(422).json({ message: "Your location is not in range" });
            }
            //Check if attendance Detail exist
            if (attendanceDetail == null) {
                return res.status(422).json({ message: "Your attendance record does not exist" });
            }
            //Check form status and dateOpen
            if (attendanceForm.status == false) {
                return res.status(422).json({ message: "Form has been closed by lecturer" });
            }
            //Check form time will emit later
            let start = (0, TimeConvert_1.MySQLDatetimeToJSDatetime)(attendanceForm.startTime);
            let end = (0, TimeConvert_1.MySQLDatetimeToJSDatetime)(attendanceForm.endTime);
            let offset = new Date(start);
            offset.setMinutes(offset.getMinutes() + 10);
            offset = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(offset);
            let result = 1;
            if (dateTimeAttendance < start
                || dateTimeAttendance > end) {
                return res.status(422).json({ message: "Your attendance time is not in range. Please contact your lecturer" });
            }
            console.log("Start time: ", start);
            console.log("Offset time: ", offset);
            console.log("Student take attendance at: ", dateTimeAttendance);
            if (dateTimeAttendance >= start && dateTimeAttendance <= offset) {
                console.log("present cho sinh vien");
                result = 1;
            }
            else if (dateTimeAttendance > offset && dateTimeAttendance <= end) {
                console.log("late cho sinh vien");
                result = 0.5;
            }
            else if (dateTimeAttendance > end) {
                result = 0;
            }
            //face checking
            let check = yield FaceMatchingService_1.default.faceMatching(image, studentID);
            if (!check) {
                return res.status(422).json({ message: "Your face does not match" });
            }
            //Send image to Imgur
            const data = yield UploadImageService_1.default.uploadAttendanceEvidenceFile(image);
            if (data == null) {
                yield UploadImageService_1.default.deleteImageByImageHash(data.id);
                return res.status(500).json({ message: "Cannot upload image. Please take attendance again." });
            }
            //If only type == 1
            //After send image success, do face matching
            //if face matching is not match, then delete image in Imgur
            //after all work successfully, store attendance detail in server
            attendanceDetail.url = data.link;
            attendanceDetail.location = location;
            attendanceDetail.latitude = latitude;
            attendanceDetail.longitude = longtitude;
            attendanceDetail.result = result;
            attendanceDetail.dateAttendanced = dateTimeAttendance;
            attendanceDetail.offline = true;
            yield attendanceDetailRepository.save(attendanceDetail);
            res.status(200).json(attendanceDetail);
        });
        this.getAttendanceDetailByStudentIDClassIDFormID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.params.studentid;
                const classID = req.params.classid;
                const formID = req.params.formid;
                const teacherID = req.payload.userID;
                let checkAuth = yield ClassService_1.default.getClassByID(classID);
                if (checkAuth == null) {
                    return res.status(503).json({ message: "Cannot authorize teacher to perform this action" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, checkAuth.teacher.teacherID) == false) {
                    return res.status(403).json({ message: "Action Denied. Teacher is not authorized" });
                }
                let { data, error } = yield AttendanceDetailService_1.default.getAttendanceDetailByStudentIDClassIDFormID(studentID, classID, formID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(422).json({ message: "There is no attendace record found" });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //oke
        this.getAttendanceDetailsByFormID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //check if teacher owns this form
            const teacherID = req.payload.userID;
            const formID = req.params.id;
            //getAttendanceDetails
            return res.status(200).json(yield AttendanceFormService_1.default.getAttendanceFormByFormID(formID));
        });
        //test must
        this.editAttendanceDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                const studentID = req.params.studentid;
                const classID = req.params.classid;
                const formID = req.params.formid;
                const topic = req.body.topic;
                const confirmStatus = req.body.confirmStatus;
                const message = req.body.message;
                let checkAuth = yield ClassService_1.default.getClassByID(classID);
                if (checkAuth == null) {
                    return res.status(503).json({ message: "Cannot authorize teacher to perform this action" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, checkAuth.teacher.teacherID) == false) {
                    return res.status(403).json({ message: "Action Denied. Teacher is not authorized" });
                }
                let { data: attendanceDetail, error } = yield AttendanceDetailService_1.default.checkAttendanceDetailExist(studentID, classID, formID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (attendanceDetail == null) {
                    return res.status(422).json({ message: "Attendance detail does not exist" });
                }
                if (yield AttendanceDetailService_1.default.editAttendanceDetail(attendanceDetail, message, confirmStatus, topic)) {
                    return res.status(200).json({ message: "Edit successfully" });
                }
                return res.status(503).json({ message: "Edit failed" });
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new AttendanceDetailController();
