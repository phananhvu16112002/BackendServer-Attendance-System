import { v4 as uuidv4 } from 'uuid';
import { AttendanceForm } from '../models/AttendanceForm';
import { JSDatetimeToMySQLDatetime } from './TimeConvert';
import { Classes } from '../models/Classes';
import PeriodRegulations from './PeriodRegulations';
import { StudentClass } from '../models/StudentClass';

class BusinessUtils {
    getShiftAndPeriodTime = (period) => {
        let {firstPeriodIndex, totalPeriodIndices} = this.getFirstPeriodIndexAndTotalPeriodIndices(period);
        let firstPeriod = PeriodRegulations.get((firstPeriodIndex + 1).toString()); 
        let lastPeriod = PeriodRegulations.get((firstPeriodIndex + totalPeriodIndices).toString());
        return {shift: firstPeriod.shift, startTime: firstPeriod.start, endTime: lastPeriod.end};
    }
    
    getFirstPeriodIndexAndTotalPeriodIndices = (period) => {
        let totalPeriodIndices = 0;
        let firstPeriodIndex = 0;
        for (let i = 0; i < period.length; i++){
          if (/\d/.test(period[i]) && totalPeriodIndices == 0){
            firstPeriodIndex = i;
            totalPeriodIndices+=1;
          } else if (/\d/.test(period[i])){
            totalPeriodIndices+=1;
          }
        }
        return {firstPeriodIndex, totalPeriodIndices};
    }
    
    generateWeekDate = (targetWeekIndex, firstWeekIndex, startDate) => {
        let date = new Date(startDate);
        let targetWeekTime = 1000 * 60 * 60 * 24 * 7 * (targetWeekIndex - firstWeekIndex);
        return JSDatetimeToMySQLDatetime(new Date(date.getTime() + targetWeekTime));
    }
    
    AttendanceFormConstructor = (classID, roomNumber, shiftNumber, periodStartTime, periodEndTime, periodDateTime) => {
        let attendanceForm = new AttendanceForm();
        attendanceForm.formID = uuidv4();
        attendanceForm.classes = classID;
        attendanceForm.roomNumber = roomNumber;
        attendanceForm.shiftNumber = shiftNumber;
        attendanceForm.periodStartTime = periodStartTime;
        attendanceForm.periodEndTime = periodEndTime;
        attendanceForm.periodDateTime = periodDateTime;
        return attendanceForm;
    }
    
    ClassesConstructor = (classID, courseID, semesterID, group, subGroup, startDate, endDate, classType, teacherID) => {
        let classes = new Classes();
        classes.classID = classID;
        classes.course = courseID;
        classes.teacher = teacherID;
        classes.semester = semesterID;
        classes.group = group;
        classes.subGroup = subGroup;
        classes.startDate = startDate;
        classes.endDate = endDate;
        classes.classType = classType;
        return classes;
    }
    
    generateClassID = (courseID, group, subGroup, semesterID) => {
        if (subGroup == null || subGroup == "") subGroup = "0"; 
        return `${courseID}-${group}-${subGroup}-${semesterID}`;
    }
    
    generateClassesAndAttendanceForms = (classID, semesterID, row) => {
        let courseID = row.getCell(2).text;
        let group = row.getCell(3).text;
        let subGroup = (row.getCell(4).text) ? row.getCell(4).text : "0";
        let type = (subGroup == "0") ? "Theory" : "Laboratory";
        let weeks = row.getCell(8).text;
        let period = row.getCell(9).text;
        let room = row.getCell(11).text;
        let startDate = JSDatetimeToMySQLDatetime(new Date(row.getCell(12).text));
        let endDate = JSDatetimeToMySQLDatetime(new Date(row.getCell(13).text));
        let teacherID = row.getCell(18).text;
        let classes = this.ClassesConstructor(classID, courseID, semesterID, group, subGroup, startDate, endDate, type, teacherID);
        let attendanceForms = this.generateAttendanceForms(classID, weeks, period, room, startDate);
        classes.attendanceForm = attendanceForms;
        return classes;
    }
    
    generateAttendanceForms = (classID, weeks, period, roomNumber, startDate) => {
        let firstWeekIndex = 0;
        let attendanceForms = [];
        let {shift, startTime, endTime} = this.getShiftAndPeriodTime(period);
        for (let i = 0; i < weeks.length; i++){
            if (/\d/.test(weeks[i]) && firstWeekIndex == 0){
                firstWeekIndex = i; 
                let attendanceForm = this.AttendanceFormConstructor(classID, roomNumber, shift, startTime, endTime, this.generateWeekDate(i, firstWeekIndex, startDate));
                attendanceForms.push(attendanceForm);
            }else if (/\d/.test(weeks[i])){
                let attendanceForm = this.AttendanceFormConstructor(classID, roomNumber, shift, startTime, endTime, this.generateWeekDate(i, firstWeekIndex, startDate));
                attendanceForms.push(attendanceForm);
            }
        }
        return attendanceForms;
    }
    
    generateClassesFromExcel = (worksheet, semesterID) => {
        let ClassMap = new Map();
        for (let rowIndex = 2; rowIndex <= worksheet.actualRowCount; rowIndex++){
            let row = worksheet.getRow(rowIndex);
            let classID = this.generateClassID(row.getCell(2).text, row.getCell(3).text, row.getCell(4).text, semesterID);
            if (!ClassMap.has(classID)){
                ClassMap.set(classID, this.generateClassesAndAttendanceForms(classID, semesterID, row));
            } else {
                let classes = ClassMap.get(classID);
                classes.attendanceForm = [...classes.attendanceForm, ...this.generateAttendanceForms(classID, row.getCell(8).text, row.getCell(9).text, row.getCell(11).text, JSDatetimeToMySQLDatetime(new Date(row.getCell(12).text)))]
                ClassMap.set(classID, classes);
            }
        }
        return Array.from(ClassMap.values());
    }

    generateStudentClassFromExcel = (worksheet, semesterID) => {
        let studentClassArray = [];
        for (let rowIndex = 2; rowIndex <= worksheet.actualRowCount; rowIndex++){
            let row = worksheet.getRow(rowIndex);
            let studentClass = new StudentClass();
            studentClass.classDetail = this.generateClassID(row.getCell(6), Number(row.getCell(8)).toString(), Number(row.getCell(9)).toString(), semesterID);
            studentClass.studentDetail = row.getCell(1).text;
            studentClassArray.push(studentClass);
        }
        return studentClassArray;
    }
}

export default new BusinessUtils();



