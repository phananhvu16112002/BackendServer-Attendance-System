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
const AttendanceFormDTO_1 = __importDefault(require("../dto/AttendanceFormDTO"));
const AttendanceDetailService_1 = __importDefault(require("../services/AttendanceDetailService"));
const AttendanceFormService_1 = __importDefault(require("../services/AttendanceFormService"));
const ClassService_1 = __importDefault(require("../services/ClassService"));
const NotificationService_1 = __importDefault(require("../services/NotificationService"));
const CompareCaseInsentitive_1 = __importDefault(require("../utils/CompareCaseInsentitive"));
const TimeConvert_1 = require("../utils/TimeConvert");
class AttendanceFormController {
    constructor() {
        //Oke
        this.createAttendanceForm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                const classID = req.body.classID;
                const startTime = req.body.startTime;
                const endTime = req.body.endTime;
                const dateOpen = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date());
                const type = req.body.type;
                const location = req.body.location;
                const latitude = req.body.latitude;
                const longitude = req.body.longitude;
                const radius = req.body.radius;
                const { data: classes, error: err } = yield ClassService_1.default.getClassByIDWithStudents(classID);
                if (err) {
                    return res.status(503).json({ message: err });
                }
                if (classes == null) {
                    return res.status(204).json({ message: `Class with the id: ${classID} does not exist` });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, classes.teacher.teacherID) == false) {
                    return res.status(422).json({ message: "Teacher is not in charge of this class" });
                }
                //Create entities before inserting into database
                const attendanceFormEntity = AttendanceFormService_1.default.createFormEntity(classes, startTime, endTime, dateOpen, type, location, latitude, longitude, radius);
                const attendanceDetailEntities = AttendanceDetailService_1.default.createDefaultAttendanceDetailEntitiesForStudents(classes.studentClass, attendanceFormEntity);
                //Make transactions to insert into database
                const { data: form, error } = yield AttendanceFormService_1.default.createFormTransaction(attendanceFormEntity, attendanceDetailEntities);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                //Get danh sach student trong danh sach cam thi, trong danh sach warning
                //Send notification
                let offset = classes.course.totalWeeks - classes.course.requiredWeeks;
                offset = offset + 1;
                yield NotificationService_1.default.sendAttendanceFormToStudents(classID, offset);
                if (form == null) {
                    return res.status(503).json({ message: "Attendance Form cannot be created. Please try again!" });
                }
                return res.status(200).json(AttendanceFormDTO_1.default.excludeClasses(form));
            }
            catch (e) {
                console.log(e);
                return res.status(500).json({ message: "Internal Server" });
            }
        });
        //oke
        this.getAttendanceFormsByClassID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherID = req.payload.userID;
                const classID = req.params.id;
                let { data, error } = yield AttendanceFormService_1.default.getAttendanceFormsByClassID(classID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "There is no classes with this ID" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, data.teacher.teacherID) == false) {
                    return res.status(401).json({ message: "Teacher is not in charge of this class" });
                }
                if (data.attendanceForm.length == 0) {
                    return res.status(204).json({ message: "There is no forms created!" });
                }
                return res.status(200).json(data.attendanceForm);
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //must test
        this.deleteAttendanceFormByFormID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let formID = req.params.formid;
                let classID = req.params.classid;
                let teacherID = req.payload.userID;
                let { data, error } = yield AttendanceFormService_1.default.getAttendanceFormsByClassID(classID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "There is no classes with this ID" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, data.teacher.teacherID) == false) {
                    return res.status(401).json({ message: "Teacher is not in charge of this class" });
                }
                if ((yield AttendanceFormService_1.default.deleteAttendanceFormByID(formID)) == false) {
                    return res.status(503).json({ message: "Failed deleting form" });
                }
                return res.status(200).json({ message: "Delete form successfully" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //must test
        this.editAttendanceFormByFormID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let formID = req.params.formid;
                let classID = req.params.classid;
                let teacherID = req.payload.userID;
                let offsetTime = req.body.offsetTime;
                let startTime = req.body.startTime;
                let endTime = req.body.endTime;
                let type = req.body.type;
                let distance = req.body.distance;
                let { data, error } = yield AttendanceFormService_1.default.getAttendanceFormsByClassID(classID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "There is no classes with this ID" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, data.teacher.teacherID) == false) {
                    return res.status(401).json({ message: "Teacher is not in charge of this class" });
                }
                if ((yield AttendanceFormService_1.default.editAttendanceFormByID(formID, startTime, endTime, offsetTime, type, distance)) == false) {
                    return res.status(503).json({ message: "Failed editing form" });
                }
                return res.status(200).json({ message: "Edit form successfully" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
        //must test
        this.closeOrOpenFormByFormID = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let formID = req.params.formid;
                let classID = req.params.classid;
                let teacherID = req.payload.userID;
                let status = req.body.status;
                let { data, error } = yield AttendanceFormService_1.default.getAttendanceFormsByClassID(classID);
                if (error) {
                    return res.status(503).json({ message: error });
                }
                if (data == null) {
                    return res.status(204).json({ message: "There is no classes with this ID" });
                }
                if ((0, CompareCaseInsentitive_1.default)(teacherID, data.teacher.teacherID) == false) {
                    return res.status(401).json({ message: "Teacher is not in charge of this class" });
                }
                if ((yield AttendanceFormService_1.default.closeOrOpenFormByFormID(formID, status)) == false) {
                    return res.status(503).json({ message: "Failed updating form" });
                }
                return res.status(200).json({ message: "Update form successfully" });
            }
            catch (e) {
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
}
exports.default = new AttendanceFormController();
