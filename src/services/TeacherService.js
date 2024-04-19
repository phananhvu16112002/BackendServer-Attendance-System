import { AppDataSource } from "../config/db.config";
import { Teacher } from "../models/Teacher";
import bcrypt from "bcrypt";
import { MySQLDatetimeToJSDatetime } from "../utils/TimeConvert";
import { JSDatetimeToMySQLDatetime } from "../utils/TimeConvert";

const teacherRepository = AppDataSource.getRepository(Teacher);

class TeacherService {
    checkTeacherExist = async (teacherID) => {
        try {
            let teacher = await teacherRepository.findOneBy({teacherID: teacherID});
            return teacher;
        } catch (e) {
            return null;
        }
    }

    updateTeacherPasswordAndOTP = async (teacher, hashedPassword, OTP) => {
        try {
            let currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 1);
            teacher.teacherHashedPassword = hashedPassword;
            teacher.hashedOTP = OTP;
            teacher.timeToLiveOTP = JSDatetimeToMySQLDatetime(currentDate);
            await teacherRepository.save(teacher);
        } catch (e) {
            return null;
        }
    } 

    checkTeacherOTPRegister = async (email, OTP) => {
        try {   
            let username = email.split('@')[0];
            let teacher = await teacherRepository.findOneBy({teacherID: username});
            let hashedOTP = teacher.hashedOTP;

            let result = await bcrypt.compare(OTP, hashedOTP);
            if (result == false){
                return false;
            }
            if (this.checkTeacherOTPExpired(teacher) == false){
                return false;
            }
            teacher.active = true;
            await teacherRepository.save(teacher);
            return true;
        } catch (e) {
            return false;
        }
    }

    login = async (teacher, email, password) => {
        try {
            let result = await bcrypt.compare(password, teacher.teacherHashedPassword);
            if (email.toLowerCase() == teacher.teacherEmail.toLowerCase() && result == true){
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    updateTeacherAccessTokenAndRefreshToken = async (teacher, accessToken, refreshToken) => {
        try {
            teacher.accessToken = accessToken;
            teacher.refreshToken = refreshToken;
            await teacherRepository.save(teacher);
        } catch (e) {
            //logging error message
        }
    }

    updateTeacherOTP = async (teacher, OTP) => {
        try{
            let currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 1);

            teacher.hashedOTP = OTP;
            teacher.timeToLiveOTP = JSDatetimeToMySQLDatetime(currentDate);
            await teacherRepository.save(teacher);
        } catch(e){

        }
    }

    checkTeacherOTPExpired = (teacher) => {
        try{
            return MySQLDatetimeToJSDatetime(teacher.timeToLiveOTP) > JSDatetimeToMySQLDatetime(new Date());
        } catch(e){
            return false;
        }
    }

    checkTeacherOTPReset = async (teacher, OTP) => {
        try{
            return await bcrypt.compare(OTP, teacher.hashedOTP);
        } catch(e){
            return false;
        }
    }

    updateTeacherResetToken= async (teacher, resetToken) => {
        teacher.resetToken = resetToken;
        await teacherRepository.save(teacher);
    }

    updateTeacherPassword = async (teacher, password) => {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        teacher.hashedOTP = "";
        teacher.resetToken = "";
        teacher.studentHashedPassword = hashPassword;
        await teacherRepository.save(teacher);
    }

    getClassesByTeacherID = async (teacherID) => {
        try {
            const classes = await teacherRepository.findOne(
                {
                    where : {
                        teacherID : teacherID
                    },
                    select : {
                        teacherEmail : false,
                        teacherHashedPassword : false, 
                        teacherID : false, 
                        teacherName : false,
                        active : false,
                        timeToLiveOTP : false, 
                        hashedOTP : false, 
                        accessToken : false, 
                        refreshToken : false,
                        classes : true,
                    },
                    relations : {
                        classes : true
                    }
                }
            )
    
            return classes
        } catch (e) {
            return null;
        }
    }

    //oke
    loadTeachersToDatabase = async (teacherList) => {
        try {
            let data = await teacherRepository.insert(teacherList);
            return {data: data, error: null}
        } catch (e) {
            return {data: null, error: e.message}
        }
    }

    //testable
    getTeachers = async () => {
        try {
            let data = await teacherRepository.find({
                select: {
                    teacherID: true,
                    teacherEmail: true,
                    teacherName: true
                }
            })
            return {data: data, error: null}
        } catch (e) {
            return {data: [], error: "Failed getting teachers"};
        }
    }

    //testable
    postTeacher = async (teacherID, teacherName, teacherEmail) => {
        try {
            let teacher = new Teacher();
            teacher.teacherID = teacherID;
            teacher.teacherName = teacherName;
            teacher.teacherEmail = teacherEmail;
            let data = await teacherRepository.insert(teacher);
            let result = await teacherRepository.findOne({
                where: {
                    teacherID: teacherID
                }
            });
            return {data: result, error: null};
        } catch (e) {
            return {data: null, error: e.message};
        }
    }

    //must test
    editTeacher = async (teacherID, teacherName) => {
        try {
            let data = await teacherRepository.update({teacherID: teacherID}, {teacherName: teacherName});
            return true;
        } catch(e) {
            return false;
        }
    }

    //must test
    deleteTeacher = async (teacherID) => {
        try {
            await teacherRepository.delete({teacherID: teacherID});
            return true;
        } catch (e) {
            return false;
        }
    }

    //must test
    searchTeacher = async (teacherID) => {
        try {
            let data = await teacherRepository.findOne({where: {teacherID: teacherID}});
            return {data: data, error: null};
        } catch (e) {
            return {data: null, error: "Failed getting teacher"};
        }
    }
}

export default new TeacherService();