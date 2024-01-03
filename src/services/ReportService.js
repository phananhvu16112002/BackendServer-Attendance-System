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
}

export default new ReportService();