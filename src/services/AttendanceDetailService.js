import { StudentClass } from "../models/StudentClass";
import { AttendanceForm } from "../models/AttendanceForm";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { AppDataSource } from "../config/db.config";
import { Report } from "../models/Report";
import { EditionHistory } from "../models/EditionHistory";
const studentClassRepository = AppDataSource.getRepository(StudentClass);
const attendanceFormRepository = AppDataSource.getRepository(AttendanceForm);
const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);

class AttendanceDetailService {
    //Oke
    createDefaultAttendanceDetailEntitiesForStudents = (listOfStudentClass, attendanceForm) => {
        console.log(listOfStudentClass);
        let listOfAttendanceDetail = []
        for (let i = 0; i < listOfStudentClass.length; i++){
            let studentClass = listOfStudentClass[i]
            let attendanceDetail = new AttendanceDetail();

            attendanceDetail.studentClass = studentClass;
            attendanceDetail.attendanceForm = attendanceForm;
            attendanceDetail.createdAt = attendanceForm.dateOpened;

            listOfAttendanceDetail.push(attendanceDetail);
        }

        return listOfAttendanceDetail;
    }

    createAttendanceDetail = async (studentClass, attendanceForm, location) => {
        let attendanceDetail = new AttendanceDetail();
        attendanceDetail.studentClass = studentClass;
        attendanceDetail.attendanceForm = attendanceForm;
        attendanceDetail.location = location;
        await attendanceDetailRepository.save(attendanceDetail);
        return attendanceDetail;
    }

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

    //oke
    getAttendanceDetailByClassID = async (studentID, classID) => {
        try{
            //
            let result = await attendanceDetailRepository.createQueryBuilder("attendancedetail"). 
            innerJoinAndMapOne("attendancedetail.attendanceForm", AttendanceForm, 'attendanceform', 'attendancedetail.formID = attendanceform.formID').
            leftJoinAndMapOne("attendancedetail.report", Report, 'report',
            'report.studentID = attendancedetail.studentID AND report.classID = attendancedetail.classID AND report.formID = attendancedetail.formID').
            where("attendancedetail.studentID = :studentid", {studentid: studentID}).
            andWhere("attendancedetail.classID = :classid", {classid: classID}).
            orderBy('attendancedetail.createdAt', 'DESC').
            getMany();

            // let data = await attendanceDetailRepository.find({where: {
            //     studentDetail : studentID,
            //     classDetail: classID,
            // },
            // select: {
            //     result: true,
            //     dateAttendanced: true,
            //     location: true, 
            //     note: true,
            //     latitude: true,
            //     longitude: true,
            //     url: true,
            //     attendanceForm: {
            //         formID: true,
            //         status: true,
            //         type: true,
            //         status: true,
            //         startTime: true,
            //         endTime: true,
            //         dateOpen: true,
            //         classes: {
            //             roomNumber: true,
            //             shiftNumber: true,
            //             startTime: true,
            //             endTime: true,
            //             classType: true,
            //             group: true,
            //             subGroup: true,
            //             course: {
            //                 courseID: true,
            //                 courseName: true
            //             }
            //         }
            //     },
            // },
            // relations : {
            //     attendanceForm: {
            //         classes: {
            //             course : true
            //         }
            //     }
            // }
            // });

        return {data: result, error: null};
        
        } catch (e) {
            console.log(e);
            return {data: [], error: "Failed fetching data"};
        }
    }

    // takeAttendance = async () => {

    // }

    getAttendanceDetailsByClassIDAndFormID = async (classID, formID) => {
        
    }

    //testable
    getAttendanceDetailByStudentIDClassIDFormID = async (studentID, classID, formID) => {
        try {
            let data = await attendanceDetailRepository.createQueryBuilder("attendancedetail").
            leftJoinAndMapMany("attendancedetail.histories", EditionHistory, 'history', 
            'attendancedetail.studentID = history.studentID AND attendancedetail.classID = history.classID AND attendancedetail.formID = history.formID').
            leftJoinAndMapOne('attendancedetail.report', Report, 'report', 
            'attendancedetail.studentID = report.studentID AND attendancedetail.classID = report.classID AND attendancedetail.formID = report.formID AND report.new = 1').
            where('attendancedetail.studentID = :studentid', {studentid: studentID}).
            andWhere('attendancedetail.classID = :classid', {classid: classID}).
            andWhere('attendancedetail.formID = :formid', {formid: formID}).
            getOne();

            return {data, error: null};
        } catch (e) {
            console.log(e);
            return {data: null, error: "Failed fetching data"};
        }
    }

    checkAttendanceDetailExist = async (studentID, classID, formID) => {
        try{
            let data = await attendanceDetailRepository.findOne({
                where: {
                    studentDetail: studentID, 
                    classDetail: classID, 
                    attendanceForm: formID
                }
            });
            return {data, error: null};
        } catch (e) {
            console.log(e);
            return {data: null, error: "Failed fetching data"};
        }
    }
}

export default new AttendanceDetailService();