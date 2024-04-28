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
exports.ReportImage = void 0;
const typeorm_1 = require("typeorm");
const Report_1 = require("./Report");
let ReportImage = class ReportImage {
};
exports.ReportImage = ReportImage;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], ReportImage.prototype, "imageID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ReportImage.prototype, "imageURL", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Report_1.Report, Report => Report.reportImage, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: "reportID", referencedColumnName: "reportID" }),
    __metadata("design:type", Report_1.Report)
], ReportImage.prototype, "report", void 0);
exports.ReportImage = ReportImage = __decorate([
    (0, typeorm_1.Entity)()
], ReportImage);
