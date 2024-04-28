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
exports.StudentDeviceToken = void 0;
const typeorm_1 = require("typeorm");
const Student_1 = require("./Student");
let StudentDeviceToken = class StudentDeviceToken {
};
exports.StudentDeviceToken = StudentDeviceToken;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], StudentDeviceToken.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Student_1.Student, Student => Student.studentDeviceTokens, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "studentID", referencedColumnName: "studentID" }),
    __metadata("design:type", Student_1.Student)
], StudentDeviceToken.prototype, "studentID", void 0);
exports.StudentDeviceToken = StudentDeviceToken = __decorate([
    (0, typeorm_1.Entity)()
], StudentDeviceToken);
