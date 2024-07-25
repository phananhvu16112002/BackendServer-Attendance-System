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

    transformStudentClassDTO = (data) => {
        return {
            studentID: data.studentID,
            total: data.Total,
            totalPresence: data.TotalPresence,
            totalAbsence: data.TotalAbsence,
            totalLate: data.TotalLate,
            attendanceDetails: []
        }
    }

    transformAttendanceDetailDTO = (data) => {
        return {
            formID: data.formID,
            dateAttendanced: data.dateAttendanced,
            location: data.location,
            note: data.note,
            latitude: data.latitude,
            longitude: data.longitude,
            result: data.result,
            url: data.url
        }
    }

    listOfStudentsWithAttendanceDetails = (data) => {
        let list = [];
        let temp;

        for (let i = 0; i < data.length; i++){
            if (list.length == 0){
                temp = transformStudentClassDTO(data[i]);
                temp.attendanceDetails.push(transformAttendanceDetailDTO(data[i]));
                list.push(temp);
            } else if (temp.studentID == data[i].studentID){
                temp.attendanceDetails.push(transformAttendanceDetailDTO(data[i]))
            } else {
                temp = transformStudentClassDTO(data[i]);
                temp.attendanceDetails.push(transformAttendanceDetailDTO(data[i]));
                list.push(temp);
            }
        }

        return list;
    }

    //oke
    transformStudentClassesDTO = (studentClassList) => {
        for (let i = 0; i < studentClassList.length; i++){
            let studentClass = studentClassList[i];
            studentClass.total = parseInt(studentClass.total);
            studentClass.totalPresence = parseInt(studentClass.totalPresence);
            studentClass.totalAbsence = parseInt(studentClass.totalAbsence);
            studentClass.totalLate = parseInt(studentClass.totalLate);
            studentClass.totalWeeks = parseInt(studentClass.totalWeeks);
            studentClass.requiredWeeks = (20/100)*studentClass.totalWeeks;
            let progress = studentClass.total / studentClass.totalWeeks;
            studentClass.progress = progress;     
        }
    }
}

export default new StudentClassDTO();