import { AppDataSource } from "../config/db.config"
import { AttendanceForm } from "../models/AttendanceForm"
import { v4 as uuidv4 } from 'uuid';
import JSDatetimeToMySQLDatetime from "../utils/TimeConvert";

const attendanceFormRepository = AppDataSource.getRepository(AttendanceForm);

class AttendanceFormService {
    createFormWithID = async (id, classes, startTime, endTime, dateOpen, type) => {
        let form = new AttendanceForm();
        form.formID = id;
        form.classes = classes;
        form.startTime = startTime;
        form.endTime = endTime;
        form.dateOpen = dateOpen;
        form.status = true;
        form.type = type;

        await attendanceFormRepository.save(form);
        return form;
    }

    createForm = async (classes, startTime, endTime, dateOpen, type) => {
        try {

            let form = new AttendanceForm();
            form.formID = uuidv4();
            form.classes = classes;
            form.startTime = startTime;
            form.endTime = endTime;
            form.dateOpen = dateOpen;
            form.status = true;
            form.type = type;

            await attendanceFormRepository.save(form);
            return form;
        } catch (e) {
            return null;
        }
        
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
} 

export default new AttendanceFormService();