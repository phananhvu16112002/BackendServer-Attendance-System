import AttendanceDetailService from "../services/AttendanceDetailService";
import { JSDatetimeToMySQLDatetime, MySQLDatetimeToJSDatetime } from "../utils/TimeConvert";
import distanceInMeter from "../utils/Distance";
import UploadImageService from "../services/UploadImageService";
import FaceMatchingService from "../services/FaceMatchingService";
import { AppDataSource } from "../config/db.config";
import { AttendanceDetail } from "../models/AttendanceDetail";
import StudentClassService from "../services/StudentClassService";
import ClassService from "../services/ClassService";
import compareCaseInsentitive from "../utils/CompareCaseInsentitive";
import AttendanceFormService from "../services/AttendanceFormService";
import AttendanceDetailDTO from "../dto/AttendanceDetailDTO";
const attendanceDetailRepository = AppDataSource.getRepository(AttendanceDetail); 
class AttendanceDetailController {
    takeAttendance = async (req, res) => {
        const studentID = req.body.studentID;
        const classID = req.body.classID;
        const formID = req.body.formID;
        const dateTimeAttendance = JSDatetimeToMySQLDatetime(new Date(req.body.dateTimeAttendance));

        const location = req.body.location;
        const latitude = req.body.latitude;
        const longtitude = req.body.longitude;
        const image = null;
        if (req.files != null){
             image = req.files.file;
        }

        //Check
        console.log("StudentID: ", studentID);
        console.log("ClassID: ", classID);
        console.log("FormID ", formID);
        console.log("Location ", location);
        console.log("Latitude ", latitude);
        console.log("Longitude ", longtitude)
        console.log("Image ", image);
        console.log("Attendanced at", dateTimeAttendance);

        //Call database to get attendance detail
        let attendanceDetail = await AttendanceDetailService.getAttendanceDetail(studentID, classID, formID);
        if (attendanceDetail == null){
            return res.status(422).json({message: "Your attendance detail is not recorded"});
        }
        let attendanceForm = attendanceDetail.attendanceForm;

        //Check location first (has a service to check)
        let lat = attendanceForm.latitude;
        let long = attendanceForm.longitude;
        console.log("-----------------------------------------------------")
        console.log("Latitude in form: ", lat);
        console.log("Longitude in form: ", long);

        console.log("Latitude in student: ", latitude);
        console.log("Longitude in student: ", longtitude);
        //will emit later
        console.log(distanceInMeter(latitude, longtitude, lat, long));
        if (distanceInMeter(latitude, longtitude, lat, long) > attendanceForm.radius){
            return res.status(422).json({message: "Your location is not in range"});
        }

        //Check if attendance Detail exist
        if (attendanceDetail == null){
            return res.status(422).json({message : "Your attendance record does not exist"});
        }
        
        //Check form status and dateOpen
        if (attendanceForm.status == false){
            return res.status(422).json({message : "Form has been closed by lecturer"});
        }

        //Check form time will emit later
        let start = MySQLDatetimeToJSDatetime(attendanceForm.startTime); 
        let end = MySQLDatetimeToJSDatetime(attendanceForm.endTime);
        let offset = new Date(start);
        offset.setMinutes(offset.getMinutes() + 10);
        offset = JSDatetimeToMySQLDatetime(offset);

        if (dateTimeAttendance < start
            || dateTimeAttendance > end){
            
            return res.status(422).json({message : "Your attendance time is not in range. Please contact your lecturer"});
        }

        console.log("Start time: ", start);
        console.log("Offset time: ", offset);
        console.log("Student take attendance at: ", dateTimeAttendance);
        let result = 1;
        if (dateTimeAttendance >= start && dateTimeAttendance <= offset){
            console.log("present cho sinh vien");
            result = 1;
        }else if (dateTimeAttendance > offset && dateTimeAttendance <= end) {
            console.log("late cho sinh vien");
            result = 0.5;
        } else if (dateTimeAttendance > end) {
            result = 0;
        }

        if (attendanceForm.type == 2){
            attendanceDetail.location = location;
            attendanceDetail.latitude = latitude;
            attendanceDetail.longitude = longtitude;
            attendanceDetail.result = result;
            attendanceDetail.dateAttendanced = dateTimeAttendance;
            attendanceDetailRepository.save(attendanceDetail);
            return res.status(200).json(attendanceDetail);
        }

        //Send image to Imgur
        const data = await UploadImageService.uploadAttendanceEvidenceFile(image);
        if (data == null){
            return res.status(500).json({message: "Cannot upload image. Please take attendance again."});
        }

        if (attendanceForm.type == 0){
            let check = await FaceMatchingService.faceMatching(image, studentID);
            if (!check){
                await UploadImageService.deleteImageByImageHash(data.id);
                return res.status(422).json({message: "Your face does not match"});
            }
        }
        //If only type == 1
            //After send image success, do face matching


            //if face matching is not match, then delete image in Imgur


        //after all work successfully, store attendance detail in server
        attendanceDetail.url = data.link;
        attendanceDetail.location = location;
        attendanceDetail.latitude = latitude;
        attendanceDetail.longitude = longtitude;
        attendanceDetail.result = result;
        attendanceDetail.dateAttendanced = dateTimeAttendance;
        await attendanceDetailRepository.save(attendanceDetail);
        return res.status(200).json(attendanceDetail);
    }

