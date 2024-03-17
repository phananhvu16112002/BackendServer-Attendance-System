import AttendanceDetailService from "../services/AttendanceDetailService";
import ReportImageService from "../services/ReportImageService";
import ReportService from "../services/ReportService";

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

            let files = req.files.file;
            console.log(files);
            if (Array.isArray(files) == false){
                files = [files];
            }
            if (files != null && files.length > 3){
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

    editReport = async (req,res) => {
        //
    }
}

export default new ReportController();