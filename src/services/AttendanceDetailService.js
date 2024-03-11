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
                    attendanceForm : formID 
                },
                relations : {
                    attendanceForm : true
                }
            })
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    getAttendanceDetailByClassID = async (studentID, classID) => {
        try{
            return await attendanceDetailRepository.find({where: {
                studentDetail : studentID,
                classDetail: classID,
            },
            select: {
                result: true,
                dateAttendanced: true,
                location: true, 
                note: true,
                latitude: true,
                longitude: true,
                url: true,
                attendanceForm: {
                    formID: true,
                    status: true,
                    type: true,
                    status: true,
                    startTime: true,
                    endTime: true,
                    classes: {
                        roomNumber: true,
                        shiftNumber: true,
                        startTime: true,
                        endTime: true,
                        classType: true,
                        group: true,
                        subGroup: true,
                        course: {
                            courseID: true,
                            courseName: true
                        }
                    }
                },
            },
            relations : {
                attendanceForm: {
                    classes: {
                        course : true
                    }
                }
            }
        });
        
        } catch (e) {
            return null;
        }
    }

    // takeAttendance = async () => {

    // }

    //oke used in StudentClass controller
    
}

export default new AttendanceDetailService();