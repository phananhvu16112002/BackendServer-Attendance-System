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