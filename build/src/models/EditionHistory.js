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
exports.EditionHistory = void 0;
const typeorm_1 = require("typeorm");
const AttendanceDetail_1 = require("./AttendanceDetail");
let EditionHistory = class EditionHistory {
};
exports.EditionHistory = EditionHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EditionHistory.prototype, "editionHistoryID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EditionHistory.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EditionHistory.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EditionHistory.prototype, "confirmStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], EditionHistory.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => AttendanceDetail_1.AttendanceDetail, AttendanceDetail => AttendanceDetail, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)([
        { name: "studentID", referencedColumnName: "studentDetail" },
        { name: "classID", referencedColumnName: "classDetail" },
        { name: "formID", referencedColumnName: "attendanceForm" },
    ]),
    __metadata("design:type", AttendanceDetail_1.AttendanceDetail)
], EditionHistory.prototype, "attendanceDetail", void 0);
exports.EditionHistory = EditionHistory = __decorate([
    (0, typeorm_1.Entity)()
], EditionHistory);
