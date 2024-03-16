import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { AttendanceForm } from "../models/AttendanceForm";
import { Report } from "../models/Report";
import { StudentClass } from "../models/StudentClass";

const reportRepository = AppDataSource.getRepository(Report);
const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail);
const studentClassRepository = AppDataSource.getRepository(StudentClass);
const attendanceFormRepository = AppDataSource.getRepository(AttendanceForm);

class ReportService {
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
        return report;
    }

    //oke testable, test it
    loadReportWithImages = async (data, topic, problem, message, imageReportList) => {
        try {
            let report = this.reportObject(data, topic, problem, message, imageReportList);
            let result = await reportRepository.save(report);
            return {data: result, error: null};
        } catch (e) {
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