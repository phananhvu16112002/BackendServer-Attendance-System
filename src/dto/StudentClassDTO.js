import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";

const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);
class StudentClassDTO {
    injectTotalDetails = async (studentClasses) => {
        try {
            for (let i in studentClasses){

                const total = await attendanceDetailRepository.countBy({
                    studentDetail : studentClasses[i].studentDetail.studentID,
                    classDetail: studentClasses[i].classDetail.classID,
                });
    
                let totalPresence = 0;
                let totalLate = 0;
                let totalAbsence = 0;
    
                await AppDataSource.transaction(async (transactionalEntityManager) => {
                    totalPresence = await attendanceDetailRepository.countBy({
                        studentDetail : studentClasses[i].studentDetail.studentID,
                        classDetail: studentClasses[i].classDetail.classID,
                        result : 1
                    });
    
                    totalLate = await attendanceDetailRepository.countBy({
                        studentDetail : studentClasses[i].studentDetail.studentID,
                        classDetail: studentClasses[i].classDetail.classID,
                        result : 0.5
                    });
    
                    totalAbsence = await attendanceDetailRepository.countBy({
                        studentDetail : studentClasses[i].studentDetail.studentID,
                        classDetail: studentClasses[i].classDetail.classID,
                        result : 0
                    });
    
                })
    
                const progress = (total / studentClasses[i].classDetail.course.totalWeeks);
                
                studentClasses[i].progress = progress;
                studentClasses[i].total = total;
                studentClasses[i].totalPresence = totalPresence; 
                studentClasses[i].totalAbsence = totalAbsence;
                studentClasses[i].totalLate = totalLate;
            }
    
            return studentClasses;

        } catch (e) {
            return null;
        }
    }
}

export default new StudentClassDTO();