    //oke
    getAttendanceRecordsOfStudentByClassID = async (req,res) => {
        try {
            const studentID = req.payload.userID;
            const classID = req.params.id;
            let {data,error} = await StudentClassService.checkStudentEnrolledInClass(studentID, classID);

            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(422).json({message: "Student is not enrolled in this class"});
            }

            let {data: result, error: err} = await AttendanceDetailService.getAttendanceDetailByClassID(studentID, classID);
            if (err){
                return res.status(503).json({message: err});
            }
            if (result.length == 0){
                return res.status(204).json({message: "You haven't taken any attendance yet!"});
            }
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //oke
    getOfflineAttendanceRecordsOfStudentByClassID = async (req,res) => {
        try {
            const studentID = req.payload.userID;
            const classID = req.params.id;
            let {data,error} = await StudentClassService.checkStudentEnrolledInClass(studentID, classID);

            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(422).json({message: "Student is not enrolled in this class"});
            }

            let {data: result, error: err} = await AttendanceDetailService.getOfflineAttendanceDetailByClassID(studentID, classID);
            if (err){
                return res.status(503).json({message: err});
            }
            if (result.length == 0){
                return res.status(204).json({message: "You haven't taken any attendance yet!"});
            }
            return res.status(200).json(result);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    takeAttendanceOffline = async (req, res) => {
        const studentID = req.body.studentID;
        const classID = req.body.classID;
        const formID = req.body.formID;
        const dateTimeAttendance = req.body.dateTimeAttendance;

        const location = req.body.location;
        const latitude = req.body.latitude;
        const longtitude = req.body.longitude;
        const image = req.files.file;

        //Check
        console.log("StudentID: ", studentID);
        console.log("ClassID: ", classID);
        console.log("FormID ", formID);
        console.log("Location ", location);
        console.log("Latitude ", latitude);
        console.log("Longitude ", longtitude)
        console.log("Image ", image);

        //Call database to get attendance detail
        let attendanceDetail = await AttendanceDetailService.getAttendanceDetail(studentID, classID, formID);
        if (attendanceDetail == null){
            return res.status(422).json({message: "Your attendance detail is not recorded"});
        }
        let attendanceForm = attendanceDetail.attendanceForm;

        //Check location first (has a service to check)
        let lat = attendanceForm.latitude;
        let long = attendanceForm.longitude;

        //will emit later

        if (distanceInMeter(latitude, longtitude, lat, long) > attendanceForm.radius){
            return res.status(422).json({message: "Your location is not in range"});
        }

        //Check if attendance Detail exist
        if (attendanceDetail == null){
            return res.status(422).json({message : "Your attendance record does not exist"});
        }
        
        //Check form status and dateOpen
        if (attendanceForm.status == false){
            return res.status(422).json({message : "Form has been closed by lecturer"});
        }

        //Check form time will emit later
        let start = MySQLDatetimeToJSDatetime(attendanceForm.startTime); 
        let end = MySQLDatetimeToJSDatetime(attendanceForm.endTime);
        let offset = new Date(start);
        offset.setMinutes(offset.getMinutes() + 10);
        offset = JSDatetimeToMySQLDatetime(offset);
        let result = 1;
        
        if (dateTimeAttendance < start
            || dateTimeAttendance > end){
            
            return res.status(422).json({message : "Your attendance time is not in range. Please contact your lecturer"});
        }

        console.log("Start time: ", start);
        console.log("Offset time: ", offset);
        console.log("Student take attendance at: ", dateTimeAttendance);

        if (dateTimeAttendance >= start && dateTimeAttendance <= offset){
            console.log("present cho sinh vien");
            result = 1;
        }else if (dateTimeAttendance > offset && dateTimeAttendance <= end) {
            console.log("late cho sinh vien");
            result = 0.5;
        } else if (dateTimeAttendance > end) {
            result = 0;
        }

        //face checking
        let check = await FaceMatchingService.faceMatching(image, studentID);
        if (!check){
            return res.status(422).json({message: "Your face does not match"});
        }

        //Send image to Imgur
        const data = await UploadImageService.uploadAttendanceEvidenceFile(image);
        if (data == null){
            await UploadImageService.deleteImageByImageHash(data.id);
            return res.status(500).json({message: "Cannot upload image. Please take attendance again."});
        }
        
        //If only type == 1
            //After send image success, do face matching


            //if face matching is not match, then delete image in Imgur


        //after all work successfully, store attendance detail in server
        attendanceDetail.url = data.link;
        attendanceDetail.location = location;
        attendanceDetail.latitude = latitude;
        attendanceDetail.longitude = longtitude;
        attendanceDetail.result = result;
        attendanceDetail.dateAttendanced = dateTimeAttendance;
        attendanceDetail.offline = true;
        await attendanceDetailRepository.save(attendanceDetail);
        res.status(200).json(attendanceDetail);
    }

    getAttendanceDetailByStudentIDClassIDFormID = async (req,res) => {
        try {
            const studentID = req.params.studentid;
            const classID = req.params.classid;
            const formID = req.params.formid;
            const teacherID = req.payload.userID;

            let checkAuth = await ClassService.getClassByID(classID);
            if (checkAuth == null){
                return res.status(503).json({message: "Cannot authorize teacher to perform this action"});
            }
                
            if (compareCaseInsentitive(teacherID, checkAuth.teacher.teacherID) == false){
                return res.status(403).json({message: "Action Denied. Teacher is not authorized"});
            }

            let {data, error} = await AttendanceDetailService.getAttendanceDetailByStudentIDClassIDFormID(studentID, classID, formID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(422).json({message: "There is no attendace record found"});
            }

            return res.status(200).json(data);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //oke
    getAttendanceDetailsByFormID = async (req,res) => {
        //check if teacher owns this form
        const teacherID = req.payload.userID;
        const formID = req.params.id;
        //getAttendanceDetails
        return res.status(200).json(await AttendanceFormService.getAttendanceFormByFormID(formID));
    }

    //test must
    editAttendanceDetail = async (req,res) => {
        try {
            const teacherID = req.payload.userID;
            const studentID = req.params.studentid;
            const classID = req.params.classid;
            const formID = req.params.formid;
            const topic = req.body.topic;
            const confirmStatus = req.body.confirmStatus;
            const message = req.body.message;
            let checkAuth = await ClassService.getClassByID(classID);
            if (checkAuth == null){
                return res.status(503).json({message: "Cannot authorize teacher to perform this action"});
            }         
            if (compareCaseInsentitive(teacherID, checkAuth.teacher.teacherID) == false){
                return res.status(403).json({message: "Action Denied. Teacher is not authorized"});
            }

            let {data : attendanceDetail, error} = await AttendanceDetailService.checkAttendanceDetailExist(studentID, classID, formID);
            if (error){
                return res.status(503).json({message: error});
            } 
            if (attendanceDetail == null){
                return res.status(422).json({message: "Attendance detail does not exist"});
            }

            if (await AttendanceDetailService.editAttendanceDetail(attendanceDetail, message, confirmStatus, topic)){
                return res.status(200).json({message: "Edit successfully"});
            }
            return res.status(503).json({message: "Edit failed"});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    getTotalStatsByClassIDForAdmin = async (req,res) => {
        try {
            const classID = req.params.id;
            let {data: classData, error: errorClass} = await ClassService.getClassesWithStudentsCourseTeacher(classID);
            if (errorClass){
                return res.status(500).json({message: errorClass});
            }
            if (classData == null){
                return res.status(204).json({message: "Class with this ID does not exist"});
            }
            let {data: studentDetails, error: err} = await StudentClassService.getStudentsAttendanceDetailsByClassID(classID);
            if (err){
                return res.status(500).json({message: error});
            } 
            if (studentDetails.length == 0){
                return res.status(204).json({message: "There are no records for students' attendance details"});
            }
            let offset = classData.course.totalWeeks - classData.course.requiredWeeks;
            let {total, pass, ban, warning, data: result} = AttendanceDetailDTO.transformStudentsAttendanceDetails(studentDetails, offset);
            let {data, error} = await AttendanceDetailService.getStatsBasedOnClassID(classID);
            if (error){
                return res.status(500).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content"});
            }
            let {progressPresent, progressLate, progressAbsent, groupBarCharts} = AttendanceDetailDTO.getAttendanceDetailsStats(data);
            let progressPass = (total > 0) ? Math.floor(pass / total)*100 : 0;
            let progressWarning = (total > 0) ? Math.floor(warning / total)*100 : 0;
            let progressBan = (total > 0) ? Math.floor(ban /total)*100 : 0;
            let resultStats = {
                progressPass, progressWarning, progressBan,
                progressPresent, progressLate, progressAbsent,
                groupBarCharts
            }
            return res.status(200).json(resultStats);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    getTotalStatsByClassIDForTeacher = async (req,res) => {
        try {
            const classID = req.params.id;
            const teacherID = req.payload.userID;
            let {data: classData, error: errorClass} = await ClassService.getClassesWithStudentsCourseTeacher(classID);
            if (errorClass){
                return res.status(500).json({message: errorClass});
            }
            if (classData == null){
                return res.status(204).json({message: "Class with this ID does not exist"});
            }
            if (compareCaseInsentitive(teacherID, classData.teacher.teacherID) == false){
                return res.status(422).json({message: "Teacher is not in charge of this class"});
            }
            let {data: studentDetails, error: err} = await StudentClassService.getStudentsAttendanceDetailsByClassID(classID);
            if (err){
                return res.status(500).json({message: error});
            } 
            if (studentDetails.length == 0){
                return res.status(204).json({message: "There are no records for students' attendance details"});
            }
            let offset = classData.course.totalWeeks - classData.course.requiredWeeks;
            let {total, pass, ban, warning, data: result} = AttendanceDetailDTO.transformStudentsAttendanceDetails(studentDetails, offset);
            let {data, error} = await AttendanceDetailService.getStatsBasedOnClassID(classID);
            if (error){
                return res.status(500).json({message: error});
            }
            if (data.length == 0){
                return res.status(204).json({message: "No content"});
            }
            let {progressPresent, progressLate, progressAbsent, groupBarCharts} = AttendanceDetailDTO.getAttendanceDetailsStats(data);
            let progressPass = (total > 0) ? Math.floor(pass / total)*100 : 0;
            let progressWarning = (total > 0) ? Math.floor(warning / total)*100 : 0;
            let progressBan = (total > 0) ? Math.floor(ban /total)*100 : 0;
            let resultStats = {
                progressPass, progressWarning, progressBan,
                progressPresent, progressLate, progressAbsent,
                groupBarCharts
            }
            return res.status(200).json(resultStats);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export default new AttendanceDetailController();