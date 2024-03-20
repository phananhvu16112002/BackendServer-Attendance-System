import Excel from "exceljs";

import { Course } from "../models/Course";
import { Teacher } from "../models/Teacher";
import { Student } from "../models/Student";
import { StudentClass } from "../models/StudentClass";

class ExcelService {
    uploadExcel = async () => {
        
    }

    checkInfo = (teacherID, teacherEmail) => {
        try{
            let prefix = teacherEmail.split("@");
            if (prefix[1] != "student.tdtu.edu.vn"){
              return false;
            }
            if (teacherID.toUpperCase() != prefix[0]){
              return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    readStudentsFromExcel = async (fileExcel) => {
        try {
            const buffer = fileExcel.data;
    
            const workbook = new Excel.Workbook();
            const content = await workbook.xlsx.load(buffer, { type: "buffer" });
            
            const worksheet = content.worksheets[0];
            let students = [];
            
            for (let rowIndex = 2; rowIndex < worksheet.rowCount - 1; rowIndex++){
                let row = worksheet.getRow(rowIndex);
                let student = new Student();
                student.studentID = row.getCell(1).text;
                student.studentName = row.getCell(2).text;
                student.studentEmail = row.getCell(3).text;
                console.log(student);
                if (this.checkInfo(student.studentID, student.studentEmail) == false){
                    return {data: [], error: `Error detected at row ${rowIndex}. Invalid data for studentID: ${student.studentID}, studentEmail: ${student.studentEmail}`};
                }
                students.push(student);
            }
    
            return {data: students, error: null};
        } catch (e) {
            console.log(e);
            return {data: [], error: "Error exporting students"};
        }
    }


    readTeachersFromExcel = async (fileExcel) => {
        try {
            const buffer = fileExcel.data;
    
            const workbook = new Excel.Workbook();
            const content = await workbook.xlsx.load(buffer, { type: "buffer" });
            
            const worksheet = content.worksheets[0];
            let teachers = [];
            
            for (let rowIndex = 2; rowIndex < worksheet.rowCount - 1; rowIndex++){
                let row = worksheet.getRow(rowIndex);
                let teacher = new Teacher();
                teacher.teacherID = row.getCell(1).text;
                teacher.teacherName = row.getCell(2).text;
                teacher.teacherEmail = row.getCell(3).text;
                console.log(teacher);
                if (this.checkInfo(teacher.teacherID, teacher.teacherEmail) == false){
                    return {data: [], error: `Error detected at row ${rowIndex}. Invalid data for teacherID: ${teacher.teacherID}, teacherEmail: ${teacher.teacherEmail}`};
                }
                teachers.push(teacher);
            }
    
            return {data: teachers, error: null};
        } catch (e) {
            console.log(e);
            return {data: [], error: "Error exporting teachers"};
        }
    }

    readCoursesFromExcel = async (fileExcel) => {
        try {
            const buffer = fileExcel.data;
    
            const workbook = new Excel.Workbook();
            const content = await workbook.xlsx.load(buffer, { type: "buffer" });
            
            const worksheet = content.worksheets[0];
            let courses = [];

            for (let rowIndex = 2; rowIndex < worksheet.rowCount - 1; rowIndex++){
                
                let row = worksheet.getRow(rowIndex);
                let course = new Course();
                course.courseID = row.getCell(1).text;
                course.courseName = row.getCell(2).text;
                course.totalWeeks = parseInt(row.getCell(3).text);
                course.requiredWeeks = parseInt(row.getCell(4).text);
                course.credit = parseInt(row.getCell(5).text);
                console.log(course);
                courses.push(course);
            }
            return {data: courses, error: null};
        } catch (e) {
            console.log(e);
            return {data: [], error: "Error exporting course"};
        }
    }

    //testable
    readStudentsInClassFromExcel = async (fileExcel, classID) => {
        try{
            const buffer = fileExcel.data;
    
            const workbook = new Excel.Workbook();
            const content = await workbook.xlsx.load(buffer, { type: "buffer" });
            
            const worksheet = content.worksheets[0];
            let studentClasses = [];

            for (let rowIndex = 2; rowIndex < worksheet.rowCount - 1; rowIndex++){
                
                let row = worksheet.getRow(rowIndex);
                let studentClass = new StudentClass();
                studentClass.studentDetail = row.getCell(1).text;
                studentClass.classDetail = classID;
                studentClasses.push(studentClass);
            }
            return {data: studentClasses, error: null};

        } catch (e) {
            console.log(e);
            return {data: [], error: "Error teacher to class"};
        }
    }
}

export default new ExcelService();