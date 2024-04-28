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
exports.HistoryReport = void 0;
const typeorm_1 = require("typeorm");
const HistoryFeedback_1 = require("./HistoryFeedback");
const HistoryReportImage_1 = require("./HistoryReportImage");
const Report_1 = require("./Report");
let HistoryReport = class HistoryReport {
};
exports.HistoryReport = HistoryReport;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistoryReport.prototype, "historyReportID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HistoryReport.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HistoryReport.prototype, "problem", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HistoryReport.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HistoryReport.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], HistoryReport.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => HistoryFeedback_1.HistoryFeedback, (feedback) => feedback.historyReport, { cascade: true }),
    __metadata("design:type", HistoryFeedback_1.HistoryFeedback)
], HistoryReport.prototype, "historyFeedbacks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HistoryReportImage_1.HistoryReportImage, ReportImage => ReportImage.historyReport, { cascade: true }),
    __metadata("design:type", Array)
], HistoryReport.prototype, "historyReportImages", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Report_1.Report, (Report) => Report.historyReports, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: "reportID", referencedColumnName: "reportID" }),
    __metadata("design:type", Report_1.Report)
], HistoryReport.prototype, "report", void 0);
exports.HistoryReport = HistoryReport = __decorate([
    (0, typeorm_1.Entity)()
], HistoryReport);
