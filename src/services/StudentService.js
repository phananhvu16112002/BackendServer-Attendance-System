import bcrypt from "bcrypt";
import { JSDatetimeToMySQLDatetime } from "../utils/TimeConvert";
import { MySQLDatetimeToJSDatetime } from "../utils/TimeConvert";
import { AppDataSource } from "../config/db.config";
import { Student } from "../models/Student";

const studentRepository = AppDataSource.getRepository(Student);

class StudentService {
    checkStudentExist = async (studentID) => {
        try {
            let student = await studentRepository.findOneBy({studentID: studentID});
            return student;
        } catch (e) {
            //logging error message
            return null;
        }
    } 

    checkStudentStatus = (student) => {
        return student.active;
    }

    updateStudentPasswordAndOTP = async (student, hashedPassword, OTP) => {
        try {
            student.studentHashedPassword = hashedPassword;
            student.hashedOTP = OTP;
            await studentRepository.save(student);
        } catch (e) {
            //logging error message
            return null
        }
    }

    checkStudentOTPRegister = async (email, OTP) => {
        try {
            let username = email.split('@')[0];
            let student = await studentRepository.findOneBy({studentID: username});
            let hashedOTP = student.hashedOTP;

            let result = await bcrypt.compare(OTP, hashedOTP);

            if (result == false){
                return false;
            }

            student.active = true;
            await studentRepository.save(student);
            return true;
        } catch (e) {
            //logging error message
            return false;
        }
    }

    checkUsernameAndEmailMatch = (username, email) => {
        return username == email.split('@')[0];
    }

    transformEmailToID = (email) => {
        return email.split('@')[0];
    }

    login = async (student, email, password) => {
        try {
            let result = await bcrypt.compare(password, student.studentHashedPassword);
            if (email.toLowerCase() == student.studentEmail.toLowerCase() && result == true){
                return true;
            }
            return false;
        } catch (e) {
            //logging error message
            return false;
        }
    }

    updateStudentAccessTokenAndRefreshToken = async (student, accessToken, refreshToken) => {
        try {
            student.accessToken = accessToken;
            student.refreshToken = refreshToken;
            await studentRepository.save(student);
        } catch (e) {
            //logging error message
        }
    }

    updateStudentOTP = async (student, OTP) => {
        try {
            let currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 1);

            student.hashedOTP = OTP;
            student.timeToLiveOTP = JSDatetimeToMySQLDatetime(currentDate);
            await studentRepository.save(student);

        } catch (e) {
            //logging error message
        }
    }

    checkStudentOTPExpired = (student) => {
        try {
            // let timeToLiveOTPConvert = new Date(student.timeToLiveOTP);
            // let timeToLiveOTPUse = JSDatetimeToMySQLDatetime(timeToLiveOTPConvert);

            return MySQLDatetimeToJSDatetime(student.timeToLiveOTP) < JSDatetimeToMySQLDatetime(new Date());
        } catch (e) {
            return false;
        }
    }

    checkStudentOTPReset = async (student, OTP) => {
        try {
            return await bcrypt.compare(OTP, student.hashedOTP);
        } catch (e) {
            return false;
        }
    }

    updateStudentResetToken = async (student, resetToken) => {
        student.resetToken = resetToken;
        await studentRepository.save(student);
    }

    updateStudentPassword = async (student, password) => {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        student.hashedOTP = "";
        student.resetToken = "";
        student.studentHashedPassword = hashPassword;
        await studentRepository.save(student);
    }
}

export default new StudentService();