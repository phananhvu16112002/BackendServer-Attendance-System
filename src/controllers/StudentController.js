import 'dotenv/config';
import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import {Student} from "../models/Student";
import { AppDataSource } from '../config/db.config';
import jwt from "jsonwebtoken";
import {JSDatetimeToMySQLDatetime} from '../utils/TimeConvert';

//for face recognition
import fs from "fs/promises";
import * as tf from "@tensorflow/tfjs-node";
import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import { StudentClass } from '../models/StudentClass';
import { AttendanceForm } from '../models/AttendanceForm';
import { AttendanceDetail } from '../models/AttendanceDetail';

import StudentService from '../services/StudentService';
import EmailService from '../services/EmailService';
import FaceImageService from '../services/FaceImageService';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function LoadModels() {
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./premodels");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./premodels");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./premodels");
}

LoadModels();

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

            const student = await StudentService.checkStudentExist(username);
            if (student == null){
                return res.status(422).json({message: "Username must be your student's ID"})
            }

            if (StudentService.checkStudentStatus(student)){
                return res.status(422).json({ message: "Account's already been activated. Please login" })
            }

            //Create OTP and hash OTP, password
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false});
            const salt = await bcrypt.genSalt(10)
            const hashOTP = await bcrypt.hash(OTP, salt)
            const hashPassword = await bcrypt.hash(password, salt)

            //Use Google Access Token to send email
            if (await EmailService.sendEmail(email, OTP) == false){
                return res.status(503).json({ message: 'OTP failed' })
            }

            //Insert into database password and OTP
            await StudentService.updateStudentPasswordAndOTP(student, hashPassword, hashOTP);

            res.status(200).json({ message: 'OTP has been sent to your email' })
        }catch (e) {
            res.status(500).json({ message: e.message })
        }
    }

    verifyRegister = async (req,res) => {
        try{
            //Get information (email, OTP)
            const email = req.body.email;
            const OTP = req.body.OTP;

            //Verify OTP
            if (await StudentService.checkStudentOTPRegister(email, OTP) == false){
                return res.status(422).json({ message: 'OTP is not valid' });
            }

            res.status(200).json({ message: 'OTP is valid' })
        }catch{
            res.status(500).json({ message: 'OTP is not valid' })
        }
    }

    //must test
    loginWithCheckImage = async (req,res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const studentID = StudentService.transformEmailToID(email);
            const studentDeviceToken = req.body.deviceToken;

            let {data: student, error: errorStudent} = await StudentService.checkStudentExistWithImages(studentID);
            if (errorStudent){
                return res.status(503).json({message: errorStudent});
            }
            if (student == null){
                return res.status(422).json({message : "Account does not exist"});
            }
            if (StudentService.checkStudentStatus(student) == false){
                return res.status(422).json({message : "Account has not been activated yet. Please register!"});
            }
            if (await StudentService.login(student, email, password) == false){
                return res.status(422).json({message: "Email or password incorrect"});
            }

            let {data: required, error: err, message: message} = await FaceImageService.checkImagesValid(student.studentImage, student.timeToLiveImages);
            if (err){
                return res.status(503).json({message: err});
            }

            const accessToken = jwt.sign({userID: studentID, role: "student"}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1m' })
            const refreshToken = jwt.sign({userID: studentID, role: "student"}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '30m' })
            
            if (await StudentService.storeDeviceToken(studentDeviceToken) == false){
                return res.status(503).json({message: "Cannot store device token"});
            }
            
            return res.status(200).json({
                message:"Login Successfully",
                note: message, 
                refreshToken: refreshToken, 
                accessToken: accessToken,
                studentID: studentID,
                studentEmail: email,
                studentName: student.studentName,
                requiredImage: !required
            });

        } catch (e) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    login = async (req,res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const studentID = StudentService.transformEmailToID(email);

            let student = await StudentService.checkStudentExist(studentID);
            
            if (student == null){
                return res.status(422).json({message : "Account does not exist"});
            }

            if (StudentService.checkStudentStatus(student) == false){
                return res.status(422).json({message : "Account has not been activated yet. Please register!"});
            }
            
            if (await StudentService.login(student, email, password) == false){
                return res.status(422).json({message: "Email or password incorrect"});
            }

            const accessToken = jwt.sign({userID: studentID, role: "student"}, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1m' })
            const refreshToken = jwt.sign({userID: studentID, role: "student"}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '30m' })

            await StudentService.updateStudentAccessTokenAndRefreshToken(student, accessToken, refreshToken);
            res.status(200).json({
                message:"Login Successfully", 
                refreshToken: refreshToken, 
                accessToken: accessToken,
                studentID: studentID,
                studentEmail: email,
                studentName: student.studentName
            });
            
        }catch (e) {
            console.error(e);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    forgotPassword = async (req, res) => {
        try {
            const email = req.body.email;
            const studentID = StudentService.transformEmailToID(email);

            let student = await StudentService.checkStudentExist(studentID);

            if (student == null){
                return res.status(422).json({message: "Email address does not exist"});
            }

            if (StudentService.checkStudentStatus(student) == false){
                return res.status(422).json({message: "Account with this email address is not active"});
            }

            //Generate OTP
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const salt = await bcrypt.genSalt(10)
            const hashOTP = await bcrypt.hash(OTP, salt)

            //Send OTP
            if (await EmailService.sendEmail(email, OTP) == false){
                return res.status(503).json({ message: 'OTP failed' });
            }

            //Update OTP in database
            await StudentService.updateStudentOTP(student, hashOTP);
            res.status(200).json({ message: 'OTP has been sent to your email' });
            
        } catch (e) {
            console.error(error);
            res.status(500).json({ message: e.message });
        }
    }

    verifyForgotPassword = async (req,res) => {
        try {
            //Get Information User and OTP
            const email = req.body.email;
            const OTP = req.body.OTP;
            const studentID = StudentService.transformEmailToID(email);
            
            //Verify user input
            let student = await StudentService.checkStudentExist(studentID);
            if (student == null){
                return res.status(422).json({message: "Email address does not exist"});
            }
            if (StudentService.checkStudentStatus(student) == false){
                return res.status(422).json({message: "Account with this email address is not active"});
            }

            //Check OTP in database expired
            if (StudentService.checkStudentOTPExpired(student)){
                return res.status(422).json({message: "OTP expired"});
            }

            //Verify OTP
            if (await StudentService.checkStudentOTPReset(student, OTP) == false){
                return res.status(422).json({message:"OTP is not valid"});
            }

            const resetToken = jwt.sign({email: email}, process.env.RESET_TOKEN_SECRET, {expiresIn: '1m'});
            await StudentService.updateStudentResetToken(student, resetToken);
            res.status(200).json({message:"OTP is valid", resetToken: resetToken});
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
    resetPassword = async (req, res) => {
        try {
            // Get Information User
            const email = req.body.email;
            const newPassword = req.body.newPassword;
            const studentID = StudentService.transformEmailToID(email);

            //Check user input
            let student = await StudentService.checkStudentExist(studentID);
            if (student == null){
                return res.status(422).json({message: "Email address does not exist"});
            }
            if (StudentService.checkStudentStatus(student) == false){
                return res.status(422).json({message: "Account with this email address is not active"});
            }
            
            //Update password
            await StudentService.updateStudentPassword(student, newPassword);
            res.status(200).json({ message: "Reset Password successfully" });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    resendOTP = async (req,res) => {
        try {
            const email = req.body.email;
            const studentID = StudentService.transformEmailToID(email);

            //Check user input
            let student = await StudentService.checkStudentExist(studentID);
            if (student == null){
                return res.status(422).json({message: "Email address does not exist"});
            }
            if (StudentService.checkStudentStatus(student) == false){
                return res.status(422).json({message: "Account with this email address is not active"});
            }

            //Generate OTP
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const salt = await bcrypt.genSalt(10)
            const hashOTP = await bcrypt.hash(OTP, salt)

            //Send OTP
            if (await EmailService.sendEmail(email, OTP) == false){
                return res.status(503).json({ message: 'OTP failed' });
            }

            //Update OTP in database
            await StudentService.updateStudentOTP(student, hashOTP);
            res.status(200).json({ message: 'OTP has been sent to your email' });

        } catch(error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    resendOTPRegister = async (req,res) => {
        try {
            const email = req.body.email;
            const studentID = StudentService.transformEmailToID(email);

            //Check user input
            let student = await StudentService.checkStudentExist(studentID);
            if (student == null){
                return res.status(422).json({message: "Email address does not exist"});
            }
            
            //Generate OTP
            const OTP = otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            const salt = await bcrypt.genSalt(10)
            const hashOTP = await bcrypt.hash(OTP, salt)

            //Send OTP
            if (await EmailService.sendEmail(email, OTP) == false){
                return res.status(503).json({ message: 'OTP failed' });
            }

            //Update OTP in database
            await StudentService.updateStudentOTP(student, hashOTP);
            res.status(200).json({ message: 'OTP has been sent to your email' });

        } catch(error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    takeAttendance = async (req,res) => {
        const studentID = req.body.studentID;
        const classID = req.body.classID;
        const formID = req.body.formID;
        const image = req.files.file;

        //Get time now to process later
        let timeNow = JSDatetimeToMySQLDatetime(new Date());

        //check if there is a class that has this attendance form
        let attendanceForm = await AppDataSource.getRepository(AttendanceForm).findOneBy({formID: formID, classes: classID});
        if (attendanceForm == null){
            return res.status(403).json({message: "No classes found that has this attendance form"});
        }

        //check if student has registered the class or not
        let studentClass = await AppDataSource.getRepository(StudentClass).findOneBy({studentID: studentID, classesID: classID});
        if (studentClass == null){
            return res.status(403).json({message: "Student is not registered in this class"});
        }

        //check end time of the form
        let endTimeForm = JSDatetimeToMySQLDatetime(new Date(attendanceForm.endTime));
        if (timeNow > endTimeForm){
            return res.status(403).json({message: "The form has been closed"});
        }

        //check face recognition

        //convert the request image file to canvas 
        let canvasImg = await canvas.loadImage(image);

        //get face descriptions and resized
        let faceDescription = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
        faceDescription = faceapi.resizeResults(faceDescription, canvasImg);

        //pre train model
        const labels = ["1", "2", "3"];
        const labeledFaceDescriptors = await Promise.all(
            labels.map(async label => {
                
                const imgURL = `../../students/${studentID}/${label}.jpg`;
                const fileBuffer = await fs.readFile(imgURL);
                const canvasImg = await canvas.loadImage(fileBuffer);

                const faceDescription = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
                return new faceapi.LabeledFaceDescriptors(label, faceDescription);
            })
        )

        //Matching
        const threshold = 0.6;
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold);
        const results = faceMatcher.findBestMatch(faceDescription);

        //check result
        if (results.label == "unknown"){
            return res.status(403).json({message: "Your face does not match in the database"});
        }

        //Create attendance detail
        let attendanceDetail = new AttendanceDetail();
        attendanceDetail.present = true;
        attendanceDetail.studentDetail = studentClass;
        attendanceDetail.classes = studentClass;
        attendanceDetail.dateAttendanced = timeNow;
        
        await AppDataSource.getRepository(AttendanceDetail).save(attendanceDetail);
        return res.status(200).json({message: "Take attendance successfully"});
    }

    //oke
    sendImages = async (req,res) => {
        try {
            const studentID = req.payload.userID;
            if (req.files == null){
                console.log("Please send at least one image");
                return res.status(422).json({message: "Please send at least one image"})
            }
            let files = req.files.file;
            if (files == null){
                files = [];
            }
            if (!Array.isArray(files)){
                files = [files];
            }
            if (files.length != 3){
                console.log("Only three image files allowed");
                return res.status(422).json({message: "Only three image files allowed"}); 
            }

            let {data: student, error: errorStudent} = await StudentService.checkStudentExistWithImages(studentID);
            if (errorStudent){
                console.log(errorStudent);
                return res.status(503).json({message: errorStudent});
            }

            let {data: required, error: err, message: message} = await FaceImageService.checkImagesValid(student.studentImage, student.timeToLiveImages);
            if (err){
                console.log(err);
                return res.status(503).json({message: err});
            }
            if (required){
                console.log(required);
                return res.status(422).json({message: message});
            }

            let imageStudentList = await FaceImageService.imageStudentListFromImage(files);
            if (imageStudentList.length == 0){
                console.log("Failed to upload images. Please upload again");
                return res.status(503).json({message: "Failed to upload images. Please upload again"});
            }

            let {data: images, error: errorImages} = await FaceImageService.loadStudentImagesToDatabase(imageStudentList, student);
            if (errorImages){
                return res.status(503).json({message: errorImages});
            }
            return res.status(200).json(images);
        } catch (e) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    //oke
    getStudentsImagesByStudentID = async (req,res) => {
        try {
            let {data, error} = await StudentService.getStudentsImageByStudentID(req.payload.userID);
            if (error){
                return res.status(503).json({message: error});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export default new StudentController();