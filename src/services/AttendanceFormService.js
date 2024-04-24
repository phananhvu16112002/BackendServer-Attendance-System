import { AppDataSource } from "../config/db.config"
import { AttendanceForm } from "../models/AttendanceForm"
import { v4 as uuidv4 } from 'uuid';
import {JSDatetimeToMySQLDatetime} from "../utils/TimeConvert";
import { Classes } from "../models/Classes";
import { AttendanceDetail } from "../models/AttendanceDetail";
import { Student } from "../models/Student";

const attendanceFormRepository = AppDataSource.getRepository(AttendanceForm);
const classRepository = AppDataSource.getRepository(Classes);

class AttendanceFormService {
    //Oke
    createFormTransaction = async (attendanceForm, attendanceDetails) => {
        try {
            await AppDataSource.transaction(async (transactionalEntityManager) => {
                await transactionalEntityManager.save(attendanceForm);
                await transactionalEntityManager.save(attendanceDetails);
                
            })

            return {data: attendanceForm, error: null}
        } catch (e) {
            console.log(e);
            return {data: null, error: "Failed creating form"};
        }
    }

    //Oke
    createFormEntity = (classes, startTime, endTime, dateOpen, type,
                        location, latitude, longitude, radius) => {
        let form = new AttendanceForm();
        form.formID = uuidv4();
        form.classes = classes;
        form.startTime = startTime;
        form.endTime = endTime;
        form.dateOpen = dateOpen;
        form.status = true;
        form.type = type;
        form.location = location;
        form.latitude = latitude;
        form.longitude = longitude;
        form.radius = radius;
        return form;
    }

    closeFormByID = async (formID) => {
        try {
            await attendanceFormRepository.update(formID, {status : false});
        } catch (e) {

        }
    }

    reopenForm = async (formID, startTime, endTime, type) => {
        try {
            await attendanceFormRepository.update(formID, {
                startTime : startTime,
                endTime : endTime,
                type : type,
                status : true
            });
        } catch (e) {

        }
    }

    getFormByID = async (formID) => {
        try {
            return await attendanceFormRepository.findOneBy({formID: formID}); 
        } catch (e) {
            return null;
        }
    }

    //Oke
    getAttendanceFormsByClassID = async (classID) => {
        try{
            let data = await classRepository.findOne({
                where: {
                    classID: classID
                },
                order: {
                    attendanceForm: {
                        dateOpen: "DESC"
                    }
                },
                relations: {
                    teacher: true,
                    attendanceForm: true
                }
            });

            return {data, error: null};
        } catch (e) {
            return {data: null, error: "Failed fetching data"};
        }
    }

    //
    getAttendanceFormByFormID = async (formID) => {
        try {
            let data = await attendanceFormRepository.createQueryBuilder("attendanceform").
            leftJoinAndMapMany("attendanceform.attendancedetails", AttendanceDetail, "attendancedetail", "attendancedetail.formID = attendanceform.formID").
            innerJoinAndMapOne("attendancedetail.student", Student, "student", "attendancedetail.studentID = student.studentID").
            select("attendancedetail.*").addSelect("student.studentName, student.studentEmail").
            where("attendanceform.formID =:id", {id: formID}).getRawMany();

            let stats = await attendanceFormRepository.createQueryBuilder("attendanceform").
            leftJoinAndMapMany("attendanceform.attendancedetails", AttendanceDetail, "attendancedetail", "attendancedetail.formID = attendanceform.formID").
            select("attendanceform.*").
            addSelect('COUNT(attendancedetail.formID) as total').
            addSelect(`SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS totalPresence`,).
            addSelect(`SUM(CASE WHEN result = 0 THEN 1 ELSE 0 END) AS totalAbsence`,).
            addSelect(`SUM(CASE WHEN result = 0.5 THEN 1 else 0 END) AS totalLate`,).
            groupBy("attendancedetail.formID").
            where("attendanceform.formID =:id", {id: formID}).getRawOne();

            return {data, stats};
        } catch (e) {
            return {data: null, error: "Failed fetching data"};
        }
    }

    deleteAttendanceFormByID = async (formID) => {
        try {
            await attendanceFormRepository.delete({
                formID: formID
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    editAttendanceFormByID = async (formID, startTime, endTime, offsetTime, type, distance) => {
        try {
            await attendanceFormRepository.update({
                formID: formID
            }, {
                startTime: startTime,
                endTime: endTime,
                radius: distance,
                type: type
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    closeOrOpenFormByFormID = async (formID, status) => {
        try {
            await attendanceFormRepository.update(formID, {status : status});
            return true;
        } catch (e) {
            return false;
        }
    }
}  

export default new AttendanceFormService();