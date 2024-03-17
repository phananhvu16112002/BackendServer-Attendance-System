import ClassService from "../services/ClassService";
import FeedbackService from "../services/FeedbackService";
import ReportService from "../services/ReportService";
import compareCaseInsentitive from "../utils/CompareCaseInsentitive";
import {JSDatetimeToMySQLDatetime} from '../utils/TimeConvert';

class FeedbackController {
    //oke
    sendFeedback = async (req,res) => {
        try{
            const teacherID = req.payload.userID;
            const reportID = req.body.reportID;
            const topic = req.body.topic;
            const message = req.body.message;
            const confirmStatus = req.body.confirmStatus;
            const createdAt = JSDatetimeToMySQLDatetime(new Date());
            
            let {data,error} = await ReportService.getReportByID(reportID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: `Report with id ${reportID} does not exist`});
            }
            if (data.feedback != null){
                return res.status(422).json({message: "Feedback for this report has only been responsed once. Please edit feedback"});
            }

            let checkAuth = await ClassService.getClassByID(data.attendanceDetail.classID);
            if (checkAuth == null){
                return res.status(503).json({message: "Cannot authorize teacher to perform this action"});
            }
            
            if (compareCaseInsentitive(teacherID, checkAuth.teacher.teacherID) == false){
                return res.status(403).json({message: "Action Denied. Teacher is not authorized"});
            }

            let feedback = FeedbackService.feedBackObject(topic, message, confirmStatus, createdAt);
            let {data: result, error: err} = await FeedbackService.updateReportAttendanceDetail(feedback, data);
            if (err){
                return res.status(503).json({message: err});
            }
            return res.status(200).json(result);
        } catch (e) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    //oke
    editFeedback = async (req,res) => {
        try{
            const teacherID = req.payload.userID;
            const reportID = req.params.id;
            const topic = req.body.topic;
            const message = req.body.message;
            const confirmStatus = req.body.confirmStatus;
            const createdAt = JSDatetimeToMySQLDatetime(new Date());
            
            let {data,error} = await ReportService.getReportByID(reportID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: `Report with id ${reportID} does not exist`});
            }
            if (data.feedback == null){
                return res.status(422).json({message: "Feedback for this report has not been created. Please create feedback"});
            }

            let checkAuth = await ClassService.getClassByID(data.attendanceDetail.classID);
            if (checkAuth == null){
                return res.status(503).json({message: "Cannot authorize teacher to perform this action"});
            }
            
            if (compareCaseInsentitive(teacherID, checkAuth.teacher.teacherID) == false){
                return res.status(403).json({message: "Action Denied. Teacher is not authorized"});
            }

            let feedback = data.feedback;
            feedback.topic = topic;
            feedback.message = message;
            feedback.confirmStatus = confirmStatus;
            feedback.createdAt = createdAt;

            let {data: result, error: err} = await FeedbackService.updateReportAttendanceDetail(feedback, data);
            if (err){
                return res.status(503).json({message: err});
            }
            return res.status(200).json(result);
        } catch(e) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}  

export default new FeedbackController();