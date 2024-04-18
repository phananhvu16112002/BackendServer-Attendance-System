import { Feedback } from "../models/Feedback";
import { AppDataSource } from "../config/db.config";
import { Report } from "../models/Report";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { Classes } from "../models/Classes";
import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";
const reportRepository = AppDataSource.getRepository(Report);
const feedbackRepository = AppDataSource.getRepository(Feedback);

class FeedbackService {
    updateReportAttendanceDetail = async (feedback, report) => {
        let {result, status} = this.resultAndStatusBasedOnConfirmStatus(feedback.confirmStatus, report.attendanceDetail.result);
        
        report.new = false;
        report.status = status;
        report.feedback = feedback;
        
        let attendanceDetail = report.attendanceDetail;
        attendanceDetail.result = result;
        report.attendanceDetail = attendanceDetail;

        try {
            //await reportRepository.save(report);
            await AppDataSource.transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.save(report);
                await transactionalEntityManager.update(AttendanceDetail, {
                    studentDetail: attendanceDetail.studentDetail, 
                    classDetail: attendanceDetail.classDetail, 
                    attendanceForm: attendanceDetail.attendanceForm}, {result: result});
            })
            return {data: feedback, error: null};
        } catch (e) {
            console.log(e);
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

    //must test
    getFeedBackByStudentID = async (studentID) => {
        try {   
            let data = await feedbackRepository.createQueryBuilder('feedback').
            innerJoinAndMapOne("feedback.report",Report, "report", "feedback.reportID = report.reportID").andWhere("report.studentID = :id", {id: studentID}).
            innerJoin(Classes, "classes", "report.classID = classes.classID").
            innerJoinAndMapOne("feedback.course", Course, "course", "course.courseID = classes.courseID"). 
            innerJoinAndMapOne("feedback.teacher", Teacher, "teacher", "teacher.teacherID = classes.teacherID").
            getMany();
            return {data, error: null}
        } catch (e) {
            return {data: [], error: "Failed getting student feedback"};
        }
    }
}

export default new FeedbackService();