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
const db_config_1 = require("../config/db.config");
const Teacher_1 = require("../models/Teacher");
const bcrypt_1 = __importDefault(require("bcrypt"));
const TimeConvert_1 = require("../utils/TimeConvert");
const TimeConvert_2 = require("../utils/TimeConvert");
const teacherRepository = db_config_1.AppDataSource.getRepository(Teacher_1.Teacher);
class TeacherService {
    constructor() {
        this.checkTeacherExist = (teacherID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let teacher = yield teacherRepository.findOneBy({ teacherID: teacherID });
                return teacher;
            }
            catch (e) {
                return null;
            }
        });
        this.updateTeacherPasswordAndOTP = (teacher, hashedPassword, OTP) => __awaiter(this, void 0, void 0, function* () {
            try {
                let currentDate = new Date();
                currentDate.setMinutes(currentDate.getMinutes() + 1);
                teacher.teacherHashedPassword = hashedPassword;
                teacher.hashedOTP = OTP;
                teacher.timeToLiveOTP = (0, TimeConvert_2.JSDatetimeToMySQLDatetime)(currentDate);
                yield teacherRepository.save(teacher);
            }
            catch (e) {
                return null;
            }
        });
        this.checkTeacherOTPRegister = (email, OTP) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = email.split('@')[0];
                let teacher = yield teacherRepository.findOneBy({ teacherID: username });
                let hashedOTP = teacher.hashedOTP;
                let result = yield bcrypt_1.default.compare(OTP, hashedOTP);
                if (result == false) {
                    return false;
                }
                if (this.checkTeacherOTPExpired(teacher) == false) {
                    return false;
                }
                teacher.active = true;
                yield teacherRepository.save(teacher);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        this.login = (teacher, email, password) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield bcrypt_1.default.compare(password, teacher.teacherHashedPassword);
                if (email.toLowerCase() == teacher.teacherEmail.toLowerCase() && result == true) {
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
        this.updateTeacherAccessTokenAndRefreshToken = (teacher, accessToken, refreshToken) => __awaiter(this, void 0, void 0, function* () {
            try {
                teacher.accessToken = accessToken;
                teacher.refreshToken = refreshToken;
                yield teacherRepository.save(teacher);
            }
            catch (e) {
                //logging error message
            }
        });
        this.updateTeacherOTP = (teacher, OTP) => __awaiter(this, void 0, void 0, function* () {
            try {
                let currentDate = new Date();
                currentDate.setMinutes(currentDate.getMinutes() + 1);
                teacher.hashedOTP = OTP;
                teacher.timeToLiveOTP = (0, TimeConvert_2.JSDatetimeToMySQLDatetime)(currentDate);
                yield teacherRepository.save(teacher);
            }
            catch (e) {
            }
        });
        this.checkTeacherOTPExpired = (teacher) => {
            try {
                return (0, TimeConvert_1.MySQLDatetimeToJSDatetime)(teacher.timeToLiveOTP) > (0, TimeConvert_2.JSDatetimeToMySQLDatetime)(new Date());
            }
            catch (e) {
                return false;
            }
        };
        this.checkTeacherOTPReset = (teacher, OTP) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bcrypt_1.default.compare(OTP, teacher.hashedOTP);
            }
            catch (e) {
                return false;
            }
        });
        this.updateTeacherResetToken = (teacher, resetToken) => __awaiter(this, void 0, void 0, function* () {
            teacher.resetToken = resetToken;
            yield teacherRepository.save(teacher);
        });
        this.updateTeacherPassword = (teacher, password) => __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashPassword = yield bcrypt_1.default.hash(password, salt);
            teacher.hashedOTP = "";
            teacher.resetToken = "";
            teacher.studentHashedPassword = hashPassword;
            yield teacherRepository.save(teacher);
        });
        this.getClassesByTeacherID = (teacherID) => __awaiter(this, void 0, void 0, function* () {
            try {
                const classes = yield teacherRepository.findOne({
                    where: {
                        teacherID: teacherID
                    },
                    select: {
                        teacherEmail: false,
                        teacherHashedPassword: false,
                        teacherID: false,
                        teacherName: false,
                        active: false,
                        timeToLiveOTP: false,
                        hashedOTP: false,
                        accessToken: false,
                        refreshToken: false,
                        classes: true,
                    },
                    relations: {
                        classes: true
                    }
                });
                return classes;
            }
            catch (e) {
                return null;
            }
        });
        //oke
        this.loadTeachersToDatabase = (teacherList) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield teacherRepository.insert(teacherList);
                return { data: data, error: null };
            }
            catch (e) {
                return { data: null, error: e.message };
            }
        });
        //testable
        this.getTeachers = () => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield teacherRepository.find({
                    select: {
                        teacherID: true,
                        teacherEmail: true,
                        teacherName: true
                    }
                });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: [], error: "Failed getting teachers" };
            }
        });
        //testable
        this.postTeacher = (teacherID, teacherName, teacherEmail) => __awaiter(this, void 0, void 0, function* () {
            try {
                let teacher = new Teacher_1.Teacher();
                teacher.teacherID = teacherID;
                teacher.teacherName = teacherName;
                teacher.teacherEmail = teacherEmail;
                let data = yield teacherRepository.insert(teacher);
                let result = yield teacherRepository.findOne({
                    where: {
                        teacherID: teacherID
                    }
                });
                return { data: result, error: null };
            }
            catch (e) {
                return { data: null, error: e.message };
            }
        });
        //must test
        this.editTeacher = (teacherID, teacherName) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield teacherRepository.update({ teacherID: teacherID }, { teacherName: teacherName });
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //must test
        this.deleteTeacher = (teacherID) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield teacherRepository.delete({ teacherID: teacherID });
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //must test
        this.searchTeacher = (teacherID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield teacherRepository.findOne({ where: { teacherID: teacherID } });
                return { data: data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed getting teacher" };
            }
        });
    }
}
exports.default = new TeacherService();
