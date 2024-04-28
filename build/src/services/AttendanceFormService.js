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
const db_config_1 = require("../config/db.config");
const AttendanceForm_1 = require("../models/AttendanceForm");
const uuid_1 = require("uuid");
const TimeConvert_1 = require("../utils/TimeConvert");
const Classes_1 = require("../models/Classes");
const AttendanceDetail_1 = require("../models/AttendanceDetail");
const Student_1 = require("../models/Student");
const attendanceFormRepository = db_config_1.AppDataSource.getRepository(AttendanceForm_1.AttendanceForm);
const classRepository = db_config_1.AppDataSource.getRepository(Classes_1.Classes);
class AttendanceFormService {
    constructor() {
        //Oke
        this.createFormTransaction = (attendanceForm, attendanceDetails) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                    yield transactionalEntityManager.save(attendanceForm);
                    yield transactionalEntityManager.save(attendanceDetails);
                }));
                return { data: attendanceForm, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: null, error: "Failed creating form" };
            }
        });
        //Oke
        this.createFormEntity = (classes, startTime, endTime, dateOpen, type, location, latitude, longitude, radius) => {
            let form = new AttendanceForm_1.AttendanceForm();
            form.formID = (0, uuid_1.v4)();
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
        };
        this.closeFormByID = (formID) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield attendanceFormRepository.update(formID, { status: false });
            }
            catch (e) {
            }
        });
        this.reopenForm = (formID, startTime, endTime, type) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield attendanceFormRepository.update(formID, {
                    startTime: startTime,
                    endTime: endTime,
                    type: type,
                    status: true
                });
            }
            catch (e) {
            }
        });
        this.getFormByID = (formID) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield attendanceFormRepository.findOneBy({ formID: formID });
            }
            catch (e) {
                return null;
            }
        });
        //Oke
        this.getAttendanceFormsByClassID = (classID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield classRepository.findOne({
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
                return { data, error: null };
            }
            catch (e) {
                return { data: null, error: "Failed fetching data" };
            }
        });
        //
        this.getAttendanceFormByFormID = (formID) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield attendanceFormRepository.createQueryBuilder("attendanceform").
                    leftJoinAndMapMany("attendanceform.attendancedetails", AttendanceDetail_1.AttendanceDetail, "attendancedetail", "attendancedetail.formID = attendanceform.formID").
                    innerJoinAndMapOne("attendancedetail.student", Student_1.Student, "student", "attendancedetail.studentID = student.studentID").
                    select("attendancedetail.*").addSelect("student.studentName, student.studentEmail").
                    where("attendanceform.formID =:id", { id: formID }).getRawMany();
                let stats = yield attendanceFormRepository.createQueryBuilder("attendanceform").
                    leftJoinAndMapMany("attendanceform.attendancedetails", AttendanceDetail_1.AttendanceDetail, "attendancedetail", "attendancedetail.formID = attendanceform.formID").
                    select("attendanceform.*").
                    addSelect('COUNT(attendancedetail.formID) as total').
                    addSelect(`SUM(CASE WHEN result = 1 THEN 1 ELSE 0 END) AS totalPresence`).
                    addSelect(`SUM(CASE WHEN result = 0 THEN 1 ELSE 0 END) AS totalAbsence`).
                    addSelect(`SUM(CASE WHEN result = 0.5 THEN 1 else 0 END) AS totalLate`).
                    groupBy("attendancedetail.formID").
                    where("attendanceform.formID =:id", { id: formID }).getRawOne();
                return { data, stats };
            }
            catch (e) {
                return { data: null, error: "Failed fetching data" };
            }
        });
        this.deleteAttendanceFormByID = (formID) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield attendanceFormRepository.delete({
                    formID: formID
                });
                return true;
            }
            catch (e) {
                return false;
            }
        });
        this.editAttendanceFormByID = (formID, startTime, endTime, offsetTime, type, distance) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield attendanceFormRepository.update({
                    formID: formID
                }, {
                    startTime: startTime,
                    endTime: endTime,
                    radius: distance,
                    type: type
                });
                return true;
            }
            catch (e) {
                return false;
            }
        });
        this.closeOrOpenFormByFormID = (formID, status) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield attendanceFormRepository.update(formID, { status: status });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = new AttendanceFormService();
