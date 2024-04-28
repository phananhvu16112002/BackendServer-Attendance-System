"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const google_auth_library_1 = require("google-auth-library");
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Student_1 = require("../models/Student");
const db_config_1 = require("../config/db.config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const TimeConvert_1 = require("../utils/TimeConvert");
//for face recognition
const promises_1 = __importDefault(require("fs/promises"));
const tf = __importStar(require("@tensorflow/tfjs-node"));
const faceapi = __importStar(require("@vladmandic/face-api"));
const canvas_1 = __importDefault(require("canvas"));
const StudentClass_1 = require("../models/StudentClass");
const AttendanceForm_1 = require("../models/AttendanceForm");
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const StudentService_1 = __importDefault(require("../services/StudentService"));
const EmailService_1 = __importDefault(require("../services/EmailService"));
const FaceImageService_1 = __importDefault(require("../services/FaceImageService"));
// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
// async function LoadModels() {
//     await faceapi.nets.faceRecognitionNet.loadFromDisk("./premodels");
//     await faceapi.nets.faceLandmark68Net.loadFromDisk("./premodels");
//     await faceapi.nets.ssdMobilenetv1.loadFromDisk("./premodels");
// }
// LoadModels();
const myOAuth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});
class StudentController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Get information (email, username, password) from request
                const email = req.body.email;
                const password = req.body.password;
                const username = req.body.username;
                const student = yield StudentService_1.default.checkStudentExist(username);
                if (student == null) {
                    return res.status(422).json({ message: "Username must be your student's ID" });
                }
                if (StudentService_1.default.checkStudentStatus(student)) {
                    return res.status(422).json({ message: "Account's already been activated. Please login" });
                }
                //Create OTP and hash OTP, password
                const OTP = otp_generator_1.default.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashOTP = yield bcrypt_1.default.hash(OTP, salt);
                const hashPassword = yield bcrypt_1.default.hash(password, salt);
                //Use Google Access Token to send email
                if ((yield EmailService_1.default.sendEmail(email, OTP)) == false) {
                    return res.status(503).json({ message: 'OTP failed' });
                }
                //Insert into database password and OTP
                yield StudentService_1.default.updateStudentPasswordAndOTP(student, hashPassword, hashOTP);
                res.status(200).json({ message: 'OTP has been sent to your email' });
            }
            catch (e) {
                res.status(500).json({ message: e.message });
            }
        });
        this.verifyRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //Get information (email, OTP)
                const email = req.body.email;
                const OTP = req.body.OTP;
                //Verify OTP
                if ((yield StudentService_1.default.checkStudentOTPRegister(email, OTP)) == false) {
                    return res.status(422).json({ message: 'OTP is not valid' });
                }
                res.status(200).json({ message: 'OTP is valid' });
            }
            catch (_a) {
                res.status(500).json({ message: 'OTP is not valid' });
            }
        });
        //must test
        this.loginWithCheckImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const password = req.body.password;
                const studentID = StudentService_1.default.transformEmailToID(email);
                const studentDeviceToken = req.body.deviceToken;
                let { data: student, error: errorStudent } = yield StudentService_1.default.checkStudentExistWithImages(studentID);
                if (errorStudent) {
                    return res.status(503).json({ message: errorStudent });
                }
                if (student == null) {
                    return res.status(422).json({ message: "Account does not exist" });
                }
                if (StudentService_1.default.checkStudentStatus(student) == false) {
                    return res.status(422).json({ message: "Account has not been activated yet. Please register!" });
                }
                if ((yield StudentService_1.default.login(student, email, password)) == false) {
                    return res.status(422).json({ message: "Email or password incorrect" });
                }
                console.log('Face Image checking:');
                let { data: required, error: err, message: message } = yield FaceImageService_1.default.checkImagesValid(student.studentImage, student.timeToLiveImages);
                if (err) {
                    return res.status(503).json({ message: err });
                }
                const accessToken = jsonwebtoken_1.default.sign({ userID: studentID, role: "student" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
                const refreshToken = jsonwebtoken_1.default.sign({ userID: studentID, role: "student" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h' });
                if ((yield StudentService_1.default.storeDeviceToken(studentID, studentDeviceToken)) == false) {
                    return res.status(503).json({ message: "Cannot store device token" });
                }
                return res.status(200).json({
                    message: "Login Successfully",
                    note: message,
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                    studentID: studentID,
                    studentEmail: email,
                    studentName: student.studentName,
                    requiredImage: !required
                });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const password = req.body.password;
                const studentID = StudentService_1.default.transformEmailToID(email);
                let student = yield StudentService_1.default.checkStudentExist(studentID);
                if (student == null) {
                    return res.status(422).json({ message: "Account does not exist" });
                }
                if (StudentService_1.default.checkStudentStatus(student) == false) {
                    return res.status(422).json({ message: "Account has not been activated yet. Please register!" });
                }
                if ((yield StudentService_1.default.login(student, email, password)) == false) {
                    return res.status(422).json({ message: "Email or password incorrect" });
                }
                const accessToken = jsonwebtoken_1.default.sign({ userID: studentID, role: "student" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m' });
                const refreshToken = jsonwebtoken_1.default.sign({ userID: studentID, role: "student" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' });
                yield StudentService_1.default.updateStudentAccessTokenAndRefreshToken(student, accessToken, refreshToken);
                res.status(200).json({
                    message: "Login Successfully",
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                    studentID: studentID,
                    studentEmail: email,
                    studentName: student.studentName
                });
            }
            catch (e) {
                console.error(e);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const studentID = StudentService_1.default.transformEmailToID(email);
                let student = yield StudentService_1.default.checkStudentExist(studentID);
                if (student == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (StudentService_1.default.checkStudentStatus(student) == false) {
                    return res.status(422).json({ message: "Account with this email address is not active" });
                }
                //Generate OTP
                const OTP = otp_generator_1.default.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashOTP = yield bcrypt_1.default.hash(OTP, salt);
                //Send OTP
                if ((yield EmailService_1.default.sendEmail(email, OTP)) == false) {
                    return res.status(503).json({ message: 'OTP failed' });
                }
                //Update OTP in database
                yield StudentService_1.default.updateStudentOTP(student, hashOTP);
                res.status(200).json({ message: 'OTP has been sent to your email' });
            }
            catch (e) {
                console.error(error);
                res.status(500).json({ message: e.message });
            }
        });
        this.verifyForgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //Get Information User and OTP
                const email = req.body.email;
                const OTP = req.body.OTP;
                const studentID = StudentService_1.default.transformEmailToID(email);
                //Verify user input
                let student = yield StudentService_1.default.checkStudentExist(studentID);
                if (student == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (StudentService_1.default.checkStudentStatus(student) == false) {
                    return res.status(422).json({ message: "Account with this email address is not active" });
                }
                //Check OTP in database expired
                if (StudentService_1.default.checkStudentOTPExpired(student)) {
                    return res.status(422).json({ message: "OTP expired" });
                }
                //Verify OTP
                if ((yield StudentService_1.default.checkStudentOTPReset(student, OTP)) == false) {
                    return res.status(422).json({ message: "OTP is not valid" });
                }
                const resetToken = jsonwebtoken_1.default.sign({ email: email }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1m' });
                yield StudentService_1.default.updateStudentResetToken(student, resetToken);
                res.status(200).json({ message: "OTP is valid", resetToken: resetToken });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Get Information User
                const email = req.body.email;
                const newPassword = req.body.newPassword;
                const studentID = StudentService_1.default.transformEmailToID(email);
                //Check user input
                let student = yield StudentService_1.default.checkStudentExist(studentID);
                if (student == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (StudentService_1.default.checkStudentStatus(student) == false) {
                    return res.status(422).json({ message: "Account with this email address is not active" });
                }
                //Update password
                yield StudentService_1.default.updateStudentPassword(student, newPassword);
                res.status(200).json({ message: "Reset Password successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.newPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                const oldPassword = req.body.oldPassword;
                const newPassword = req.body.newPassword;
                let student = yield StudentService_1.default.checkStudentExist(studentID);
                if (student == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (StudentService_1.default.checkStudentStatus(student) == false) {
                    return res.status(422).json({ message: "Account with this email address is not active" });
                }
                if ((yield StudentService_1.default.login(student, student.studentEmail, oldPassword)) == false) {
                    return res.status(422).json({ message: "Old password does not match" });
                }
                yield StudentService_1.default.updateStudentPassword(student, newPassword);
                return res.status(200).json({ message: "Reset Password successfully" });
            }
            catch (e) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.resendOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const studentID = StudentService_1.default.transformEmailToID(email);
                //Check user input
                let student = yield StudentService_1.default.checkStudentExist(studentID);
                if (student == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (StudentService_1.default.checkStudentStatus(student) == false) {
                    return res.status(422).json({ message: "Account with this email address is not active" });
                }
                //Generate OTP
                const OTP = otp_generator_1.default.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashOTP = yield bcrypt_1.default.hash(OTP, salt);
                //Send OTP
                if ((yield EmailService_1.default.sendEmail(email, OTP)) == false) {
                    return res.status(503).json({ message: 'OTP failed' });
                }
                //Update OTP in database
                yield StudentService_1.default.updateStudentOTP(student, hashOTP);
                res.status(200).json({ message: 'OTP has been sent to your email' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.resendOTPRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const studentID = StudentService_1.default.transformEmailToID(email);
                //Check user input
                let student = yield StudentService_1.default.checkStudentExist(studentID);
                if (student == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                //Generate OTP
                const OTP = otp_generator_1.default.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashOTP = yield bcrypt_1.default.hash(OTP, salt);
                //Send OTP
                if ((yield EmailService_1.default.sendEmail(email, OTP)) == false) {
                    return res.status(503).json({ message: 'OTP failed' });
                }
                //Update OTP in database
                yield StudentService_1.default.updateStudentOTP(student, hashOTP);
                res.status(200).json({ message: 'OTP has been sent to your email' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.takeAttendance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentID = req.body.studentID;
            const classID = req.body.classID;
            const formID = req.body.formID;
            const image = req.files.file;
            //Get time now to process later
            let timeNow = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
            //check if there is a class that has this attendance form
            let attendanceForm = yield db_config_1.AppDataSource.getRepository(AttendanceForm_1.AttendanceForm).findOneBy({ formID: formID, classes: classID });
            if (attendanceForm == null) {
                return res.status(403).json({ message: "No classes found that has this attendance form" });
            }
            //check if student has registered the class or not
            let studentClass = yield db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass).findOneBy({ studentID: studentID, classesID: classID });
            if (studentClass == null) {
                return res.status(403).json({ message: "Student is not registered in this class" });
            }
            //check end time of the form
            let endTimeForm = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date(attendanceForm.endTime));
            if (timeNow > endTimeForm) {
                return res.status(403).json({ message: "The form has been closed" });
            }
            //check face recognition
            //convert the request image file to canvas 
            let canvasImg = yield canvas_1.default.loadImage(image);
            //get face descriptions and resized
            let faceDescription = yield faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
            faceDescription = faceapi.resizeResults(faceDescription, canvasImg);
            //pre train model
            const labels = ["1", "2", "3"];
            const labeledFaceDescriptors = yield Promise.all(labels.map((label) => __awaiter(this, void 0, void 0, function* () {
                const imgURL = `../../students/${studentID}/${label}.jpg`;
                const fileBuffer = yield promises_1.default.readFile(imgURL);
                const canvasImg = yield canvas_1.default.loadImage(fileBuffer);
                const faceDescription = yield faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
                return new faceapi.LabeledFaceDescriptors(label, faceDescription);
            })));
            //Matching
            const threshold = 0.6;
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold);
            const results = faceMatcher.findBestMatch(faceDescription);
            //check result
            if (results.label == "unknown") {
                return res.status(403).json({ message: "Your face does not match in the database" });
            }
            //Create attendance detail
            let attendanceDetail = new AttendanceDetail_1.AttendanceDetail();
            attendanceDetail.present = true;
            attendanceDetail.studentDetail = studentClass;
            attendanceDetail.classes = studentClass;
            attendanceDetail.dateAttendanced = timeNow;
            yield db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail).save(attendanceDetail);
            return res.status(200).json({ message: "Take attendance successfully" });
        });
        //oke
        this.sendImages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentID = req.payload.userID;
                if (req.files == null) {
                    console.log("Please send at least one image");
                    return res.status(422).json({ message: "Please send at least one image" });
                }
                let files = req.files.file;
                if (files == null) {
                    files = [];
                }
                if (!Array.isArray(files)) {
                    files = [files];
                }
                if (files.length != 3) {
                    console.log("Only three image files allowed");
                    return res.status(422).json({ message: "Only three image files allowed" });
                }
                let { data: student, error: errorStudent } = yield StudentService_1.default.checkStudentExistWithImages(studentID);
                if (errorStudent) {
                    console.log(errorStudent);
                    return res.status(503).json({ message: errorStudent });
                }
                let { data: required, error: err, message: message } = yield FaceImageService_1.default.checkImagesValid(student.studentImage, student.timeToLiveImages);
                if (err) {
                    console.log(err);
                    return res.status(503).json({ message: err });
                }
                if (required) {
                    console.log(required);
                    return res.status(422).json({ message: message });
                }
                let imageStudentList = yield FaceImageService_1.default.imageStudentListFromImage(files);
                console.log('ImageList', imageStudentList);
                if (imageStudentList.length == 0) {
                    console.log("Failed to upload images. Please upload again");
                    return res.status(503).json({ message: "Failed to upload images. Please upload again" });
                }
                let { data: images, error: errorImages } = yield FaceImageService_1.default.loadStudentImagesToDatabase(imageStudentList, student);
                if (errorImages) {
                    return res.status(503).json({ message: errorImages });
                }
                return res.status(200).json(images);
            }
            catch (e) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        //oke
        this.getStudentsImagesByStudentID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { data, error } = yield StudentService_1.default.getStudentsImageByStudentID(req.payload.userID);
                console.log('Data:', data);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                return res.status(200).json(data);
            }
            catch (e) {
                console.log('Err', e);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new StudentController();
