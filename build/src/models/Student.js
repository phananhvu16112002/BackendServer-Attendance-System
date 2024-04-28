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
exports.Student = void 0;
const typeorm_1 = require("typeorm");
const StudentClass_1 = require("./StudentClass");
const StudentImage_1 = require("./StudentImage");
const StudentDeviceToken_1 = require("./StudentDeviceToken");
let Student = class Student {
};
exports.Student = Student;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Student.prototype, "studentID", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Student.prototype, "studentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Student.prototype, "studentHashedPassword", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Student.prototype, "studentEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Student.prototype, "hashedOTP", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Student.prototype, "accessToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Student.prototype, "refreshToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "" }),
    __metadata("design:type", String)
], Student.prototype, "resetToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "timeToLiveOTP", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime", nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "timeToLiveImages", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Student.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StudentClass_1.StudentClass, StudentClass => StudentClass.studentDetail),
    __metadata("design:type", Array)
], Student.prototype, "studentClass", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StudentImage_1.StudentImage, StudentImage => StudentImage.studentID, { cascade: true }),
    __metadata("design:type", Array)
], Student.prototype, "studentImage", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => StudentDeviceToken_1.StudentDeviceToken, StudentDeviceToken => StudentDeviceToken.studentID),
    __metadata("design:type", Array)
], Student.prototype, "studentDeviceTokens", void 0);
exports.Student = Student = __decorate([
    (0, typeorm_1.Entity)()
], Student);
