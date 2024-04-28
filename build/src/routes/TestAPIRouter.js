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
const express_1 = __importDefault(require("express"));
const db_config_1 = require("../config/db.config");
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const StudentClass_1 = require("../models/StudentClass");
const Classes_1 = require("../models/Classes");
const AttendanceForm_1 = require("../models/AttendanceForm");
const ClassService_1 = __importDefault(require("../services/ClassService"));
const Course_1 = require("../models/Course");
const Teacher_1 = require("../models/Teacher");
const Student_1 = require("../models/Student");
const TeacherRouter_1 = __importDefault(require("./TeacherRouter"));
const UploadImageService_1 = __importDefault(require("../services/UploadImageService"));
const ReportImageService_1 = __importDefault(require("../services/ReportImageService"));
const Employee_1 = require("../models/Employee");
const StudentClassService_1 = __importDefault(require("../services/StudentClassService"));
const typeorm_1 = require("typeorm");
const notification_config_1 = __importDefault(require("../config/notification.config"));
const Report_1 = require("../models/Report");
const Feedback_1 = require("../models/Feedback");
const attendanceDetailRepository = db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail);
const studentClassRepository = db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass);
const classRepository = db_config_1.AppDataSource.getRepository(Classes_1.Classes);
const attendanceFormRepository = db_config_1.AppDataSource.getRepository(AttendanceForm_1.AttendanceForm);
const reportRepository = db_config_1.AppDataSource.getRepository(Report_1.Report);
const studentRepository = db_config_1.AppDataSource.getRepository(Student_1.Student);
const courseRepository = db_config_1.AppDataSource.getRepository(Course_1.Course);
const teacherRepository = db_config_1.AppDataSource.getRepository(Teacher_1.Teacher);
const feedbackRepository = db_config_1.AppDataSource.getRepository(Feedback_1.Feedback);
const TestAPIRouter = express_1.default.Router();
TestAPIRouter.get("/data", (req, res) => {
    const data = [
        { id: 1, name: "T.rex" },
        { id: 2, name: "Triceratops" }
    ];
    res.status(200).json(data);
});
TestAPIRouter.get("/", (req, res) => {
    res.send("index.html");
});
TestAPIRouter.get("/detail/:id", (req, res) => {
    const id = req.params.id;
    const data = [
        { id: 1, name: "T.rex" },
        { id: 2, name: "Triceratops" }
    ];
    res.status(200).json(data.at(id - 1));
});
TestAPIRouter.get("/attendanceDetail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classID = req.query.classID;
    const studentID = "520H0380";
    const result = yield attendanceDetailRepository.find({ where: {
            studentDetail: studentID,
            classDetail: classID,
        },
        select: {
            result: true,
            dateAttendanced: true,
            location: true,
            note: true,
            latitude: true,
            longitude: true,
            url: true,
            attendanceForm: {
                formID: true,
                status: true,
                type: true,
                status: true,
                startTime: true,
                endTime: true,
                classes: {
                    roomNumber: true,
                    shiftNumber: true,
                    startTime: true,
                    endTime: true,
                    classType: true,
                    group: true,
                    subGroup: true,
                    course: {
                        courseID: true,
                        courseName: true
                    }
                }
            },
        },
        relations: {
            attendanceForm: {
                classes: {
                    course: true
                }
            }
        }
    });
    res.json(result);
}));
// 6th pass, 7th ban, 15th warning, 11 th tuan kiet waning
TestAPIRouter.get("/getStudentFakeAPI", (req, res) => {
    let data = [];
    let a = {
        studentDetail: {
            studentID: "a",
            studentName: "a",
            studentEmail: "a",
        },
        attendanceDetail: [
            {
                attendanceForm: "fa80bf1f-7256-4ffd-9550-b6a1656c6997",
                result: 1,
                dateAttendanced: "2024-01-17T14:15:00.000Z",
                location: "Ton Duc Thang",
                note: "",
                url: "https://i.imgur.com/4bSNcPK.jpg"
            },
            {
                attendanceForm: "fa80bf1f-7256-4ffd-9550-b6a1656c6997",
                result: 1,
                dateAttendanced: "2024-01-17T14:15:00.000Z",
                location: "Ton Duc Thang",
                note: "",
                url: "https://i.imgur.com/4bSNcPK.jpg"
            },
            {
                attendanceForm: "fa80bf1f-7256-4ffd-9550-b6a1656c6997",
                result: 1,
                dateAttendanced: "2024-01-17T14:15:00.000Z",
                location: "Ton Duc Thang",
                note: "",
                url: "https://i.imgur.com/4bSNcPK.jpg"
            },
            {
                attendanceForm: "fa80bf1f-7256-4ffd-9550-b6a1656c6997",
                result: 1,
                dateAttendanced: "2024-01-17T14:15:00.000Z",
                location: "Ton Duc Thang",
                note: "",
                url: "https://i.imgur.com/4bSNcPK.jpg"
            },
        ],
        status: "Pass",
    };
    for (let passIndex = 0; passIndex < 6; passIndex++) {
        let temp = JSON.parse(JSON.stringify(a));
        temp.studentDetail.studentID = passIndex + "id";
        temp.studentDetail.studentEmail = passIndex + "email";
        temp.studentDetail.studentName = passIndex + "name";
        temp.attendanceDetail[0].result = 1;
        temp.attendanceDetail[1].result = 1;
        temp.attendanceDetail[2].result = 1;
        temp.attendanceDetail[3].result = 1;
        temp.status = "Pass";
        data.push(temp);
    }
    for (let i = 0; i < 7; i++) {
        let temp = JSON.parse(JSON.stringify(a));
        temp.studentDetail.studentID = i + "id";
        temp.studentDetail.studentEmail = i + "email";
        temp.studentDetail.studentName = i + "name";
        temp.attendanceDetail[0].result = 1;
        temp.attendanceDetail[1].result = 1;
        temp.attendanceDetail[2].result = 0;
        temp.attendanceDetail[3].result = 0;
        temp.status = "Ban";
        data.push(temp);
    }
    for (let warningIndex = 0; warningIndex < 4; warningIndex++) {
        let temp = JSON.parse(JSON.stringify(a));
        temp.studentDetail.studentID = warningIndex + "id";
        temp.studentDetail.studentEmail = warningIndex + "email";
        temp.studentDetail.studentName = warningIndex + "name";
        temp.attendanceDetail[0].result = 0;
        temp.attendanceDetail[1].result = 1;
        temp.attendanceDetail[2].result = 1;
        temp.attendanceDetail[3].result = 1;
        temp.status = "Warning";
        data.push(temp);
    }
    for (let trungTen = 0; trungTen < 11; trungTen++) {
        let temp = JSON.parse(JSON.stringify(a));
        temp.studentDetail.studentID = trungTen + "id";
        temp.studentDetail.studentEmail = trungTen + "email";
        temp.studentDetail.studentName = "Ho Tuan Kiet";
        temp.attendanceDetail[0].result = 0;
        temp.attendanceDetail[1].result = 1;
        temp.attendanceDetail[2].result = 1;
        temp.attendanceDetail[3].result = 1;
        temp.status = "Warning";
        data.push(temp);
    }
    let result = { data: data, all: 28, pass: 6, ban: 7, warning: 11 };
    return res.status(200).json(result);
});
TestAPIRouter.get("/getStudentsAttendanceDetailsRecords", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classID = req.query.classID;
    const formID = req.query.formID;
    const attendanceForm = yield attendanceFormRepository.findOne({ where: {
            formID: formID,
            classes: {
                classID: classID
            }
        } });
    const attendanceDetails = yield attendanceDetailRepository.find({ where: {
            attendanceForm: attendanceForm.formID,
        } });
    res.status(200).json({ attendanceForm, attendanceDetails });
}));
////////////////////////////////////////////////////////////////////
TestAPIRouter.get("/fakeAttendanceDetailsRecord", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classID = req.query.classID || "";
    const formID = req.query.formID || "";
    let attendanceDetails = [];
    for (let i = 10; i < 35; i++) {
        let id = "520H03" + i;
        let a = {
            studentDetail: id,
            classDetail: classID,
            attendanceForm: formID,
            result: 0,
            dateAttendanced: "2024-03-03T10:57:55.000Z",
            location: "",
            note: "",
            latitude: 0,
            longitude: 0,
            url: "",
        };
        attendanceDetails.push(a);
    }
    res.status(200).json({ data: attendanceDetails, all: attendanceDetails.length, present: 0, absent: attendanceDetails.length, late: 0 });
}));
TestAPIRouter.get("/fakeAttendanceDetailsRecordWith7Presence", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classID = req.query.classID || "";
    const formID = req.query.formID || "";
    let attendanceDetails = [];
    for (let i = 10; i < 35; i++) {
        let id = "520H03" + i;
        let a = {
            studentDetail: id,
            classDetail: classID,
            attendanceForm: formID,
            result: 0,
            dateAttendanced: "2024-03-03T10:57:55.000Z",
            location: "",
            note: "",
            latitude: 0,
            longitude: 0,
            url: "",
        };
        attendanceDetails.push(a);
    }
    attendanceDetails[0].result = 1;
    attendanceDetails[5].result = 1;
    attendanceDetails[6].result = 1;
    attendanceDetails[8].result = 1;
    attendanceDetails[9].result = 1;
    attendanceDetails[11].result = 1;
    attendanceDetails[16].result = 1;
    res.status(200).json({ data: attendanceDetails, all: attendanceDetails.length, present: 7, absent: attendanceDetails.length - 7, late: 0 });
}));
TestAPIRouter.get("/fakeAttendanceDetailsRecordWith7PresenceAnd2Late", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classID = req.query.classID || "";
    const formID = req.query.formID || "";
    let attendanceDetails = [];
    for (let i = 10; i < 35; i++) {
        let id = "520H03" + i;
        let a = {
            studentDetail: id,
            classDetail: classID,
            attendanceForm: formID,
            result: 0,
            dateAttendanced: "2024-03-03T10:57:55.000Z",
            location: "",
            note: "",
            latitude: 0,
            longitude: 0,
            url: "",
        };
        attendanceDetails.push(a);
    }
    attendanceDetails[0].result = 1;
    attendanceDetails[5].result = 1;
    attendanceDetails[6].result = 1;
    attendanceDetails[8].result = 1;
    attendanceDetails[9].result = 1;
    attendanceDetails[11].result = 1;
    attendanceDetails[16].result = 1;
    attendanceDetails[12].result = 0.5;
    attendanceDetails[20].result = 0.5;
    res.status(200).json({ data: attendanceDetails, all: attendanceDetails.length, present: 7, absent: attendanceDetails.length - 9, late: 2 });
}));
///////////////////////////////////////////////////////////////////
TestAPIRouter.get("/getStudentsAttendanceDetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classID = yield classRepository.findOne({ where: { classID: '520300_09_t0133' }, relations: { course: true } });
    const result = yield studentClassRepository.find({
        where: {
            classDetail: classID.classID
        },
        select: {
            studentDetail: {
                studentID: true,
                studentEmail: true,
                studentName: true,
            }
        },
        relations: {
            studentDetail: true,
        }
    });
    let finalResult = [];
    yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
        for (let index = 0; index < result.length; index++) {
            let fetch = yield attendanceDetailRepository.find({
                where: {
                    studentDetail: result[index].studentDetail.studentID,
                    classDetail: result[index].classDetail
                },
                select: {
                    attendanceForm: true,
                    result: true,
                    dateAttendanced: true,
                    location: true,
                    note: true,
                    url: true
                }
            });
            result[index].attendanceDetail = fetch;
            let sum = 0;
            for (let id = 0; id < fetch.length; id++) {
                if (fetch[id].result == 0) {
                    sum += 1;
                }
                else if (fetch[id].result == 0.5) {
                    sum += 0.5;
                }
            }
            let status;
            if (sum > (classID.course.totalWeeks - classID.course.requiredWeeks)) {
                status = "Ban";
            }
            else if (sum == (classID.course.totalWeeks - classID.course.requiredWeeks)) {
                status = "Warning";
            }
            result[index].status = status;
            //result[index].status = fetch.map(f => {if (f.result != 1) return f.result})
            finalResult.push(result[index]);
        }
    }));
    let final = [];
    for (let i = 0; i < 25; i++) {
        final.push(finalResult[0]);
    }
    return res.status(200).json({ data: final, all: 0, pass: 0, ban: 0, warning: 0 });
}));
TestAPIRouter.post("/feedback", (req, res) => {
    //edit student attendance detail
    //update the report status
    //add the feedback 
});
TestAPIRouter.post("/edit", (req, res) => {
    //edit student attendance detail
    //add edition history
});
TestAPIRouter.get("/getClasses", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield classRepository.createQueryBuilder("classes").
        innerJoinAndMapMany('classes.studentClass', StudentClass_1.StudentClass, "studentclass", "studentclass.classID = classes.classID").
        innerJoinAndMapMany('studentclass.attendanceDetails', AttendanceDetail_1.AttendanceDetail, "attendancedetail", "attendancedetail.studentDetail = studentclass.studentID And attendancedetail.classDetail = studentclass.classID").
        orderBy('attendancedetail.dateAttendanced', 'ASC').
        where("classes.classID = :id", { id: 1 }).getOne();
    let data1 = yield classRepository.createQueryBuilder("classes").
        innerJoinAndMapMany('classes.studentClass', StudentClass_1.StudentClass, "studentclass", "studentclass.classID = classes.classID").
        select('classes.*').
        addSelect('COUNT(studentclass.studentID) as TotalStudents').
        groupBy('classes.classID').
        where("classes.classID = :id", { id: 1 }).getRawOne();
    ///oke for total presence, absence, late
    let data2 = yield studentClassRepository.createQueryBuilder("student_class").
        innerJoinAndMapOne('student_class.classDetail', Classes_1.Classes, 'classes', "student_class.classID = classes.classID").
        innerJoinAndMapOne('classes.course', Course_1.Course, 'course', "course.courseID = classes.courseID").
        innerJoinAndMapOne('classes.teacher', Teacher_1.Teacher, 'teacher', "classes.teacherID = teacher.teacherID").
        innerJoinAndMapMany('student_class.attendancedetails', AttendanceDetail_1.AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
        select('student_class.*').
        addSelect('COUNT(*) as Total').
        addSelect(`SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS TotalPresence`).
        addSelect(`SUM(CASE WHEN result = 0 THEN 1 ELSE 0 END) AS TotalAbsence`).
        addSelect(`SUM(CASE WHEN result = 0.5 THEN 1 else 0 END) AS TotalLate`).
        addSelect('classes.*').
        addSelect('course.*').
        addSelect('teacher.teacherID, teacher.teacherEmail ,teacher.teacherName').
        groupBy('student_class.classID').
        where("student_class.studentID = :id", { id: "520H0380" }).getRawMany();
    ////
    ///Oke use in home page teacher
    let data3 = yield studentClassRepository.createQueryBuilder("student_class").
        innerJoin(AttendanceDetail_1.AttendanceDetail, "attendancedetails", "attendancedetails.studentID = student_class.studentID AND student_class.classID = attendancedetails.classDetail").
        innerJoinAndMapMany('student_class.attendancedetails', AttendanceDetail_1.AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
        select('student_class.*').
        addSelect('COUNT(attendancedetails.studentDetail) as Total').
        addSelect(`SUM(CASE WHEN attendancedetails.result = 1 THEN 1 ELSE 0 END) AS TotalPresence`).
        addSelect(`SUM(CASE WHEN attendancedetails.result = 0 THEN 1 ELSE 0 END) AS TotalAbsence`).
        addSelect(`SUM(CASE WHEN attendancedetails.result = 0.5 THEN 1 else 0 END) AS TotalLate`).
        groupBy('student_class.studentID, attendancedetails.formID').
        addSelect('attendancedetails.*').
        //will be order by created date
        orderBy('student_class.studentID', 'ASC').addOrderBy('attendancedetails.dateAttendanced', 'ASC').
        //orderBy('attendancedetails.dateAttendanced', 'ASC').addOrderBy('student_class.studentID', 'ASC').
        where("student_class.classID = :id", { id: "1" }).getRawMany();
    // innerJoinAndMapMany('classes.studentClass', StudentClass, "studentclass", "studentclass.classID = classes.classID").
    // innerJoinAndMapMany('studentclass.attendanceDetails', AttendanceDetail, "attendancedetail", "attendancedetail.studentDetail = studentclass.studentID And attendancedetail.classDetail = studentclass.classID").
    // orderBy('attendancedetail.dateAttendanced', 'ASC').
    // where("classes.classID = :id", {id : 1}).getRawMany();
    let list = [];
    function transformStudentClassDTO(data) {
        return {
            studentID: data.studentID,
            total: data.Total,
            totalPresence: data.TotalPresence,
            totalAbsence: data.TotalAbsence,
            totalLate: data.TotalLate,
            attendanceDetails: []
        };
    }
    function transformAttendanceDetailDTO(data) {
        return {
            formID: data.formID,
            dateAttendanced: data.dateAttendanced,
            location: data.location,
            note: data.note,
            latitude: data.latitude,
            longitude: data.longitude,
            result: data.result,
            url: data.url
        };
    }
    let temp;
    for (let i = 0; i < data3.length; i++) {
        if (list.length == 0) {
            temp = transformStudentClassDTO(data3[i]);
            temp.attendanceDetails.push(transformAttendanceDetailDTO(data3[i]));
            list.push(temp);
        }
        else if (temp.studentID == data3[i].studentID) {
            temp.attendanceDetails.push(transformAttendanceDetailDTO(data3[i]));
        }
        else {
            temp = transformStudentClassDTO(data3[i]);
            temp.attendanceDetails.push(transformAttendanceDetailDTO(data3[i]));
            list.push(temp);
        }
    }
    //innerJoin(AttendanceDetail, "attendancedetails", "attendancedetails.studentID = student_class.studentID AND student_class.classID = attendancedetails.classDetail").
    let data4 = yield attendanceDetailRepository.createQueryBuilder("attendancedetail").
        innerJoin(Student_1.Student, "student", "student.studentID = attendancedetail.studentID").
        select("student.studentID, student.studentName").
        addSelect('attendancedetail.*').
        where("attendancedetail.formID = :id", { id: 1 }).getRawMany();
    // total week 10, required week 8, (10 - 8) = 2 
    // total date now = 1  
    // absence = 1 (warning)
    // late = 1 
    let data5 = yield studentClassRepository.createQueryBuilder("student_class").
        //innerJoin(AttendanceDetail, "attendancedetails", "attendancedetails.studentID = student_class.studentID AND student_class.classID = attendancedetails.classDetail").
        innerJoinAndMapMany('student_class.attendancedetails', AttendanceDetail_1.AttendanceDetail, "attendancedetail", "attendancedetail.studentID = student_class.studentID AND student_class.classID = attendancedetail.classDetail").
        //select('student_class.*').addSelect('COUNT(attendancedetails.studentDetail) as Total').addSelect(`SUM(CASE WHEN attendancedetails.result = 1 THEN 1 ELSE 0 END) AS TotalPresence`,).
        //addSelect(`SUM(CASE WHEN attendancedetails.result = 0 THEN 1 ELSE 0 END) AS TotalAbsence`,).addSelect(`SUM(CASE WHEN attendancedetails.result = 0.5 THEN 1 else 0 END) AS TotalLate`,).
        //groupBy('student_class.studentID, attendancedetails.formID').addSelect('attendancedetails.*').
        //will be order by created date
        orderBy('attendancedetail.dateAttendanced', 'ASC').
        where("student_class.classID = :id", { id: '1' }).getMany();
    console.log(list);
    res.json(yield ClassService_1.default.getClassesWithStudentsCourseTeacher("1"));
    // let data = await classRepository.findOne({
    //     where: {
    //         classID: "1"
    //     }, 
    //     select: {
    //         teacher: {
    //             teacherID: true,
    //             teacherEmail: true,
    //             teacherName: true
    //         },
    //         studentClass: {
    //             studentDetail: {
    //                 studentID: true,
    //                 studentEmail: true,
    //                 studentName: true
    //             }
    //         }
    //     },
    //     relations: {
    //         teacher: true,
    //         course: true,
    //         studentClass: {
    //             studentDetail: true
    //         }
    //     }
    // });
    // res.json(data.studentClass);
}));
TestAPIRouter.post("/sendImage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(Object.keys(req.files));
    //let data = await ReportImageService.imageReportListFromImage(req.files);
    return res.json({ message: Object.keys(req.files).length });
}));
TestAPIRouter.post("/form", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    res.status(200).json();
}));
TestAPIRouter.get("/addOneStudent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let employee = new Employee_1.Employee();
    employee.employeeEmail = "1";
    employee.employeeHashedPassword = "available";
    yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionalEntityManager.createQueryBuilder().insert().into(Employee_1.Employee).values(employee).execute();
    }));
    res.json({ message: "oke" });
}));
TestAPIRouter.get("/addAllStudent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let employee1 = new Employee_1.Employee();
    employee1.employeeEmail = "1";
    employee1.employeeHashedPassword = "not available";
    let employee2 = new Employee_1.Employee();
    employee2.employeeEmail = "2";
    employee2.employeeHashedPassword = "available";
    let employeeList = [];
    employeeList.push(employee1);
    employeeList.push(employee2);
    yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
        yield transactionalEntityManager.createQueryBuilder().insert().into(Employee_1.Employee).values(employeeList).orIgnore().execute();
    }));
    res.json({ message: "oke" });
}));
TestAPIRouter.get("/addStudentAfter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let employee1 = new Employee_1.Employee();
    employee1.employeeEmail = "1";
    employee1.employeeHashedPassword = "not available";
    let employee2 = new Employee_1.Employee();
    employee2.employeeEmail = "2";
    employee2.employeeHashedPassword = "not available";
    let employeeList = [];
    employeeList.push(employee1);
    employeeList.push(employee2);
    const employeeRepo = db_config_1.AppDataSource.getRepository(Employee_1.Employee);
    yield employeeRepo.save(employeeList);
    res.json({ message: "oke" });
}));
TestAPIRouter.get("/takeAttendanceBefore", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentList = ['520H0380', '520H0696', "520H0555"];
    let data = yield studentClassRepository.findBy({
        studentDetail: (0, typeorm_1.In)(studentList),
        classDetail: "1"
    });
    const attendanceDetaillist = [];
    for (let i = 0; i < data.length; i++) {
        let attendanceDetail = new AttendanceDetail_1.AttendanceDetail();
        attendanceDetail.attendanceForm = "1";
        attendanceDetail.studentDetail = data[i].studentDetail;
        attendanceDetail.classDetail = data[i].classDetail;
        attendanceDetail.result = 1;
        console.log(attendanceDetail);
        attendanceDetaillist.push(attendanceDetail);
    }
    yield attendanceDetailRepository.createQueryBuilder().insert().values(attendanceDetaillist).orIgnore().execute();
    return res.status(200).json(data);
}));
TestAPIRouter.get("/getstudentinclass", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { data, error } = yield StudentClassService_1.default.getStudentsByClassID("1");
    return res.json(data);
}));
const token = "66616B652D61706E732D746F6B656E2D666F722D73696D756C61746F72";
TestAPIRouter.get("/sendNotification", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = {
        notification: {
            title: "hello Anh Vu, today is testing day",
            body: 'This contains message. bye bye !'
        },
        token: token
    };
    notification_config_1.default.messaging().send(message).then((response) => {
        res.json(response);
    }).catch((error) => {
        console.log(error);
        res.json(error);
    });
}));
TestAPIRouter.get("/news", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let dataImportant = yield reportRepository.find({
        order: {
            important: "DESC",
            new: "DESC",
            createdAt: "DESC"
        }
    });
    let dataNew = yield reportRepository.find({
        order: {
            new: "DESC",
            createdAt: "DESC"
        }
    });
    let stats = yield reportRepository.createQueryBuilder("report").
        select('COUNT(*) as total').addSelect(`SUM(CASE WHEN new = 1 THEN 1 ELSE 0 END) AS totalNew`).
        addSelect(`SUM(CASE WHEN new = 0 THEN 1 ELSE 0 END) AS totalOld`).getRawOne();
    let dataImportant2 = yield reportRepository.createQueryBuilder("report").
        innerJoin(Classes_1.Classes, "classes", "report.classID = classes.classID").
        orderBy('report.important', 'DESC').addOrderBy('report.new', 'DESC').addOrderBy('report.createdAt', 'DESC').
        where("classes.teacherID = :id", { id: "520H0381" }).getRawMany();
    let dataNew2 = yield reportRepository.createQueryBuilder("report").
        innerJoin(Classes_1.Classes, "classes", "report.classID = classes.classID").
        orderBy('report.new', 'DESC').addOrderBy('report.createdAt', 'DESC').
        where("classes.teacherID = :id", { id: "520H0381" }).getRawMany();
    let stats2 = yield reportRepository.createQueryBuilder("report").
        select('COUNT(*) as total').addSelect(`SUM(CASE WHEN new = 1 THEN 1 ELSE 0 END) AS totalNew`).
        addSelect(`SUM(CASE WHEN new = 0 THEN 1 ELSE 0 END) AS totalOld`).
        innerJoin(Classes_1.Classes, "classes", "report.classID = classes.classID").
        where("classes.teacherID = :id", { id: "520H0381" }).getRawOne();
    return res.json({ dataImportant2, dataNew2, stats2 });
}));
TestAPIRouter.get("/removeReport", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield reportRepository.delete({
        reportID: "1"
    });
    return res.json({ oke: "oke" });
}));
TestAPIRouter.get("/removeStudent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield studentRepository.delete({
        studentID: "520H0380",
    });
    console.log(data);
    return res.json({ message: "oke" });
}));
TestAPIRouter.get("/removeClass", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield classRepository.delete({
        classID: "1"
    });
    return res.json({ message: "oke" });
}));
TestAPIRouter.get("/removeAttendanceForm", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield attendanceFormRepository.delete({
        formID: "1"
    });
    return res.json({ message: "oke" });
}));
TestAPIRouter.get("/removeCourse", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield courseRepository.delete({
        courseID: "1"
    });
    return res.json({ message: "oke" });
}));
TestAPIRouter.get("/removeTeacher", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield teacherRepository.delete({
        teacherID: "1"
    });
    return res.json({ message: "oke" });
}));
TestAPIRouter.get("/notifications", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let notifications = [];
    let data = yield feedbackRepository.createQueryBuilder('feedback').
        innerJoinAndMapOne("feedback.report", Report_1.Report, "report", "feedback.reportID = report.reportID").andWhere("report.studentID = :id", { id: "520H0380" }).
        innerJoin(Classes_1.Classes, "classes", "report.classID = classes.classID").
        innerJoinAndMapOne("feedback.course", Course_1.Course, "course", "course.courseID = classes.courseID").
        innerJoinAndMapOne("feedback.teacher", Teacher_1.Teacher, "teacher", "teacher.teacherID = classes.teacherID").
        getMany();
    for (let i = 0; i < data.length; i++) {
        let feedback = data[i];
        let notification = {
            type: "report",
            reportID: feedback.report.reportID,
            formID: null,
            course: feedback.course.courseName,
            lecturer: feedback.teacher.teacherName,
            createdAt: feedback.createdAt
        };
        notifications.push(notification);
    }
    let data2 = yield attendanceDetailRepository.createQueryBuilder("attendancedetail").
        innerJoin(Classes_1.Classes, "classes", "attendancedetail.classID = classes.classID").
        innerJoinAndMapOne("attendancedetail.course", Course_1.Course, "course", "course.courseID = classes.courseID").
        innerJoinAndMapOne("attendancedetail.teacher", Teacher_1.Teacher, "teacher", "teacher.teacherID = classes.teacherID").
        where("attendancedetail.studentID = :id", { id: "520H0380" }).
        getMany();
    for (let i = 0; i < data2.length; i++) {
        let attendance = data2[i];
        let notification = {
            type: "attendance",
            reportID: null,
            formID: attendance.attendanceForm,
            course: attendance.course.courseName,
            lecturer: attendance.teacher.teacherName,
            createdAt: attendance.createdAt
        };
        notifications.push(notification);
    }
    return res.json(notifications);
}));
exports.default = TestAPIRouter;
