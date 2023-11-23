import 'dotenv/config';
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import {Student} from "../models/Student";
import { AppDataSource } from '../config/db.config';
import jwt from "jsonwebtoken";


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
            console.log(email)
            console.log(password)
            console.log(username)
            //Check information
            let studentRequest = AppDataSource.getRepository(Student);
            let studentCheck = await studentRequest.findOneBy({studentEmail: email})

            if (studentCheck == null){
                return res.status(500).json({message: "Username must be your student's id"})
            }
            else if (studentCheck.active){
                console.log('StudentCheck: ' +studentCheck);
                console.log("Student ACtive " +studentCheck.active);
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
                res.status(200).json({ message: 'OTP is valid' })
                studentTarget.active = true
                studentRequest.save(studentTarget)
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
            let studentTarget = await studentRequest.findOneBy({studentEmail: email})
            let result = await bcrypt.compare(password,studentTarget.studentHashedPassword)
            // console.log("Input Email:" +email);
            // console.log("Input Password: " +password);
            // console.log("Data Email: "+ studentTarget.studentEmail)
            // console.log("Data Password: "+ studentTarget.studentHashedPassword)
            // console.log("result check:" + result);
            if (email === studentTarget.studentEmail &&  result == true){
                const token = jwt.sign({email: studentTarget.studentEmail}, process.env.SECRETKEY,{ expiresIn: '1h' })
                studentTarget.accessToken = token;
                await studentRequest.save(studentTarget)
                res.status(200).json({message:"Login Successfully", token});
            }
            else {
                res.status(401).json({message:"Email or password incorrect"});
            }
        }catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}

export default new StudentController();

