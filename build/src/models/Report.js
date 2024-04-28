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
exports.Report = void 0;
const typeorm_1 = require("typeorm");
const AttendanceDetail_1 = require("./AttendanceDetail");
const ReportImage_1 = require("./ReportImage");
const Feedback_1 = require("./Feedback");
const HistoryReport_1 = require("./HistoryReport");
let Report = class Report {
};
exports.Report = Report;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Report.prototype, "reportID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "problem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], Report.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Report.prototype, "new", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Report.prototype, "important", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => AttendanceDetail_1.AttendanceDetail, AttendanceDetail => AttendanceDetail, { cascade: ["update"], onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)([
        { name: "studentID", referencedColumnName: "studentDetail" },
        { name: "classID", referencedColumnName: "classDetail" },
        { name: "formID", referencedColumnName: "attendanceForm" },
    ]),
    __metadata("design:type", AttendanceDetail_1.AttendanceDetail)
], Report.prototype, "attendanceDetail", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReportImage_1.ReportImage, ReportImage => ReportImage.report, { cascade: true }),
    __metadata("design:type", Array)
], Report.prototype, "reportImage", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Feedback_1.Feedback, (feedback) => feedback.report, { cascade: true }),
    __metadata("design:type", Feedback_1.Feedback)
], Report.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HistoryReport_1.HistoryReport, (HistoryReport) => HistoryReport.report),
    __metadata("design:type", Array)
], Report.prototype, "historyReports", void 0);
exports.Report = Report = __decorate([
    (0, typeorm_1.Entity)()
], Report);
