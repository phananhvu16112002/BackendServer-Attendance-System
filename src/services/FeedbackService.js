import { Feedback } from "../models/Feedback";
import { AppDataSource } from "../config/db.config";
import { Report } from "../models/Report";

const reportRepository = AppDataSource.getRepository(Report);

class FeedbackService {
    updateReportAttendanceDetail = async (feedback, report) => {
        let {result, status} = this.resultAndStatusBasedOnConfirmStatus(feedback.confirmStatus, report.attendanceDetail.result);
        
        report.new = false;
        report.status = status;
        report.feedback = feedback;
        report.attendanceDetail.result = result;

        try {
            await reportRepository.save(report);
            return {data: feedback, error: null};
        } catch (e) {
            return {data: null, error: "Failed creating feedback"};
        }
    }

    resultAndStatusBasedOnConfirmStatus = (confirmStatus, attendanceResult) => {
        if (confirmStatus == "Present"){
            return {result: 1, status: "Approved"};
        }
        if (confirmStatus == "Late"){
            return {result: 0.5, status: "Approved"};
        }
        if (confirmStatus == "Absent"){
            return {result: 0, status: "Denied"};
        }
        return {result: attendanceResult, status: "Pending"};
    }

    feedBackObject = (topic, message, confirmStatus, createdAt) => {
        let feedback = new Feedback();
        feedback.topic = topic;
        feedback.message = message;
        feedback.confirmStatus = confirmStatus;
        feedback.createdAt = createdAt;
        return feedback;
    }
}

export default new FeedbackService();