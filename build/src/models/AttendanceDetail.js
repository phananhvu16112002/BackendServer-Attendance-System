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
exports.AttendanceDetail = void 0;
const typeorm_1 = require("typeorm");
const AttendanceForm_1 = require("./AttendanceForm");
const StudentClass_1 = require("./StudentClass");
let AttendanceDetail = class AttendanceDetail {
};
exports.AttendanceDetail = AttendanceDetail;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "studentID", type: "string" }),
    __metadata("design:type", String)
], AttendanceDetail.prototype, "studentDetail", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "classID", type: "string" }),
    __metadata("design:type", String)
], AttendanceDetail.prototype, "classDetail", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => StudentClass_1.StudentClass, StudentClass => StudentClass, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)([
        { name: "studentID", referencedColumnName: "studentDetail" },
        { name: "classID", referencedColumnName: "classDetail" },
    ]),
    __metadata("design:type", StudentClass_1.StudentClass)
], AttendanceDetail.prototype, "studentClass", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "string", name: "formID" }),
    (0, typeorm_1.ManyToOne)(() => AttendanceForm_1.AttendanceForm, (AttendanceForm) => AttendanceForm, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "formID", referencedColumnName: "formID" }),
    __metadata("design:type", AttendanceForm_1.AttendanceForm
    // @ManyToOne(() => StudentClass, StudentClass => StudentClass)
    // @JoinColumn([
    //     {name: "studentID", referencedColumnName: "studentDetail"},
    //     {name: "classID", referencedColumnName: "classDetail"},
    // ])
    // studentClass: StudentClass
    // @ManyToOne(() => AttendanceForm, (AttendanceForm) => AttendanceForm.attendanceDetails)
    // attendanceForm: AttendanceForm
    // @OneToMany(() => Report, (Report) => Report.attendanceDetail)
    // reports: Report[]
    )
], AttendanceDetail.prototype, "attendanceForm", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double", default: 0.0 }),
    __metadata("design:type", Number)
], AttendanceDetail.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], AttendanceDetail.prototype, "dateAttendanced", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], AttendanceDetail.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], AttendanceDetail.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double", default: 0, nullable: true }),
    __metadata("design:type", Number)
], AttendanceDetail.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double", default: 0, nullable: true }),
    __metadata("design:type", Number)
], AttendanceDetail.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], AttendanceDetail.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], AttendanceDetail.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AttendanceDetail.prototype, "seen", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AttendanceDetail.prototype, "offline", void 0);
exports.AttendanceDetail = AttendanceDetail = __decorate([
    (0, typeorm_1.Entity)()
], AttendanceDetail);
