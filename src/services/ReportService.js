import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { AttendanceForm } from "../models/AttendanceForm";
import { Report } from "../models/Report";
import { StudentClass } from "../models/StudentClass";
import UploadImageService from "./UploadImageService";
import {JSDatetimeToMySQLDatetime} from '../utils/TimeConvert';
import { Feedback } from "../models/Feedback";
import { Classes } from "../models/Classes";
import { Teacher } from "../models/Teacher";
import { Course } from "../models/Course";
import { Student } from "../models/Student";
import { HistoryReport } from "../models/HistoryReport";
import { ReportImage } from "../models/ReportImage";

const reportRepository = AppDataSource.getRepository(Report);
const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);
const studentClassRepository = AppDataSource.getRepository(StudentClass);
const attendanceFormRepository = AppDataSource.getRepository(AttendanceForm);
const classesRepository = AppDataSource.getRepository(Classes);
const historyReportRepository = AppDataSource.getRepository(HistoryReport);

class ReportService {
    getInfoReportImage = (editedImage, imageReportList) => {
        let keepImageReportList = [];
        let editReportImageList = [];
        for (let i = 0; i < imageReportList.length; i++){
            if (editedImage.includes(imageReportList[i].imageID)){
                editReportImageList.push(imageReportList[i])
            }else {
                keepImageReportList.push(imageReportList[i])
            }
        }
        return {keep:keepImageReportList,edit: editReportImageList};
    }
    //oke
    getEditedReportImage = (editedImage) => {
        let editReportImageList = [];
        for (let i = 0; i < editedImage.length; i++){
            let editReportImage = new ReportImage();
            editReportImage.imageID = editedImage[i];
            editReportImage.imageURL = "https://i.imgur.com/" + editedImage[i] + ".png";
            editReportImageList.push(editReportImage);
        }
        return editReportImageList;
    }
    //oke
    getReportDetail = async (reportID) => {
        try {
            let data = await reportRepository.findOne({
                where: {reportID: reportID},
                relations: {
                    reportImage: true,
                    attendanceDetail: true,
                    feedback: true,
                }
            });
            return {data, error: null};
        } catch(e) {
            return {data: null, error: "Failed fetching report"};
        }
    }

    getReportByID = async (reportID) => {
        try {
            let data = await reportRepository.findOne({
                where: {reportID: reportID},
                relations: {
                    attendanceDetail: true,
                    feedback: true
                }
            });
            return {data, error: null};
        } catch (e) {
            return {data: null, error: "Failed fetching report"};
        }
    }

    //oke
    checkReportExist = async (attendanceDetail) => {
        try {
            let data = await reportRepository.findOne({
                where: {
                    attendanceDetail: attendanceDetail
                }
            })
            return {data: data, error: null};
        } catch (e) {
            return {data: null, error: "Failed fetching report"};
        }
    }

    //oke
    getReportWithRelation = async (reportID) => {
        try {
            let data = await reportRepository.findOne({
                where: {reportID: reportID},
                relations: {
                    attendanceDetail: true,
                    reportImage: true,
                    feedback: true
                }
            })
            return {data: data, error: null};
        } catch (e) {
            return {data: null, error: "Failed getting report"};
        }
    }

    //not oke
    createReport = async (message, studentID, classID, formID) => {
        let studentClass = await studentClassRepository.findOneBy({studentID: studentID, classID : classID});
        let attendanceForm = await attendanceFormRepository.findOneBy({formID: formID});

        if (studentClass == null || attendanceForm == null){
            return null;
        }

        let attendanceDetail = await attendanceDetailRepository.findOneBy({studentClass: studentClass, attendanceForm: attendanceForm});

        let report = new Report();
        report.message = message;
        report.attendanceDetail = attendanceDetail;
        await reportRepository.save(report);
        
        return report;
    }

