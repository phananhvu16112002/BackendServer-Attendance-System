import AttendanceFormDTO from "../dto/AttendanceFormDTO";
import AttendanceDetailService from "../services/AttendanceDetailService";
import AttendanceFormService from "../services/AttendanceFormService";
import ClassService from "../services/ClassService";
import NotificationService from "../services/NotificationService";
import compareCaseInsentitive from "../utils/CompareCaseInsentitive";
import {JSDatetimeToMySQLDatetime} from "../utils/TimeConvert";

class AttendanceFormController {
    //Oke
    createAttendanceForm = async (req, res) => {
        try {
            const teacherID = req.payload.userID;
            const classID = req.body.classID;
            const startTime = req.body.startTime;
            const endTime = req.body.endTime;
            const dateOpen = JSDatetimeToMySQLDatetime(new Date());
            const type = req.body.type;

            const location = req.body.location;
            const latitude = req.body.latitude;
            const longitude = req.body.longitude;
            const radius = req.body.radius;

            const {data: classes, error: err} = await ClassService.getClassByIDWithStudents(classID);
            if (err){
                return res.status(503).json({message: err});
            }
            if (classes == null){
                return res.status(204).json({message : `Class with the id: ${classID} does not exist`});
            }

            if (compareCaseInsentitive(teacherID, classes.teacher.teacherID) == false){
                return res.status(422).json({message: "Teacher is not in charge of this class"});
            }

            //Create entities before inserting into database
            const attendanceFormEntity = AttendanceFormService.createFormEntity(classes, startTime, endTime, dateOpen, type, location, latitude, longitude, radius);
            const attendanceDetailEntities = AttendanceDetailService.createDefaultAttendanceDetailEntitiesForStudents(classes.studentClass, attendanceFormEntity);
        
            //Make transactions to insert into database
            const {data: form,error} = await AttendanceFormService.createFormTransaction(attendanceFormEntity, attendanceDetailEntities);

            if (error){
                return res.status(503).json({message: error});
            }
            //Get danh sach student trong danh sach cam thi, trong danh sach warning
            //Send notification
            let offset = classes.course.totalWeeks - classes.course.requiredWeeks;
            offset = offset + 1;
            await NotificationService.sendAttendanceFormToStudents(classID, offset);
            
            if (form == null){
                return res.status(503).json({message : "Attendance Form cannot be created. Please try again!"});
            }

            return res.status(200).json(AttendanceFormDTO.excludeClasses(form));
        } catch (e) {
            console.log(e);
            return res.status(500).json({message : "Internal Server"});
        }
    }

    //oke
    getAttendanceFormsByClassID = async (req,res) => {
        try {
            const teacherID = req.payload.userID;
            const classID = req.params.id;
            
            let {data,error} = await AttendanceFormService.getAttendanceFormsByClassID(classID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: "There is no classes with this ID"});
            }
            
            if (compareCaseInsentitive(teacherID, data.teacher.teacherID) == false){
                return res.status(401).json({message: "Teacher is not in charge of this class"});
            }
            if (data.attendanceForm.length == 0){
                return res.status(204).json({message: "There is no forms created!"});
            }
            return res.status(200).json(data.attendanceForm);
        } catch(e){
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //must test
    deleteAttendanceFormByFormID = async (req,res) => {
        try {
            let formID = req.params.formid;
            let classID = req.params.classid;
            let teacherID = req.payload.userID;

            let {data,error} = await AttendanceFormService.getAttendanceFormsByClassID(classID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: "There is no classes with this ID"});
            }
            
            if (compareCaseInsentitive(teacherID, data.teacher.teacherID) == false){
                return res.status(401).json({message: "Teacher is not in charge of this class"});
            }

            if (await AttendanceFormService.deleteAttendanceFormByID(formID) == false){
                return res.status(503).json({message: "Failed deleting form"});
            }
            return res.status(200).json({message: "Delete form successfully"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //must test
    editAttendanceFormByFormID = async (req,res) => {
        try {
            let formID = req.params.formid;
            let classID = req.params.classid;
            let teacherID = req.payload.userID;

            let offsetTime = req.body.offsetTime;
            let startTime = req.body.startTime;
            let endTime = req.body.endTime;
            let type = req.body.type;
            let distance = req.body.distance;

            let {data,error} = await AttendanceFormService.getAttendanceFormsByClassID(classID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: "There is no classes with this ID"});
            }
            
            if (compareCaseInsentitive(teacherID, data.teacher.teacherID) == false){
                return res.status(401).json({message: "Teacher is not in charge of this class"});
            }

            if (await AttendanceFormService.editAttendanceFormByID(formID, startTime, endTime, offsetTime, type, distance) == false){
                return res.status(503).json({message: "Failed editing form"});
            }
            return res.status(200).json({message: "Edit form successfully"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }

    //must test
    closeOrOpenFormByFormID = async (req,res) => {
        try {
            let formID = req.params.formid;
            let classID = req.params.classid;
            let teacherID = req.payload.userID;
            let status = req.body.status;
            let {data,error} = await AttendanceFormService.getAttendanceFormsByClassID(classID);
            if (error){
                return res.status(503).json({message: error});
            }
            if (data == null){
                return res.status(204).json({message: "There is no classes with this ID"});
            }
            
            if (compareCaseInsentitive(teacherID, data.teacher.teacherID) == false){
                return res.status(401).json({message: "Teacher is not in charge of this class"});
            }

            if (await AttendanceFormService.closeOrOpenFormByFormID(formID, status) == false){
                return res.status(503).json({message: "Failed updating form"});
            }
            return res.status(200).json({message: "Update form successfully"});
        } catch (e) {
            return res.status(500).json({message: "Internal Server Error"});
        }
    }
}

export default new AttendanceFormController();