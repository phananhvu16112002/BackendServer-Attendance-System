import Excel from "exceljs";
import { Student } from "../models/Student";
import { Teacher } from "../models/Teacher";
import { Course } from "../models/Course";
import { StudentClass } from "../models/StudentClass";
class ExcelService {
    uploadExcel = async () => {
        
    }

    checkStudentInfo = (studentID, studentEmail) => {
        try{
            let prefix = studentEmail.split("@");
            if (prefix[1] != "student.tdtu.edu.vn"){
              return false;
            }
            if (studentID.toUpperCase() != prefix[0]){
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
                if (this.checkStudentInfo(student.studentID, student.studentEmail) == false){
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
    readStudentInClassFromExcel = async (fileExcel, classID) => {
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
            return {data: [], error: "Error student to class"};
        }
    }
}

export default new ExcelService();