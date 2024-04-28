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
exports.AttendanceForm = void 0;
const typeorm_1 = require("typeorm");
const Classes_1 = require("./Classes");
let AttendanceForm = class AttendanceForm {
};
exports.AttendanceForm = AttendanceForm;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], AttendanceForm.prototype, "formID", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Classes_1.Classes, (Classes) => Classes.attendanceForm, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "classID", referencedColumnName: "classID" }),
    __metadata("design:type", Classes_1.Classes)
], AttendanceForm.prototype, "classes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], AttendanceForm.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], AttendanceForm.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], AttendanceForm.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], AttendanceForm.prototype, "dateOpen", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AttendanceForm.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double", default: 0, nullable: true }),
    __metadata("design:type", Number)
], AttendanceForm.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double", default: 0, nullable: true }),
    __metadata("design:type", Number)
], AttendanceForm.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AttendanceForm.prototype, "radius", void 0);
exports.AttendanceForm = AttendanceForm = __decorate([
    (0, typeorm_1.Entity)()
], AttendanceForm);
