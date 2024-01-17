import { StudentClass } from "../models/StudentClass";
import { AttendanceForm } from "../models/AttendanceForm";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { AppDataSource } from "../config/db.config";

const studentClassRepository = AppDataSource.getRepository(StudentClass);
const attendanceFormRepository = AppDataSource.getRepository(AttendanceForm);
const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);

class AttendanceDetailService {
    createDefaultAttendanceDetailEntitiesForStudents = (listOfStudentClass, attendanceForm) => {
        console.log(listOfStudentClass);
        let listOfAttendanceDetail = []
        for (let i = 0; i < listOfStudentClass.length; i++){
            let studentClass = listOfStudentClass[i]
            let attendanceDetail = new AttendanceDetail();

            attendanceDetail.studentClass = studentClass;
            attendanceDetail.attendanceForm = attendanceForm;

            listOfAttendanceDetail.push(attendanceDetail);
        }

        return listOfAttendanceDetail;
        //attendanceDetailRepository.save(listOfAttendanceDetail);
    }

    // createAttendanceDetail = async (studentClass, attendanceForm, location) => {
    //     let attendanceDetail = new AttendanceDetail();
    //     attendanceDetail.studentClass = studentClass;
    //     attendanceDetail.attendanceForm = attendanceForm;
    //     attendanceDetail.location = location;
    //     await attendanceDetailRepository.save(attendanceDetail);
    //     return attendanceDetail;
    // }

    getAttendanceDetail = async (studentID, classID, formID) => {
        try {
            return await attendanceDetailRepository.findOne({
                where : {
                    studentDetail : studentID,
                    classDetail: classID,
                    formID : formID 
                },
                relations : {
                    attendanceForm : true
                }
            })
        } catch (e) {
            return null;
        }
    }

    // takeAttendance = async () => {

    // }
}

export default new AttendanceDetailService();