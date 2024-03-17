import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { AttendanceForm } from "../models/AttendanceForm";
import { Report } from "../models/Report";
import { StudentClass } from "../models/StudentClass";
import UploadImageService from "./UploadImageService";
import {JSDatetimeToMySQLDatetime} from '../utils/TimeConvert';

const reportRepository = AppDataSource.getRepository(Report);
const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);
const studentClassRepository = AppDataSource.getRepository(StudentClass);
const attendanceFormRepository = AppDataSource.getRepository(AttendanceForm);

class ReportService {
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
            
        } catch (e) {

        }
    }

    //
    getAllReportsByStudentID_ClassID = async () => {
        
    }
}

export default new ReportService();