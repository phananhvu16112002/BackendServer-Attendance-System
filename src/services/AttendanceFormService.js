import { AppDataSource } from "../config/db.config"
import { AttendanceForm } from "../models/AttendanceForm"
import { v4 as uuidv4 } from 'uuid';
import {JSDatetimeToMySQLDatetime} from "../utils/TimeConvert";
import { Classes } from "../models/Classes";

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
}  

export default new AttendanceFormService();