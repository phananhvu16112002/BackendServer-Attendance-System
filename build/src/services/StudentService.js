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
const bcrypt_1 = __importDefault(require("bcrypt"));
const TimeConvert_1 = require("../utils/TimeConvert");
const TimeConvert_2 = require("../utils/TimeConvert");
const db_config_1 = require("../config/db.config");
const Student_1 = require("../models/Student");
const StudentDeviceToken_1 = require("../models/StudentDeviceToken");
const studentRepository = db_config_1.AppDataSource.getRepository(Student_1.Student);
const studentDeviceTokenRepository = db_config_1.AppDataSource.getRepository(StudentDeviceToken_1.StudentDeviceToken);
class StudentService {
    constructor() {
        //oke
        this.checkStudentExistWithImages = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentRepository.findOne({
                    where: {
                        studentID: studentID
                    },
                    relations: {
                        studentImage: true
                    }
                });
                return { data: data, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: null, error: "Failed getting students" };
            }
        });
        this.checkStudentExist = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let student = yield studentRepository.findOneBy({ studentID: studentID });
                return student;
            }
            catch (e) {
                //logging error message
                return null;
            }
        });
        this.checkStudentStatus = (student) => {
            return student.active;
        };
        this.updateStudentPasswordAndOTP = (student, hashedPassword, OTP) => __awaiter(this, void 0, void 0, function* () {
            try {
                let currentDate = new Date();
                currentDate.setMinutes(currentDate.getMinutes() + 1);
                student.studentHashedPassword = hashedPassword;
                student.hashedOTP = OTP;
                student.timeToLiveOTP = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(currentDate);
                yield studentRepository.save(student);
            }
            catch (e) {
                //logging error message
                return null;
            }
        });
        this.checkStudentOTPRegister = (email, OTP) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = email.split('@')[0];
                let student = yield studentRepository.findOneBy({ studentID: username });
                let hashedOTP = student.hashedOTP;
                let result = yield bcrypt_1.default.compare(OTP, hashedOTP);
                if (result == false) {
                    return false;
                }
                if (this.checkStudentOTPExpired(student) == false) {
                    return false;
                }
                student.active = true;
                yield studentRepository.save(student);
                return true;
            }
            catch (e) {
                //logging error message
                return false;
            }
        });
        this.checkUsernameAndEmailMatch = (username, email) => {
            return username == email.split('@')[0];
        };
        this.transformEmailToID = (email) => {
            return email.split('@')[0];
        };
        this.login = (student, email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield bcrypt_1.default.compare(password, student.studentHashedPassword);
                if (email.toLowerCase() == student.studentEmail.toLowerCase() && result == true) {
                    return true;
                }
                return false;
            }
            catch (e) {
                //logging error message
                return false;
            }
        });
        this.updateStudentAccessTokenAndRefreshToken = (student, accessToken, refreshToken) => __awaiter(this, void 0, void 0, function* () {
            try {
                student.accessToken = accessToken;
                student.refreshToken = refreshToken;
                yield studentRepository.save(student);
            }
            catch (e) {
                //logging error message
            }
        });
        this.updateStudentOTP = (student, OTP) => __awaiter(this, void 0, void 0, function* () {
            try {
                let currentDate = new Date();
                currentDate.setMinutes(currentDate.getMinutes() + 1);
                student.hashedOTP = OTP;
                student.timeToLiveOTP = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(currentDate);
                yield studentRepository.save(student);
            }
            catch (e) {
                //logging error message
            }
        });
        this.checkStudentOTPExpired = (student) => {
            try {
                // let timeToLiveOTPConvert = new Date(student.timeToLiveOTP);
                // let timeToLiveOTPUse = JSDatetimeToMySQLDatetime(timeToLiveOTPConvert);
                return (0, TimeConvert_2.MySQLDatetimeToJSDatetime)(student.timeToLiveOTP) > (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
            }
            catch (e) {
                return false;
            }
        };
        this.checkStudentOTPReset = (student, OTP) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bcrypt_1.default.compare(OTP, student.hashedOTP);
            }
            catch (e) {
                return false;
            }
        });
        this.updateStudentResetToken = (student, resetToken) => __awaiter(this, void 0, void 0, function* () {
            student.resetToken = resetToken;
            yield studentRepository.save(student);
        });
        this.updateStudentPassword = (student, password) => __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashPassword = yield bcrypt_1.default.hash(password, salt);
            student.hashedOTP = "";
            student.resetToken = "";
            student.studentHashedPassword = hashPassword;
            yield studentRepository.save(student);
        });
        //testable
        this.loadStudentsToDatabase = (studentList) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentRepository.insert(studentList);
                return { data: data, error: null };
            }
            catch (e) {
                return { data: null, error: e.message };
            }
        });
        //testable
        this.getStudents = () => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentRepository.find({
                    select: {
                        studentID: true,
                        studentEmail: true,
                        studentName: true
                    }
                });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: [], error: "Failed getting students" };
            }
        });
        //testalbe
        this.postStudent = (studentID, studentName, studentEmail) => __awaiter(this, void 0, void 0, function* () {
            try {
                let student = new Student_1.Student();
                student.studentID = studentID;
                student.studentEmail = studentEmail;
                student.studentName = studentName;
                let data = yield studentRepository.insert(student);
                let result = yield studentRepository.findOne({
                    where: {
                        studentID: studentID
                    }, select: {
                        studentID: true,
                        studentName: true,
                        studentEmail: true
                    }
                });
                return { data: result, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed adding student" };
            }
        });
        //oke
        this.getStudentsImageByStudentID = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentRepository.find({
                    where: {
                        studentID: studentID
                    }, select: {
                        studentEmail: true,
                        studentName: true,
                        timeToLiveImages: true
                    }, relations: {
                        studentImage: true
                    }
                });
                return { data: data[0], error: null };
            }
            catch (e) {
                console.log(e);
                return { data: null, error: "Error getting images" };
            }
        });
        //oke
        this.storeDeviceToken = (studentID, deviceToken) => __awaiter(this, void 0, void 0, function* () {
            try {
                let studentDeviceToken = new StudentDeviceToken_1.StudentDeviceToken();
                studentDeviceToken.studentID = studentID;
                studentDeviceToken.token = deviceToken;
                if (yield studentDeviceTokenRepository.save(studentDeviceToken)) {
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
        //oke
        this.getDeviceTokensByStudentID = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentDeviceTokenRepository.find({
                    where: {
                        studentID: studentID
                    }
                });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: [], error: "Fail getting device tokens" };
            }
        });
        this.editStudent = (studentID, studentName) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentRepository.update({ studentID: studentID }, { studentName: studentName });
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //must test
        this.deleteStudent = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield studentRepository.delete({ studentID: studentID });
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //must test
        this.searchStudent = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield studentRepository.findOne({
                    where: {
                        studentID: studentID
                    }
                });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed getting student" };
            }
        });
    }
}
exports.default = new StudentService();
