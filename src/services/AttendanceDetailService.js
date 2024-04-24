import { StudentClass } from "../models/StudentClass";
import { AttendanceForm } from "../models/AttendanceForm";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { AppDataSource } from "../config/db.config";
import { Report } from "../models/Report";
import { EditionHistory } from "../models/EditionHistory";
import { JSDatetimeToMySQLDatetime } from "../utils/TimeConvert";
import { Feedback } from "../models/Feedback";
import { Classes } from "../models/Classes";
import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";
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
            attendanceDetail.createdAt = attendanceForm.dateOpen;

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
            leftJoinAndMapOne("attendancedetail.feedback", Feedback, "feedback",
            'report.reportID = feedback.reportID').
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

    //oke
    getOfflineAttendanceDetailByClassID = async (studentID, classID) => {
        try{
            //
            let result = await attendanceDetailRepository.createQueryBuilder("attendancedetail"). 
            innerJoinAndMapOne("attendancedetail.attendanceForm", AttendanceForm, 'attendanceform', 'attendancedetail.formID = attendanceform.formID').
            leftJoinAndMapOne("attendancedetail.report", Report, 'report',
            'report.studentID = attendancedetail.studentID AND report.classID = attendancedetail.classID AND report.formID = attendancedetail.formID').
            leftJoinAndMapOne("attendancedetail.feedback", Feedback, "feedback",
            'report.reportID = feedback.reportID').
            where("attendancedetail.studentID = :studentid", {studentid: studentID}).
            andWhere("attendancedetail.classID = :classid", {classid: classID}).
            andWhere("attendancedetail.offline = :offline", {offline: true}).
            orderBy('attendancedetail.createdAt', 'DESC').
            getMany();

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

    //test must
    editAttendanceDetail = async (attendanceDetail, note, confirmStatus, topic) => {
        try {
            let result = this.resultBasedOnConfirmStatus(confirmStatus);
            let date = JSDatetimeToMySQLDatetime(new Date());
            attendanceDetail.result = result;
            attendanceDetail.note = note;
            attendanceDetail.location = "Ton Duc Thang University";
            attendanceDetail.dateAttendanced = date;
            let editionHistory = new EditionHistory();
            editionHistory.attendanceDetail = attendanceDetail;
            editionHistory.confirmStatus = confirmStatus;
            editionHistory.createdAt = date;
            editionHistory.message = note;
            editionHistory.topic = topic;

            await AppDataSource.transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.update(AttendanceDetail, {
                    studentDetail: attendanceDetail.studentDetail,
                    classDetail: attendanceDetail.classDetail,
                    attendanceForm: attendanceDetail.attendanceForm
                }, {
                    result: result,
                    note: note,
                    dateAttendanced: date,
                    location: "Ton Duc Thang University"
                });
                await transactionalEntityManager.insert(EditionHistory, editionHistory);
            })

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    resultBasedOnConfirmStatus = (confirmStatus) => {
        if (confirmStatus == "Present"){
            return 1;
        }
        if (confirmStatus == "Late"){
            return 0.5;
        }
        return 0;
    }

    //must test
    getAttendanceDetailsByStudentID = async (studentID) => {
        try {
            let data = await attendanceDetailRepository.createQueryBuilder("attendancedetail").
            innerJoin(Classes, "classes", "attendancedetail.classID = classes.classID").
            innerJoinAndMapOne("attendancedetail.form", AttendanceForm, "form", "attendancedetail.formID = form.formID").
            innerJoinAndMapOne("attendancedetail.course", Course, "course", "course.courseID = classes.courseID"). 
            innerJoinAndMapOne("attendancedetail.teacher", Teacher, "teacher", "teacher.teacherID = classes.teacherID").
            where("attendancedetail.studentID = :id", {id: studentID}).
            getMany();
            return {data, error: null};
        } catch (e) {
            return {data: [], error: "Failed getting attendance details"}
        }
    }

    //must test
    seenAttendanceDetail = async (studentID, classID, formID) => {
        try {
            await attendanceDetailRepository.update({
                studentDetail: studentID,
                classDetail: classID,
                attendanceForm: formID
            }, {
                seen: true
            })
            return true;
        } catch (e) {
            return false;
        }
    }
}

export default new AttendanceDetailService();