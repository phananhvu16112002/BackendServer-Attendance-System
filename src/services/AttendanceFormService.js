import { AppDataSource } from "../config/db.config"
import { AttendanceForm } from "../models/AttendanceForm"
import { Classes } from "../models/Classes"
import { v4 as uuidv4 } from 'uuid';
import JSDatetimeToMySQLDatetime from "../utils/TimeConvert";
import { where } from "@tensorflow/tfjs-node";

const attendanceFormRepository = AppDataSource.getRepository(AttendanceForm);
const classesRepository = AppDataSource.getRepository(Classes);

class AttendanceFormService {
    createForm = async (classID, startTime, endTime, type) => {
        try {
            let classes = await classesRepository.findOneBy({classID : classID});
            if (classes == null){
                return null;
            }

            let form = new AttendanceForm();
            form.formID = uuidv4();
            form.classes = classes;
            form.startTime = JSDatetimeToMySQLDatetime(new Date(startTime));
            form.endTime = JSDatetimeToMySQLDatetime(new Date(endTime));
            form.dateOpen = JSDatetimeToMySQLDatetime(new Date());
            form.status = true;
            form.weekNumber = 0;
            //form.type = type;

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