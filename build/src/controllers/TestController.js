"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const Student_1 = require("../models/Student");
const Teacher_1 = require("../models/Teacher");
const Course_1 = require("../models/Course");
const Classes_1 = require("../models/Classes");
const StudentClass_1 = require("../models/StudentClass");
const db_config_1 = require("../config/db.config");
const TimeConvert_1 = require("../utils/TimeConvert");
const AttendanceForm_1 = require("../models/AttendanceForm");
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const UploadImageService_1 = __importDefault(require("../services/UploadImageService"));
const FaceMatchingService_1 = __importDefault(require("../services/FaceMatchingService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const StudentClassService_1 = __importDefault(require("../services/StudentClassService"));
const AttendanceFormService_1 = __importDefault(require("../services/AttendanceFormService"));
const AttendanceDetailService_1 = __importDefault(require("../services/AttendanceDetailService"));
const ClassService_1 = __importDefault(require("../services/ClassService"));
const uuid_1 = require("uuid");
const typeorm_1 = require("typeorm");
const AttendanceFormDTO_1 = __importDefault(require("../dto/AttendanceFormDTO"));
const exceljs_1 = __importDefault(require("exceljs"));
const imgur_1 = require("imgur");
const stream_1 = require("stream");
const StudentImage_1 = require("../models/StudentImage");
const StudentService_1 = __importDefault(require("../services/StudentService"));
const ExcelService_1 = __importDefault(require("../services/ExcelService"));
const studentImageRepository = db_config_1.AppDataSource.getRepository(StudentImage_1.StudentImage);
const classRepository = db_config_1.AppDataSource.getRepository(Classes_1.Classes);
const studentClassRepository = db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass);
const attendanceDetailRepository = db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail);
class BufferArrayToStream extends stream_1.Transform {
    constructor(buffers) {
        super({ objectMode: true });
        this._buffers = buffers;
        this._index = 0;
    }
    _transform(chunk, encoding, callback) {
        if (this._index < this._buffers.length) {
            this.push(this._buffers[this._index++]);
        }
        else {
            callback(); // Signal end of stream
        }
    }
}
class TransformToReadable extends stream_1.Readable {
    constructor(transformStream) {
        super();
        this._transformStream = transformStream;
        this._transformStream.on('data', (chunk) => this.push(chunk));
        this._transformStream.on('end', () => this.push(null));
    }
}
const secretKey = process.env.STUDENT_RESET_TOKEN_SECRET;
const client = new imgur_1.ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_CLIENT_REFRESH_TOKEN
});
class Test {
    constructor() {
        this.testCreateStudentTable = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let s1 = new Student_1.Student();
                s1.studentName = "Ho Tuan Kiet";
                s1.studentEmail = "520h0380@student.tdtu.edu.vn";
                s1.studentID = "520H0380";
                let s2 = new Student_1.Student();
                s2.studentName = "Phan Anh Vu";
                s2.studentEmail = "520h0696@student.tdtu.edu.vn";
                s2.studentID = "520h0696";
                let studentRepository = db_config_1.AppDataSource.getRepository(Student_1.Student);
                yield studentRepository.save(s1);
                yield studentRepository.save(s2);
                res.json("success");
            }
            catch (_a) {
                console.log("Error in the database");
                res.json("failed");
            }
        });
        this.testCreateCourseTable = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let c1 = new Course_1.Course();
                c1.courseID = "503111";
                c1.courseName = "Cross-platform Programming";
                c1.credit = 3;
                c1.requiredWeeks = 8;
                c1.totalWeeks = 10;
                let c2 = new Course_1.Course();
                c2.courseID = "502111";
                c2.courseName = "Introduction to programming";
                c2.credit = 3;
                c2.requiredWeeks = 8;
                c2.totalWeeks = 10;
                let courseRepository = db_config_1.AppDataSource.getRepository(Course_1.Course);
                yield courseRepository.save(c1);
                yield courseRepository.save(c2);
                res.json("success");
            }
            catch (_b) {
                console.log("Error in the database");
                res.json("failed");
            }
        });
        this.testCreateTeacherTable = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let t1 = new Teacher_1.Teacher();
                t1.teacherName = "Mai Van Manh";
                t1.teacherEmail = "maivanmanh@lecturer.tdtu.edu.vn";
                t1.teacherID = "333h222";
                let t2 = new Teacher_1.Teacher();
                t2.teacherName = "Manh Van Mai";
                t2.teacherEmail = "manhvanmai@lecturer.tdtu.edu.vn";
                t2.teacherID = "222h333";
                let teacherRepository = db_config_1.AppDataSource.getRepository(Teacher_1.Teacher);
                yield teacherRepository.save(t1);
                yield teacherRepository.save(t2);
                res.json("success");
            }
            catch (_c) {
                console.log("Error in the database");
                res.json("failed");
            }
        });
        this.testCreateClassTable = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                //Tao lop hoc
                ///Lop ly thuyet
                let classes = new Classes_1.Classes();
                classes.classID = "520300_09_t0133";
                classes.classType = "thesis";
                classes.course = yield db_config_1.AppDataSource.getRepository(Course_1.Course).findOneBy({ courseID: "502111" });
                classes.endTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
                classes.group = "09";
                classes.roomNumber = "A0503";
                classes.shiftNumber = "4";
                classes.startTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
                classes.subGroup = "08";
                classes.teacher = yield db_config_1.AppDataSource.getRepository(Teacher_1.Teacher).findOneBy({ teacherID: "222h333" });
                //Lop thuc hanh
                let classes2 = new Classes_1.Classes();
                classes2.classID = "5202111_09_t000";
                classes2.classType = "laboratory";
                classes2.course = yield db_config_1.AppDataSource.getRepository(Course_1.Course).findOneBy({ courseID: "502111" });
                classes2.endTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
                classes2.group = "09";
                classes2.roomNumber = "A0506";
                classes2.shiftNumber = "2";
                classes2.startTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
                classes2.subGroup = "00";
                classes2.teacher = yield db_config_1.AppDataSource.getRepository(Teacher_1.Teacher).findOneBy({ teacherID: "222h333" });
                let classRepository = db_config_1.AppDataSource.getRepository(Classes_1.Classes);
                yield classRepository.save(classes);
                yield classRepository.save(classes2);
                //Ket noi student va class trong StudentClass
                let studentClass = new StudentClass_1.StudentClass();
                studentClass.studentDetail = yield db_config_1.AppDataSource.getRepository(Student_1.Student).findOneBy({ studentID: "520H0696" });
                studentClass.classDetail = classes;
                let studentClass2 = new StudentClass_1.StudentClass();
                studentClass2.studentDetail = yield db_config_1.AppDataSource.getRepository(Student_1.Student).findOneBy({ studentID: "520H0696" });
                studentClass2.classDetail = classes2;
                // let studentClass3 = new StudentClass()
                // studentClass3.studentDetail = 
                // studentClass3.classDetail = classes2
                yield db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass).save(studentClass);
                yield db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass).save(studentClass2);
                res.status(200).json("success");
            }
            catch (_d) {
                console.log("Error in the database");
                res.json("failed");
            }
        });
        this.testCreateFormTable = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //form diem danh lan 1 cua lop 520300_09_t0133
            let attendanceForm = new AttendanceForm_1.AttendanceForm();
            attendanceForm.formID = "formID1";
            attendanceForm.classes = yield db_config_1.AppDataSource.getRepository(Classes_1.Classes).findOneBy({ classID: "520300_09_t0133" });
            attendanceForm.status = true;
            attendanceForm.weekNumber = 1;
            attendanceForm.dateOpen = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
            attendanceForm.startTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
            attendanceForm.endTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
            //form diem danh lan 2 cua lop 520300_09_t0133
            let attendanceForm2 = new AttendanceForm_1.AttendanceForm();
            attendanceForm2.formID = "formID2";
            attendanceForm2.classes = yield db_config_1.AppDataSource.getRepository(Classes_1.Classes).findOneBy({ classID: "520300_09_t0133" });
            attendanceForm2.status = true;
            attendanceForm2.weekNumber = 2;
            attendanceForm2.dateOpen = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
            attendanceForm2.startTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
            attendanceForm2.endTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
            yield db_config_1.AppDataSource.getRepository(AttendanceForm_1.AttendanceForm).save(attendanceForm);
            yield db_config_1.AppDataSource.getRepository(AttendanceForm_1.AttendanceForm).save(attendanceForm2);
            res.json("success");
        });
        this.testTakeAttendance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let student = yield db_config_1.AppDataSource.getRepository(Student_1.Student).findOneBy({ studentID: "520H0380" });
            let classes = yield db_config_1.AppDataSource.getRepository(Classes_1.Classes).findOneBy({ classID: "520300_09_t0133" });
            let studentClass = yield db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass).findOneBy({ studentDetail: "520H0380", classDetail: "520300_09_t0133" });
            //Take attendance formID1 cua sinh vien 520H0380 trong lop 520300_09_t0133
            let date = new Date();
            let attendanceDetail = new AttendanceDetail_1.AttendanceDetail();
            attendanceDetail.dateAttendanced = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(date);
            attendanceDetail.classDetail = "520300_09_t0133";
            attendanceDetail.studentDetail = "520H0380";
            attendanceDetail.attendanceForm = yield db_config_1.AppDataSource.getRepository(AttendanceForm_1.AttendanceForm).findOneBy({ formID: "formID1" });
            //Take attendance formID2
            let date2 = new Date();
            let attendanceDetail2 = new AttendanceDetail_1.AttendanceDetail();
            attendanceDetail2.dateAttendanced = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(date2);
            attendanceDetail2.classDetail = "520300_09_t0133";
            attendanceDetail2.studentDetail = "520H0380";
            attendanceDetail2.attendanceForm = yield db_config_1.AppDataSource.getRepository(AttendanceForm_1.AttendanceForm).findOneBy({ formID: "formID2" });
            yield db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail).save(attendanceDetail);
            yield db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail).save(attendanceDetail2);
            res.status(200).json("success");
        });
        this.testGetStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let st = yield db_config_1.AppDataSource.getRepository(Student_1.Student).findOne({ where: { studentID: "520H0380" }, relations: { studentClass: true } });
            console.log(st);
            res.json(st);
        });
        this.testGetTeacher = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let teacher = yield db_config_1.AppDataSource.getRepository(Teacher_1.Teacher).findOne({ where: { teacherID: "333h222" }, relations: { classes: true } });
            console.log(teacher);
            res.json(teacher);
        });
        this.testGetCourse = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let course = yield db_config_1.AppDataSource.getRepository(Course_1.Course).findOne({ where: { courseID: "503111" }, relations: { classes: true } });
            console.log(course);
            res.json(course);
        });
        this.testGetClasses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let classes = yield db_config_1.AppDataSource.getRepository(Classes_1.Classes).findOne({ where: { classID: "520300_09_t0133" }, relations: { studentClass: true, teacher: true, course: true } });
            classes.startTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date(classes.startTime));
            classes.endTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date(classes.endTime));
            console.log(classes);
            res.json(classes);
        });
        this.testGetStudentClasses = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let student = yield db_config_1.AppDataSource.getRepository(Student_1.Student).findOneBy({ studentID: "520H0380" });
            let studentClass = yield db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass).find({ where: { studentDetail: student.studentID }, relations: { classDetail: true } });
            for (let i = 0; i < studentClass.length; i++) {
                let object = studentClass[i].classDetail;
                let classes = yield db_config_1.AppDataSource.getRepository(Classes_1.Classes).findOne({ where: {
                        classID: object.classID
                    },
                    select: {
                        teacher: {
                            teacherID: true,
                            teacherEmail: true,
                            teacherName: true
                        },
                        course: true,
                    },
                    relations: {
                        teacher: true,
                        course: true
                    }
                });
                classes.startTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date(classes.startTime));
                classes.endTime = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date(classes.endTime));
                studentClass[i].classDetail = classes;
            }
            res.status(200).json(studentClass);
        });
        this.testGetAttendanceDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let student = yield db_config_1.AppDataSource.getRepository(Student_1.Student).findOneBy({ studentID: "520H0380" });
            let classes = yield db_config_1.AppDataSource.getRepository(Classes_1.Classes).findOneBy({ classID: "520300_09_t0133" });
            let studentClass = yield db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass).findOneBy({ studentDetail: student.studentID, classDetail: classes.classID });
            let attendanceDetail = yield db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail).find({ where: { studentDetail: studentClass.studentID, classes: studentClass.classID }, relations: { studentDetail: true } });
            for (let i = 0; i < attendanceDetail.length; i++) {
                attendanceDetail[i].dateAttendanced = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date(attendanceDetail[i].dateAttendanced));
            }
            res.status(200).json(attendanceDetail);
        });
        this.testUpload = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield UploadImageService_1.default.uploadFiles(req.files);
            res.json({ message: "Upload success" });
        });
        this.testDelete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield UploadImageService_1.default.deleteFiles("520H0380");
            res.json({ message: "Delete success" });
        });
        //Test token here 
        // create access token and refresh token for student
        // localhost:8080/test/testCreateAccessTokenAndRefreshTokenForStudent
        // send POST method, studentID
        this.testCreateAccessTokenAndRefreshTokenForStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let studentID = req.body.studentID;
            let role = "student";
            try {
                const accessToken = jsonwebtoken_1.default.sign({ userID: studentID, role: role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });
                const refreshToken = jsonwebtoken_1.default.sign({ userID: studentID, role: role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
                res.status(200).json({ message: "Student Login Successfully", accessToken, refreshToken });
            }
            catch (_e) {
                res.staus(500).json({ message: "Login Failed" });
            }
        });
        this.testCreateAccessTokenAndRefreshTokenForTeacher = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let teacherID = req.body.teacherID;
            let role = "teacher";
            try {
                const accessToken = jsonwebtoken_1.default.sign({ userID: teacherID, role: role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
                const refreshToken = jsonwebtoken_1.default.sign({ userID: teacherID, role: role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
                res.status(200).json({ message: "Teacher Login Successfully", accessToken, refreshToken });
            }
            catch (_f) {
                res.staus(500).json({ message: "Login Failed" });
            }
        });
        this.testCreateAccessTokenAndRefreshTokenForAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let teacherID = req.body.teacherID;
            let role = "admin";
            try {
                const accessToken = jsonwebtoken_1.default.sign({ userID: teacherID, role: role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
                const refreshToken = jsonwebtoken_1.default.sign({ userID: teacherID, role: role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' });
                res.status(200).json({ message: "Teacher Login Successfully", accessToken, refreshToken });
            }
            catch (_g) {
                res.staus(500).json({ message: "Login Failed" });
            }
        });
        //localhost:8080/test/testVerifyAccessToken
        //send Post method, header access token
        this.testVerifyAccessToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const accessToken = req.headers.authorization;
                if (!accessToken) {
                    return res.status(498).json({ message: 'Access Token is not provided' });
                }
                else {
                    const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                    req.user = decoded;
                    return res.status(200).json(req.user);
                }
            }
            catch (e) {
                if (e.message == "invalid token") {
                    return res.status(498).json({ message: 'Access Token is invalid' }); //Flutter recieved 498, send error message to client
                }
                else if (e.message == "jwt expired") {
                    return res.status(401).json({ message: 'Access Token is expired' }); //Flutter recieved 401, immediately send a refresh token to refresh new access token
                }
                else {
                    return res.status(500).json({ message: e.message });
                }
            }
        });
        //localhost:8080/test/testRefreshAccessToken
        //send Post method, header refresh token
        this.testRefreshAccessToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.headers.authorization;
                if (!refreshToken) {
                    return res.status(498).json({ message: "Refresh Token is not provided" });
                }
                else {
                    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    req.user = decoded;
                    let userID = decoded.studentID;
                    let role = decoded.role;
                    const accessToken = jsonwebtoken_1.default.sign({ userID, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '45s' });
                    return res.status(200).json({ message: "Access Token Successfully Refreshed", accessToken });
                }
            }
            catch (e) {
                if (e.message == "invalid token") {
                    return res.status(498).json({ message: 'Refresh Token is invalid' }); //Flutter recieved 498, send error message to client
                }
                else if (e.message == "jwt expired") {
                    return res.status(401).json({ message: 'Refresh Token is expired' }); //Flutter recieved 401, immediately send a refresh token to refresh new access token
                }
                else {
                    return res.status(500).json({ message: e.message });
                }
            }
        });
        this.getStudentClass = (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.json(yield StudentClassService_1.default.getStudentClass("520H0380", "5202111_09_t000"));
        });
        this.createAttendanceForm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let classes = yield ClassService_1.default.getAllStudentsByClassID("5202111_09_t000");
            let listOfStudentClass = classes.studentClass;
            const id = (0, uuid_1.v4)();
            let attendanceForm = yield AttendanceFormService_1.default.createFormEntity(classes, (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date()), (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date()), (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date()), 1);
            let attendanceDetail = yield AttendanceDetailService_1.default.createDefaultAttendanceDetailEntitiesForStudents(listOfStudentClass, attendanceForm);
            const form = yield AttendanceFormService_1.default.createFormTransaction(attendanceForm, attendanceDetail);
            res.json(AttendanceFormDTO_1.default.excludeClasses(form));
        });
        this.createAttendanceDetail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let studentClass = yield StudentClassService_1.default.getStudentClass("520H0380", "5202111_09_t000");
            let attendanceForm = yield AttendanceFormService_1.default.getFormByID("7aeed109-2b1d-4b06-b4d0-926b926f626e");
            res.json(yield AttendanceDetailService_1.default.createAttendanceDetail(studentClass, attendanceForm, "VN"));
        });
        this.testEndpoint = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //console.log(await StudentClassService.getStudentsByClassID("5202111_09_t000"));
            //let classes = await ClassService.getClassByID("5202111_09_t000");
            let classes = yield ClassService_1.default.getAllStudentsByClassID("5202111_09_t000");
            console.log(classes.studentClass[0].studentDetail.studentID);
            res.json();
        });
        this.testImgur = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.files.file);
            yield FaceMatchingService_1.default.checkFacesTheSame(req.files.file);
            res.json({ message: "oke" });
            //res.json(await UploadImageService.uploadAttendanceEvidenceFile(req.files.file)); 
        });
        this.uploadExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const excelFile = req.files.file;
            // let {data, error} = await ExcelService.readStudentsFromExcel(excelFile);
            // console.log(data, error);
            // let {data: result, error: err} = await StudentService.loadStudentsToDatabase(data);
            // console.log(result, err);
            console.log(excelFile);
            let { data, error } = yield ExcelService_1.default.readCoursesFromExcel(excelFile);
            console.log(data);
            console.log("error: " + error);
            res.json({ message: "done" });
            // const buffer = excelFile.data;
            // const workbook = new Excel.Workbook();
            // const content = await workbook.xlsx.load(buffer, { type: "buffer" });
            // const worksheet = content.worksheets[0];
            // worksheet.eachRow((row, rowNumber) => {
            //     console.log(rowNumber);
            //     let student = new Student();
            //     student.studentID = row.getCell(1).text;
            //     student.studentName = row.getCell(2).text;
            //     student.studentEmail = row.getCell(3).text;
            //     console.log(student);
            // })
            // res.json({message: "Oke"});
        });
        this.uploadMultipleFiles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentId = req.body.studentID;
            const files = req.files.files;
            console.log(files);
            const images = [];
            let student = yield StudentService_1.default.checkStudentExist(studentId);
            if (student == null) {
                return res.json({ message: "Student with id does not exist" });
            }
            // if (student.active == false){
            //     return res.json({message: "Student is not active"});
            // }
            //Array of buffers
            for (let i = 0; i < files.length; i++) {
                let response = yield client.upload({
                    image: files[i].data,
                });
                if (response == null) {
                    return res.json({ message: "Call api failed" });
                }
                let payload = response.data;
                if (payload != null) {
                    let id = payload.id;
                    let url = payload.link;
                    let studentImage = new StudentImage_1.StudentImage();
                    studentImage.imageHash = id;
                    studentImage.imageURL = url;
                    studentImage.studentID = student;
                    yield studentImageRepository.save(studentImage);
                }
            }
            res.status(200).json({ message: "oke" });
        });
        this.fetchImage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield client.getImage("loYz6HE");
            console.log(data);
            res.json({ message: "oke" });
        });
        this.testGetClassesVersion1 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentID = req.body.studentID;
            const studentClasses = yield studentClassRepository.find({
                where: { studentDetail: studentID },
                select: {
                    studentDetail: {
                        studentID: true,
                    },
                    classDetail: {
                        classID: true,
                        roomNumber: true,
                        shiftNumber: true,
                        classType: true,
                        group: true,
                        subGroup: true,
                        teacher: {
                            teacherID: true,
                            teacherName: true,
                        },
                        course: {
                            courseID: true,
                            courseName: true,
                            totalWeeks: true,
                        }
                    }
                },
                relations: {
                    studentDetail: true,
                    classDetail: {
                        teacher: true,
                        course: true,
                    }
                }
            });
            for (let i in studentClasses) {
                console.log("Current studentClass object:", studentClasses[i]); // Log the entire object
                const total = yield attendanceDetailRepository.countBy({
                    studentDetail: studentClasses[i].studentDetail.studentID,
                    classDetail: studentClasses[i].classDetail.classID,
                });
                let totalPresence = 0;
                let totalLate = 0;
                let totalAbsence = 0;
                yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    totalPresence = yield attendanceDetailRepository.countBy({
                        studentDetail: studentClasses[i].studentDetail.studentID,
                        classDetail: studentClasses[i].classDetail.classID,
                        result: 1
                    });
                    totalLate = yield attendanceDetailRepository.countBy({
                        studentDetail: studentClasses[i].studentDetail.studentID,
                        classDetail: studentClasses[i].classDetail.classID,
                        result: 0.5
                    });
                    totalAbsence = yield attendanceDetailRepository.countBy({
                        studentDetail: studentClasses[i].studentDetail.studentID,
                        classDetail: studentClasses[i].classDetail.classID,
                        result: 0
                    });
                }));
                console.log(totalPresence, totalLate, totalAbsence);
                const progress = (total / studentClasses[i].classDetail.course.totalWeeks);
                studentClasses[i].progress = progress;
                studentClasses[i].total = total;
                studentClasses[i].totalPresence = totalPresence;
                studentClasses[i].totalAbsence = totalAbsence;
                studentClasses[i].totalLate = totalLate;
                console.log(studentClasses[i].totalPresence);
            }
            res.status(200).json(studentClasses);
        });
        this.testGetAttendanceDetailVersion1 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const studentID = req.body.studentID;
            const classID = req.body.classID;
            const attendanceDetails = yield attendanceDetailRepository.find({
                where: {
                    studentClass: {
                        studentDetail: studentID,
                        classDetail: classID
                    }
                },
                relations: {
                    attendanceForm: true
                },
                order: {
                    dateAttendanced: {
                        direction: "DESC"
                    }
                }
            });
            for (let i in attendanceDetails) {
                // Log the entire object
                const total = yield attendanceDetailRepository.countBy({
                    studentDetail: attendanceDetails[i].studentDetail.studentID,
                    classDetail: attendanceDetails[i].classDetail.classID,
                });
                let totalPresence = 0;
                let totalLate = 0;
                let totalAbsence = 0;
                yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    totalPresence = yield attendanceDetailRepository.countBy({
                        studentDetail: attendanceDetails[i].studentDetail.studentID,
                        classDetail: attendanceDetails[i].classDetail.classID,
                        result: 1
                    });
                    totalLate = yield attendanceDetailRepository.countBy({
                        studentDetail: attendanceDetails[i].studentDetail.studentID,
                        classDetail: attendanceDetails[i].classDetail.classID,
                        result: 0.5
                    });
                    totalAbsence = yield attendanceDetailRepository.countBy({
                        studentDetail: attendanceDetails[i].studentDetail.studentID,
                        classDetail: attendanceDetails[i].classDetail.classID,
                        result: 0
                    });
                }));
                console.log(totalPresence, totalLate, totalAbsence);
                console.log("Test double: " + parseFloat(totalPresence + ".0"));
                // const progress = (total / attendanceDetails[i].classDetail.course.totalWeeks);
                console.log('Total Attendance:', typeof total);
                console.log("Total attendance:", total);
                // console.log("Progress:", progress)
                console.log("TotalPresence", `${totalPresence}.0`),
                    console.log("totalAbsence", `${totalAbsence}.0`),
                    console.log("totalLate", `${totalLate}.0`),
                    // attendanceDetails[i].progress = progress;
                    attendanceDetails[i].total = `${total}.0`;
                attendanceDetails[i].totalPresence = `${totalPresence}.0`;
                attendanceDetails[i].totalAbsence = `${totalAbsence}.0`;
                attendanceDetails[i].totalLate = `${totalLate}.0`;
                console.log(attendanceDetails[i].totalPresence);
            }
            res.status(200).json(attendanceDetails);
        });
        this.testOffline = (req, res) => {
            res.status(200).json({ messsage: "Hello" });
        };
    }
}
exports.default = new Test();
