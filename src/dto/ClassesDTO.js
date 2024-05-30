import { AttendanceForm } from "../models/AttendanceForm";
import { Classes } from "../models/Classes";
import { JSDatetimeToMySQLDatetime, MySQLDatetimeToJSDatetime, getWeekday } from "../utils/TimeConvert";

class ClassesDTO {
    appendRecentLesson = (classes) => {
        for (let i = 0; i < classes.length; i++){
            let classObject = classes[i];
            let closetLesson = this.getClosestLesson(classObject.attendanceForm);
            
            if (closetLesson != null){
                classObject.shiftNumber = closetLesson.shiftNumber;
                classObject.roomNumber = closetLesson.roomNumber;
                classObject.weekday = getWeekday(closetLesson.periodDateTime);
            }
            delete classObject.attendanceForm;
        }
        return classes;
    }

    getClosestLesson = (attendanceForms) => {
        let closestLessons = null;
        let minDiff = Infinity;
        let today = JSDatetimeToMySQLDatetime(new Date());
        for (let i = 0; i < attendanceForms.length; i++){
            let attendanceForm = attendanceForms[i];
            let lessonDate = MySQLDatetimeToJSDatetime(attendanceForm.periodDateTime);
            let diffInMs = Math.abs(new Date(today) - new Date(lessonDate));
            
            if (diffInMs < minDiff){
                minDiff = diffInMs;
                closestLessons = attendanceForm;
            }
        }
        return closestLessons;
    }
}

export default new ClassesDTO();