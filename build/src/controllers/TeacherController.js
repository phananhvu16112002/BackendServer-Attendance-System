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
const ClassService_1 = __importDefault(require("../services/ClassService"));
const TeacherService_1 = __importDefault(require("../services/TeacherService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const EmailService_1 = __importDefault(require("../services/EmailService"));
const teacherService = TeacherService_1.default;
const classService = ClassService_1.default;
class TeacherController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            const password = req.body.password;
            const username = req.body.username;
            try {
                const teacher = yield teacherService.checkTeacherExist(username);
                if (teacher == null) {
                    return res.status(422).json({ message: "Username must be your ID" });
                }
                if (teacher.active) {
                    return res.status(422).json({ message: "Account's already been activated. Please login!" });
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
                yield teacherService.updateTeacherPasswordAndOTP(teacher, hashPassword, hashOTP);
                res.status(200).json({ message: 'OTP has been sent to your email' });
            }
            catch (e) {
                res.status(500).json({ message: e.message });
            }
        });
        this.verifyRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const OTP = req.body.OTP;
                if ((yield teacherService.checkTeacherOTPRegister(email, OTP)) == false) {
                    return res.status(422).json({ message: "OTP is not valid" });
                }
                return res.status(200).json({ message: 'OTP is valid' });
            }
            catch (e) {
                return res.status(500).json({ message: 'OTP is not valid' });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const password = req.body.password;
                const teacherID = email.split('@')[0];
                let teacher = yield teacherService.checkTeacherExist(teacherID);
                if (teacher == null) {
                    return res.status(422).json({ message: "Account does not exist" });
                }
                if (teacher.active == false) {
                    return res.status(422).json({ message: "Account has not been activated yet. Please register!" });
                }
                if ((yield teacherService.login(teacher, email, password)) == false) {
                    return res.status(422).json({ message: "Email or password incorrect" });
                }
                const accessToken = jsonwebtoken_1.default.sign({ userID: teacherID, role: "teacher" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
                const refreshToken = jsonwebtoken_1.default.sign({ userID: teacherID, role: "teacher" }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '2h' });
                yield teacherService.updateTeacherAccessTokenAndRefreshToken(accessToken, refreshToken);
                return res.status(200).json({
                    message: "Login Successfully",
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                    teacherID: teacherID,
                    teacherEmail: email,
                    teacherName: teacher.teacherName
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
                const teacherID = email.split('@')[0];
                let teacher = yield teacherService.checkTeacherExist(teacherID);
                if (teacher == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (teacher.active == false) {
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
                yield teacherService.updateTeacherOTP(teacher, hashOTP);
                res.status(200).json({ message: 'OTP has been sent to your email' });
            }
            catch (e) {
                console.error(error);
                return res.status(500).json({ message: e.message });
            }
        });
        this.verifyForgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const OTP = req.body.OTP;
                const teacherID = email.split('@')[0];
                let teacher = yield teacherService.checkTeacherExist(teacherID);
                if (teacher == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (teacher.active == false) {
                    return res.status(422).json({ message: "Account with this eamil address is not active" });
                }
                if (teacherService.checkTeacherOTPExpired(teacher)) {
                    return res.status(422).json({ message: "OTP expired" });
                }
                if ((yield teacherService.checkTeacherOTPReset(teacher, OTP)) == false) {
                    return res.status(422).json({ message: "OTP is not valid" });
                }
                const resetToken = jsonwebtoken_1.default.sign({ email: email }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1m' });
                yield teacherService.updateTeacherResetToken(teacher, resetToken);
                res.status(200).json({ message: "OTP is valid", resetToken: resetToken });
            }
            catch (e) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const newPassword = req.body.newPassword;
                const teacherID = email.split('@')[0];
                let teacher = yield teacherService.checkTeacherExist(teacherID);
                if (teacher == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (teacher.active == false) {
                    return res.status(422).json({ message: "Account with this email address is not active" });
                }
                yield teacherService.updateTeacherPassword(teacher, newPassword);
                res.status(200).json({ message: "Reset Password successfully" });
            }
            catch (e) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.newPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                const oldPassword = req.body.oldPassword;
                const newPassword = req.body.newPassword;
                let teacher = yield teacherService.checkTeacherExist(teacherID);
                if (teacher == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (teacher.active == false) {
                    return res.status(422).json({ message: "Account with this eamil address is not active" });
                }
                if ((yield teacherService.login(teacher, teacher.teacherEmail, oldPassword)) == false) {
                    return res.status(422).json({ message: "Email or password incorrect" });
                }
                yield teacherService.updateTeacherPassword(teacher, newPassword);
                return res.status(200).json({ message: "Reset Password successfully" });
            }
            catch (e) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        // resendOTPRegister = async (req,res) => {
        //     try{
        //         const email = req.body.email;
        //         const teacherID = email.split('@')[0];
        //         let teacher = await teacherService.checkTeacherExist(teacherID);
        //         if (teacher == null){
        //             return res.status(422).json({message: "Email address does not exist"});
        //         }
        //         // if (teacher.active == false){
        //         //     return res.status(422).json({message: "Account with this email address is not active"});
        //         // }
        //         //Generate OTP
        //         const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        //         const salt = await bcrypt.genSalt(10)
        //         const hashOTP = await bcrypt.hash(OTP, salt)
        //         //Send OTP
        //         if (await EmailService.sendEmail(email, OTP) == false){
        //             return res.status(503).json({ message: 'OTP failed' });
        //         }
        //         await teacherService.updateTeacherOTP(teacher, OTP);
        //         res.status(200).json({ message: 'OTP has been sent to your email' });
        //     } catch (e) {
        //         res.status(500).json({ message: 'Internal Server Error' });
        //     }
        // }
        this.resendOTP = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const teacherID = email.split('@')[0];
                let teacher = yield teacherService.checkTeacherExist(teacherID);
                if (teacher == null) {
                    return res.status(422).json({ message: "Email address does not exist" });
                }
                if (teacher.active == false) {
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
                yield teacherService.updateTeacherOTP(teacher, hashOTP);
                res.status(200).json({ message: 'OTP has been sent to your email' });
            }
            catch (e) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
        this.resendOTPRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const teacherID = email.split('@')[0];
                let teacher = yield teacherService.checkTeacherExist(teacherID);
                if (teacher == null) {
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
                yield teacherService.updateTeacherOTP(teacher, hashOTP);
                res.status(200).json({ message: 'OTP has been sent to your email' });
            }
            catch (e) {
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
}
exports.default = new TeacherController();
