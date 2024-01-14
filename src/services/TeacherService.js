import { AppDataSource } from "../config/db.config";
import { Teacher } from "../models/Teacher";

const teacherRepository = AppDataSource.getRepository(Teacher);

class TeacherService {
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
}

export default new TeacherService();