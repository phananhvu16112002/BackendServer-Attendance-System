import 'dotenv/config';
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import {Student} from "../models/Student";
import { AppDataSource } from '../config/db.config';
import jwt from "jsonwebtoken";
import JSDatetimeToMySQLDatetime from '../utils/TimeConvert';

const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
)

myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

class StudentController{
    register = async (req,res) => {
        try{
            // Get information (email, username, password) from request
            const email = req.body.email;
            const password = req.body.password;
            const username = req.body.username;

            //Check information
            let studentRequest = AppDataSource.getRepository(Student);
            let studentCheck = await studentRequest.findOneBy({ studentEmail: email})
            if (studentCheck == null){
                return res.status(500).json({message: "Username must be your student's id"})
            } else if (studentCheck.active){
                return res.status(500).json({ message: "Account's already been activated" })
            }
            
            //Create OTP and hash OTP, password
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false});
            const salt = await bcrypt.genSalt(10)
            const hashOTP = await bcrypt.hash(OTP, salt)
            const hashPassword = await bcrypt.hash(password, salt)

            //Insert into database password and OTP
            let studentTarget = await studentRequest.findOneBy({studentEmail: email})
            studentTarget.hashedOTP = hashOTP
            studentTarget.studentHashedPassword = hashPassword
            await studentRequest.save(studentTarget);