    //oke testable
    reportObject = (data, topic, problem, message, imageReportList) => {
        let report = new Report();
        report.attendanceDetail = data;
        report.topic = topic;
        report.problem = problem;
        report.message = message;
        report.reportImage = imageReportList;
        report.status = "Pending";
        report.important = false;
        report.new = true;
        report.createdAt = JSDatetimeToMySQLDatetime(new Date());
        return report;
    }

    //oke testable, test it
    loadReportWithImages = async (data, topic, problem, message, imageReportList) => {
        try {
            let report = this.reportObject(data, topic, problem, message, imageReportList);
            let result = await reportRepository.save(report);
            return {data: result, error: null};
        } catch (e) {
            console.log(e);
            return {data: null, error: "Failed creating report"};
        }
    }

    //
    getAllReportsByStudentID = async (studentID) => {
        try{
            let data = await reportRepository.createQueryBuilder("report"). 
                innerJoinAndMapOne("report.classes", Classes, "classes", 'report.classID = classes.classID').
                innerJoinAndMapOne("report.teacher", Teacher, "teacher", 'classes.teacherID = teacher.teacherID'). 
                innerJoinAndMapOne("report.course", Course, "course", "classes.courseID = classes.courseID").
                leftJoinAndMapOne("report.feedback", Feedback, "feedback", "report.reportID = feedback.reportID").
                select('report.*').addSelect('classes').addSelect('course').addSelect('teacher.teacherID, teacher.teacherEmail ,teacher.teacherName').addSelect("feedback").
                orderBy("report.createdAt", "DESC").
                where("report.studentID = :id", {id: studentID}).getRawMany();
            return {data: data, error: null};
        } catch (e) {
            console.log(e);
            return {data: [], error: "Failed fetching data"};
        }
    }

    //
    getAllReportsByStudentID_ClassID = async (studentID, classID) => {
        try {
            let data = await reportRepository.createQueryBuilder("report").
            leftJoinAndMapOne("report.feedback", Feedback, 'feedback', 'feedback.reportID = report.reportID').
            orderBy("report.createdAt", "DESC"). 
            where("report.studentID = :studentid", {studentid: studentID}). 
            andWhere("report.classID = :classid", {classid: classID}).
            getMany();

            return {data: data, error: null};
        } catch (e) {
            console.log(e);
            return {data: [], error: "Failed fetching reports"};
        }
    }

    //
    getAllReportsByTeacherID = async (teacherID) => {
        try {
            let data = await classesRepository.createQueryBuilder("classes"). 
            innerJoinAndMapMany("classes.report", Report, 'report', "report.classID = classes.classID").
            innerJoinAndMapOne("classes.course", Course, 'course', "course.courseID = classes.courseID").
            innerJoinAndMapOne("classes.student", Student, 'student', "report.studentID = student.studentID").
            select('classes.*').addSelect("course.*").addSelect("report.*").addSelect('student.studentID, student.studentEmail ,student.studentName').
            orderBy('report.new', "DESC").addOrderBy("report.createdAt", "DESC").
            where("classes.teacherID = :id", {id: teacherID}). 
            getRawMany();

            return {data: data, error: null};
        } catch (e) {
            console.log(e);
            return {data: [], error: "Failed fetching reports"};
        }
    }

    //
    getReportDetailByReportID = async (reportID) => {
        try {
            let data = await reportRepository.findOne({
                where: {reportID: reportID},
                relations: {
                    attendanceDetail: true,
                    feedback: true,
                    historyReports: true,
                    reportImage: true
                },
                order : {
                    historyReports: {
                        createdAt: {
                            direction : "DESC"
                        }
                    }
                }
            });
            return {data: data, error: null};
        } catch (e) {
            return {data: null, error: "Failed fetching report detail"};
        }
    }

    getHistoryReportByHistoryID = async (historyID) => {
        try {
            let data = await historyReportRepository.findOne({
                where: {historyReportID: historyID},
                relations: {
                    historyFeedbacks: true,
                    historyReportImages: true
                }
            })
            return {data, error: null};
        } catch (e) {
            return {data: null, error: "Failed fetching report detail"};
        }
    }
}

export default new ReportService();