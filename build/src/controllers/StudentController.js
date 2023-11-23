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
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const google_auth_library_1 = require("google-auth-library");
const otp_generator_1 = __importDefault(require("otp-generator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Student_1 = require("../models/Student");
const db_config_1 = require("../config/db.config");
const myOAuth2Client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});
class StudentController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //Get information (email, username, password) from request
                const email = req.body.email;
                const password = req.body.password;
                const username = req.body.username;
                //Create OTP and hash OTP, password
                const OTP = otp_generator_1.default.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashOTP = yield bcrypt_1.default.hash(OTP, salt);
                const hashPassword = yield bcrypt_1.default.hash(password, salt);
                //Insert into database password and OTP
                let studentRequest = db_config_1.AppDataSource.getRepository(Student_1.Student);
                let studentTarget = yield studentRequest.findOneBy({ studentEmail: email });
                studentTarget.hashedOTP = hashOTP;
                studentTarget.studentHashedPassword = hashPassword;
                yield studentRequest.save(studentTarget);
                //Use Google Access Token to send email
                const myAccessTokenObject = yield myOAuth2Client.getAccessToken();
                const myAccessToken = myAccessTokenObject === null || myAccessTokenObject === void 0 ? void 0 : myAccessTokenObject.token;
                const transport = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.GOOGLE_EMAIL_ADDRESS,
                        clientId: process.env.GOOGLE_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
                        accessToken: myAccessToken
                    }
                });
                //Mail information
                const mailOptions = {
                    to: email,
                    subject: "Attendance System Registration",
                    html: `<h3>${OTP}</h3>`
                };
                //Send email
                yield transport.sendMail(mailOptions);
                res.status(200).json({ message: 'OTP has been sent to your email' });
            }
            catch (_a) {
                res.status(500).json({ message: 'OTP failed' });
            }
        });
        this.verifyRegister = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //Get information (email, OTP)
            const email = req.body.email;
            const OTP = req.body.OTP;
            //Verify OTP
            let studentRequest = db_config_1.AppDataSource.getRepository(Student_1.Student);
            let studentTarget = yield studentRequest.findOneBy({ studentEmail: email });
            let hashOTP = studentTarget.hashedOTP;
            let result = yield bcrypt_1.default.compare(OTP, hashOTP);
            res.json(result);
        });
        this.test = (req, res) => {
            res.json("hello");
        };
    }
}
exports.default = new StudentController();
