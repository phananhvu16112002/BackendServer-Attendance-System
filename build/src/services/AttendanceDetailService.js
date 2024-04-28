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
Object.defineProperty(exports, "__esModule", { value: true });
const StudentClass_1 = require("../models/StudentClass");
const AttendanceForm_1 = require("../models/AttendanceForm");
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const db_config_1 = require("../config/db.config");
const Report_1 = require("../models/Report");
const EditionHistory_1 = require("../models/EditionHistory");
const TimeConvert_1 = require("../utils/TimeConvert");
const Feedback_1 = require("../models/Feedback");
const Classes_1 = require("../models/Classes");
const Course_1 = require("../models/Course");
const Teacher_1 = require("../models/Teacher");
const studentClassRepository = db_config_1.AppDataSource.getRepository(StudentClass_1.StudentClass);
const attendanceFormRepository = db_config_1.AppDataSource.getRepository(AttendanceForm_1.AttendanceForm);
const attendanceDetailRepository = db_config_1.AppDataSource.getRepository(AttendanceDetail_1.AttendanceDetail);
class AttendanceDetailService {
    constructor() {
        //Oke
        this.createDefaultAttendanceDetailEntitiesForStudents = (listOfStudentClass, attendanceForm) => {
            console.log(listOfStudentClass);
            let listOfAttendanceDetail = [];
            for (let i = 0; i < listOfStudentClass.length; i++) {
                let studentClass = listOfStudentClass[i];
                let attendanceDetail = new AttendanceDetail_1.AttendanceDetail();
                attendanceDetail.studentClass = studentClass;
                attendanceDetail.attendanceForm = attendanceForm;
                attendanceDetail.createdAt = attendanceForm.dateOpen;
                listOfAttendanceDetail.push(attendanceDetail);
            }
            return listOfAttendanceDetail;
        };
        this.createAttendanceDetail = (studentClass, attendanceForm, location) => __awaiter(this, void 0, void 0, function* () {
            let attendanceDetail = new AttendanceDetail_1.AttendanceDetail();
            attendanceDetail.studentClass = studentClass;
            attendanceDetail.attendanceForm = attendanceForm;
            attendanceDetail.location = location;
            yield attendanceDetailRepository.save(attendanceDetail);
            return attendanceDetail;
        });
        this.getAttendanceDetail = (studentID, classID, formID) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield attendanceDetailRepository.findOne({
                    where: {
                        studentDetail: studentID,
                        classDetail: classID,
                        attendanceForm: formID
                    },
                    relations: {
                        attendanceForm: true
                    }
                });
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
        //oke
        this.getAttendanceDetailByClassID = (studentID, classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                //
                let result = yield attendanceDetailRepository.createQueryBuilder("attendancedetail").
                    innerJoinAndMapOne("attendancedetail.attendanceForm", AttendanceForm_1.AttendanceForm, 'attendanceform', 'attendancedetail.formID = attendanceform.formID').
                    leftJoinAndMapOne("attendancedetail.report", Report_1.Report, 'report', 'report.studentID = attendancedetail.studentID AND report.classID = attendancedetail.classID AND report.formID = attendancedetail.formID').
                    leftJoinAndMapOne("attendancedetail.feedback", Feedback_1.Feedback, "feedback", 'report.reportID = feedback.reportID').
                    where("attendancedetail.studentID = :studentid", { studentid: studentID }).
                    andWhere("attendancedetail.classID = :classid", { classid: classID }).
                    orderBy('attendancedetail.createdAt', 'DESC').
                    getMany();
                // let data = await attendanceDetailRepository.find({where: {
                //     studentDetail : studentID,
                //     classDetail: classID,
                // },
                // select: {
                //     result: true,
                //     dateAttendanced: true,
                //     location: true, 
                //     note: true,
                //     latitude: true,
                //     longitude: true,
                //     url: true,
                //     attendanceForm: {
                //         formID: true,
                //         status: true,
                //         type: true,
                //         status: true,
                //         startTime: true,
                //         endTime: true,
                //         dateOpen: true,
                //         classes: {
                //             roomNumber: true,
                //             shiftNumber: true,
                //             startTime: true,
                //             endTime: true,
                //             classType: true,
                //             group: true,
                //             subGroup: true,
                //             course: {
                //                 courseID: true,
                //                 courseName: true
                //             }
                //         }
                //     },
                // },
                // relations : {
                //     attendanceForm: {
                //         classes: {
                //             course : true
                //         }
                //     }
                // }
                // });
                return { data: result, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Failed fetching data" };
            }
        });
        //oke
        this.getOfflineAttendanceDetailByClassID = (studentID, classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                //
                let result = yield attendanceDetailRepository.createQueryBuilder("attendancedetail").
                    innerJoinAndMapOne("attendancedetail.attendanceForm", AttendanceForm_1.AttendanceForm, 'attendanceform', 'attendancedetail.formID = attendanceform.formID').
                    leftJoinAndMapOne("attendancedetail.report", Report_1.Report, 'report', 'report.studentID = attendancedetail.studentID AND report.classID = attendancedetail.classID AND report.formID = attendancedetail.formID').
                    leftJoinAndMapOne("attendancedetail.feedback", Feedback_1.Feedback, "feedback", 'report.reportID = feedback.reportID').
                    where("attendancedetail.studentID = :studentid", { studentid: studentID }).
                    andWhere("attendancedetail.classID = :classid", { classid: classID }).
                    andWhere("attendancedetail.offline = :offline", { offline: true }).
                    orderBy('attendancedetail.createdAt', 'DESC').
                    getMany();
                return { data: result, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: [], error: "Failed fetching data" };
            }
        });
        // takeAttendance = async () => {
        // }
        this.getAttendanceDetailsByClassIDAndFormID = (classID, formID) => __awaiter(this, void 0, void 0, function* () {
        });
        //testable
        this.getAttendanceDetailByStudentIDClassIDFormID = (studentID, classID, formID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield attendanceDetailRepository.createQueryBuilder("attendancedetail").
                    leftJoinAndMapMany("attendancedetail.histories", EditionHistory_1.EditionHistory, 'history', 'attendancedetail.studentID = history.studentID AND attendancedetail.classID = history.classID AND attendancedetail.formID = history.formID').
                    leftJoinAndMapOne('attendancedetail.report', Report_1.Report, 'report', 'attendancedetail.studentID = report.studentID AND attendancedetail.classID = report.classID AND attendancedetail.formID = report.formID AND report.new = 1').
                    where('attendancedetail.studentID = :studentid', { studentid: studentID }).
                    andWhere('attendancedetail.classID = :classid', { classid: classID }).
                    andWhere('attendancedetail.formID = :formid', { formid: formID }).
                    getOne();
                return { data, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: null, error: "Failed fetching data" };
            }
        });
        this.checkAttendanceDetailExist = (studentID, classID, formID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield attendanceDetailRepository.findOne({
                    where: {
                        studentDetail: studentID,
                        classDetail: classID,
                        attendanceForm: formID
                    }
                });
                return { data, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: null, error: "Failed fetching data" };
            }
        });
        //test must
        this.editAttendanceDetail = (attendanceDetail, note, confirmStatus, topic) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = this.resultBasedOnConfirmStatus(confirmStatus);
                let date = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
                attendanceDetail.result = result;
                attendanceDetail.note = note;
                attendanceDetail.location = "Ton Duc Thang University";
                attendanceDetail.dateAttendanced = date;
                let editionHistory = new EditionHistory_1.EditionHistory();
                editionHistory.attendanceDetail = attendanceDetail;
                editionHistory.confirmStatus = confirmStatus;
                editionHistory.createdAt = date;
                editionHistory.message = note;
                editionHistory.topic = topic;
                yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    yield transactionalEntityManager.update(AttendanceDetail_1.AttendanceDetail, {
                        studentDetail: attendanceDetail.studentDetail,
                        classDetail: attendanceDetail.classDetail,
                        attendanceForm: attendanceDetail.attendanceForm
                    }, {
                        result: result,
                        note: note,
                        dateAttendanced: date,
                        location: "Ton Duc Thang University"
                    });
                    yield transactionalEntityManager.insert(EditionHistory_1.EditionHistory, editionHistory);
                }));
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
        this.resultBasedOnConfirmStatus = (confirmStatus) => {
            if (confirmStatus == "Present") {
                return 1;
            }
            if (confirmStatus == "Late") {
                return 0.5;
            }
            return 0;
        };
        //must test
        this.getAttendanceDetailsByStudentID = (studentID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield attendanceDetailRepository.createQueryBuilder("attendancedetail").
                    innerJoin(Classes_1.Classes, "classes", "attendancedetail.classID = classes.classID").
                    innerJoinAndMapOne("attendancedetail.form", AttendanceForm_1.AttendanceForm, "form", "attendancedetail.formID = form.formID").
                    innerJoinAndMapOne("attendancedetail.course", Course_1.Course, "course", "course.courseID = classes.courseID").
                    innerJoinAndMapOne("attendancedetail.teacher", Teacher_1.Teacher, "teacher", "teacher.teacherID = classes.teacherID").
                    where("attendancedetail.studentID = :id", { id: studentID }).
                    getMany();
                return { data, error: null };
            }
            catch (e) {
                return { data: [], error: "Failed getting attendance details" };
            }
        });
        //must test
        this.seenAttendanceDetail = (studentID, classID, formID) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield attendanceDetailRepository.update({
                    studentDetail: studentID,
                    classDetail: classID,
                    attendanceForm: formID
                }, {
                    seen: true
                });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = new AttendanceDetailService();