            //Use Google Access Token to send email
            const myAccessTokenObject = await myOAuth2Client.getAccessToken()
            const myAccessToken = myAccessTokenObject?.token
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.GOOGLE_EMAIL_ADDRESS,
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
                    accessToken: myAccessToken
                }
            })
    
            //Mail information
            const mailOptions = {
                to: email,
                subject: "Attendance System Registration",
                html: `<h3>${OTP}</h3>`
            }
    
            //Send email
            await transport.sendMail(mailOptions)
            res.status(200).json({ message: 'OTP has been sent to your email' })
        }catch{
            res.status(500).json({ message: 'OTP failed' })
        }
    }

    verifyRegister = async (req,res) => {
        try{
            //Get information (email, OTP)
            const email = req.body.email;
            const OTP = req.body.OTP;

            //Verify OTP
            let studentRequest = AppDataSource.getRepository(Student);
            let studentTarget = await studentRequest.findOneBy({studentEmail: email})
            let hashOTP = studentTarget.hashedOTP;
            let result = await bcrypt.compare(OTP, hashOTP);
            if (result){
                studentTarget.active = true
                studentRequest.save(studentTarget)
                res.status(200).json({ message: 'OTP is valid' })
            }else{
                res.status(402).json({ message: 'OTP is not valid' })
            }
        }catch{
            res.status(500).json({ message: 'OTP is not valid' })
        }
    }

    login = async (req,res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            let studentRequest = AppDataSource.getRepository(Student);
            let studentTarget = await studentRequest.findOneBy({studentEmail: email, active: true})
            //Account has not been activated
            if (studentTarget == null){
                res.status(401).json({message:"Account has not been activated yet. Please register"});
            }

            let result = await bcrypt.compare(password,studentTarget.studentHashedPassword)
            if (email === studentTarget.studentEmail &&  result == true){
                const accessToken = jwt.sign({studentID: studentTarget.studentID}, process.env.STUDENT_ACCESS_TOKEN_SECRET,{ expiresIn: '1h' })
                const refreshToken = jwt.sign({studentID: studentTarget.studentID}, process.env.STUDENT_REFRESH_TOKEN_SECRET,{ expiresIn: '1y' })
                studentTarget.accessToken = accessToken;
                studentTarget.refreshToken = refreshToken;
                await studentRequest.save(studentTarget);
                res.status(200).json({message:"Login Successfully", refreshToken: refreshToken, accessToken: accessToken});
            }else {
                res.status(401).json({message:"Email or password incorrect"});
            }
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    forgotPassword = async (req, res) => {
        try {
            const email = req.body.email;
            const studentRequest = AppDataSource.getRepository(Student);
            const studentCheck = await studentRequest.findOneBy({ studentEmail: email, active: true });
    
            if (!studentCheck) {
                return res.status(400).json({ message: "Invalid email address or is not active" });
            }
    
            if (studentCheck.active) {
                const myAccessTokenObject = await myOAuth2Client.getAccessToken()
                const myAccessToken = myAccessTokenObject?.token
    
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.GOOGLE_EMAIL_ADDRESS,
                        clientId: process.env.GOOGLE_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
                        accessToken: myAccessToken
                    }
                })
    
                const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                const salt = await bcrypt.genSalt(10)
                const hashOTP = await bcrypt.hash(OTP, salt)
    
                let studentTarget = await studentRequest.findOneBy({ studentEmail: email, active: studentCheck.active });
                studentTarget.hashedOTP = hashOTP;
                let date = new Date();
                date.setMinutes(date.getMinutes() + 1)
                studentTarget.timeToLiveOTP = JSDatetimeToMySQLDatetime(date);
                await studentRequest.save(studentTarget);
    
                const mailOptions = {
                    to: email,
                    subject: "OTP Forgot Password",
                    html: `<h3>${OTP}</h3>`
                }
    
                await transport.sendMail(mailOptions);
                
                res.status(200).json({ message: 'OTP has been sent to your email' });
            } else {
                res.status(400).json({ message: 'User is not active' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    verifyForgotPassword = async (req,res) => {
        try {
            //Get Information User and OTP
            const email = req.body.email;
            const OTP = req.body.OTP;
            //Verify OTP
            let studentRequest = AppDataSource.getRepository(Student);
            let studentTarget = await studentRequest.findOneBy({studentEmail: email, active: true});
            let hashOTP = studentTarget.hashedOTP;
            let timeConvert = new Date(studentTarget.timeToLiveOTP);
            let timeUse = JSDatetimeToMySQLDatetime(timeConvert);
            let checkTimeLive = timeUse < JSDatetimeToMySQLDatetime(new Date()); // 16:43 16:47
            console.log("Time Orginal: " +timeConvert);
            console.log("Time Use from DB:" +timeUse);
            console.log("Time now: " +JSDatetimeToMySQLDatetime(new Date()));
            console.log("Result " +checkTimeLive);
            if (checkTimeLive){
                return res.status(400).json({message: "OTP expired"});
            }
            else {
                let result = await bcrypt.compare(OTP, hashOTP);
                if(result){
                    const resetToken = jwt.sign({email: email}, process.env.STUDENT_RESET_TOKEN_SECRET, {expiresIn: '1h'});
                    studentTarget.resetToken = resetToken;
                    await studentRequest.save(studentTarget);
                    res.status(200).json({message:"OTP is valid", resetToken: studentTarget.resetToken});
                }
                else {
                    res.status(400).json({message:"OTP is not valid"});
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    resetPassword = async (req, res) => {
        try {
            console.log("--------------------------------------");
            console.log("Reset Password");
            // Get Information User
            const email = req.body.email;
            const newPassword = req.body.newPassword;
    
            // Get User in DB
            let studentRequest = AppDataSource.getRepository(Student);
            let studentTarget = await studentRequest.findOneBy({ studentEmail: email, active: true });
            // Compare old password with new password
            const result = await bcrypt.compare(newPassword, studentTarget.studentHashedPassword);
            if (result) {
                res.status(400).json({ message: "Password don't change" });
            } else {
                // Hash the new password and save it to the database
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(newPassword, salt);
                studentTarget.hashedOTP = ""; 
                studentTarget.resetToken = "";
                studentTarget.studentHashedPassword = hashPassword; 
                await studentRequest.save(studentTarget);
                res.status(200).json({ message: "Reset Password successfully" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };
    resendOTP = async (req,res) => {
        try {
            const email = req.body.email;
            let studentRequest = AppDataSource.getRepository(Student);
            let studentTarget = await studentRequest.findOneBy({studentEmail: email, active:true});
            if (studentTarget.active){
                const myAccessTokenObject = await myOAuth2Client.getAccessToken()
                const myAccessToken = myAccessTokenObject?.token
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.GOOGLE_EMAIL_ADDRESS,
                        clientId: process.env.GOOGLE_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
                        accessToken: myAccessToken
                    }
            })
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const salt = await bcrypt.genSalt(10)
            const hashOTP = await bcrypt.hash(OTP, salt)
            let date = new Date();
            date.setMinutes(date.getMinutes() + 1)
            studentTarget.timeToLiveOTP = JSDatetimeToMySQLDatetime(date);
            studentTarget.hashedOTP = hashOTP;
            await studentRequest.save(studentTarget);
            const mailOptions = {
                to: email,
                subject: "OTP Forgot Password",
                html: `<h3>${OTP}</h3>`
            }
            await transport.sendMail(mailOptions);
            res.status(200).json({ message: 'OTP has been sent to your email' });
        }else{
            res.status(400).json({message:"Failed to send OTP"});
        }
        }catch(error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new StudentController();