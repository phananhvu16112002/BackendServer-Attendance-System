"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Classes = void 0;
const typeorm_1 = require("typeorm");
const Course_1 = require("./Course");
const Teacher_1 = require("./Teacher");
const StudentClass_1 = require("./StudentClass");
const AttendanceForm_1 = require("./AttendanceForm");
let Classes = class Classes {
};
exports.Classes = Classes;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Classes.prototype, "classID", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Classes.prototype, "roomNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Classes.prototype, "shiftNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time", nullable: false }),
    __metadata("design:type", String)
], Classes.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "time", nullable: false }),
    __metadata("design:type", String)
], Classes.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Classes.prototype, "classType", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Classes.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Classes.prototype, "subGroup", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Course_1.Course, Course => Course.classes, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "courseID", referencedColumnName: "courseID" }),
    __metadata("design:type", Course_1.Course)
], Classes.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Teacher_1.Teacher, Teacher => Teacher.classes, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "teacherID", referencedColumnName: "teacherID" }),
    __metadata("design:type", Teacher_1.Teacher)
], Classes.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StudentClass_1.StudentClass, StudentClass => StudentClass.classDetail),
    __metadata("design:type", Array)
], Classes.prototype, "studentClass", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => AttendanceForm_1.AttendanceForm, AttendanceForm => AttendanceForm.classes),
    __metadata("design:type", Array)
], Classes.prototype, "attendanceForm", void 0);
exports.Classes = Classes = __decorate([
    (0, typeorm_1.Entity)()
], Classes);
