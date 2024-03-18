import AttendanceDetailService from "../services/AttendanceDetailService";
import HistoryReportService from "../services/HistoryReportService";
import ReportImageService from "../services/ReportImageService";
import ReportService from "../services/ReportService";
import { JSDatetimeToMySQLDatetime } from "../utils/TimeConvert";
import compareCaseInsentitive from "../utils/CompareCaseInsentitive";
import ClassService from "../services/ClassService";
class ReportController {
    //oke 
    submitReport = async (req,res) => {
        try{
            const studentID = req.payload.userID;
            const classID = req.body.classID;
            const formID = req.body.formID;
            const topic = req.body.topic;
            const problem = req.body.problem;
            const message = req.body.message;

            let files = req.files;

            if (files != null && Object.keys(files).length > 3){
                return res.status(422).json({message: "Only three image files allowed"}); 
            }

            //check student attendance detail exists
            let {data, error} = await AttendanceDetailService.checkAttendanceDetailExist(studentID, classID, formID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(422).json({message: "Your attendance records do not exist"}); 
            }

            //check report exists
            let {data: reportData, error: reportError} = await ReportService.checkReportExist(data);
            if (reportError){
                return res.status(503).json({message: reportError});
            }
            if (reportData){
                return res.status(422).json({message: "Report's only been created once. Please edit report"});
            }
            
            //send files to Imgur
            let imageReportList = await ReportImageService.imageReportListFromImage(files);
            if (imageReportList.length == 0){
                return res.status(503).json({message: "Failed to upload images. Please upload again"});
            }

            //Transactions
            let {data: result, error: err} = await ReportService.loadReportWithImages(data, topic, problem, message, imageReportList);
            if (err){
                await ReportImageService.deleteImageReportList(imageReportList);
                return res.status(503).json({message: err});
            }
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //Oke
    editReport = async (req,res) => {
        try {
            const reportID = req.params.id;
            const studentID = req.payload.userID;
            const topic = req.body.topic;
            const problem = req.body.problem;
            const message = req.body.message;
            const status = "Pending";
            const createdAt = JSDatetimeToMySQLDatetime(new Date());

            let files = req.files;

            if (files != null && Object.keys(files).length > 3){
                return res.status(422).json({message: "Only three image files allowed"}); 
            }

            let {data,error} = await ReportService.getReportWithRelation(reportID);
            if (error){
                return res.status(503).json({message: error}); 
            }
            if (data == null){
                return res.status(204).json({message: `Report with id ${reportID} does not exist`});
            }
            if (compareCaseInsentitive(studentID, data.attendanceDetail.studentDetail) == false){
                return res.status(403).json({message: "Action Denied. Student is not authorized"});
            }

            let historyReport = HistoryReportService.copyReport(data);

            let imageReportList = await ReportImageService.imageReportListFromImage(files);
            if (imageReportList.length == 0 && req.files != null){
                return res.status(503).json({message: "Failed to upload images. Please upload again"});
            }

            let {data: result, error: err} = await HistoryReportService.updateReportAndInsertHistory(data, historyReport, imageReportList, topic, message, status, createdAt, problem);
            if (err){
                await ReportImageService.deleteImageReportList(imageReportList);
                return res.status(503).json({message: err});
            }
            return res.status(200).json(result);
            
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //oke
    getReportByID = async (req,res) => {
        try {
            const studentID = req.payload.userID;
            const reportID = req.params.id;

            let {data, error} = await ReportService.getReportDetail(reportID);
            if (error){
                return res.status(503).json({message: error}); 
            }
            if (data == null){
                return res.status(204).json({message: "Report with this id does not exist"});
            }
            if (compareCaseInsentitive(studentID, data.attendanceDetail.studentDetail) == false){
                return res.status(403).json({message: "Action Denied. Student is not authorized"});
            }

            delete data.attendanceDetail;
            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //oke
    getReportsByStudentIDInClassID = async (req,res) => {
        try{
            const studentID = req.payload.userID;
            const classID = req.params.classid;

            let {data, error} = await ReportService.getAllReportsByStudentID_ClassID(studentID, classID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "There is no reports in this class"});
            }

            return res.status(200).json(data);
        } catch (e) {   
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //oke
    getReportsByStudentID = async (req,res) => {
        try {
            const studentID = req.payload.userID;
            let {data, error} = await ReportService.getAllReportsByStudentID(studentID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "There is no reports in this class"});
            }

            return res.status(200).json(data);
        } catch (e) {
            console.log(e); 
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //testable
    getAllReportsByTeacherID = async (req,res) => {
        try{
            const teacherID = req.payload.userID;
            let {data,error} = await ReportService.getAllReportsByTeacherID(teacherID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "There is no reports yet"});
            }
            return res.status(200).json(data);
        } catch (e) {
            console.log(e); 
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //testable
    getReportDetailByReportID = async (req,res) => {
        const reportID = req.params.reportid;
        const classID = req.params.classid; 
        const teacherID = req.payload.userID;

        try{
            let checkAuth = await ClassService.getClassByID(classID);
            if (checkAuth == null){
                return res.status(503).json({message: "Cannot authorize teacher to perform this action"});
            }     
            if (compareCaseInsentitive(teacherID, checkAuth.teacher.teacherID) == false){
                return res.status(403).json({message: "Action Denied. Teacher is not authorized"});
            }
            let {data,error} = await ReportService.getReportDetailByReportID(reportID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: "Report detail cannot be found"});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }   
    }

    //testable
    getHistoryReportByHistoryID = async (req,res) => {
        const historyID = req.params.historyid;
        const classID = req.params.classid; 
        const teacherID = req.payload.userID;

        try {
            let checkAuth = await ClassService.getClassByID(classID);
            if (checkAuth == null){
                return res.status(503).json({message: "Cannot authorize teacher to perform this action"});
            }     
            if (compareCaseInsentitive(teacherID, checkAuth.teacher.teacherID) == false){
                return res.status(403).json({message: "Action Denied. Teacher is not authorized"});
            }

            let {data, error} = await ReportService.getHistoryReportByHistoryID(historyID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: "Report detail cannot be found"});
            }
            return res.status(200).json(data);
        } catch (e) {
            return res.status(500).json({message: "Internal Server"});
        }
    }
}

export default new ReportController();