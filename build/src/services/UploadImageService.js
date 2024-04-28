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
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const imgur_1 = require("imgur");
const StudentImage_1 = require("../models/StudentImage");
const db_config_1 = require("../config/db.config");
const ReportImage_1 = require("../models/ReportImage");
const studentImageRepository = db_config_1.AppDataSource.getRepository(StudentImage_1.StudentImage);
const reportImageRepository = db_config_1.AppDataSource.getRepository(ReportImage_1.ReportImage);
const client = new imgur_1.ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_CLIENT_REFRESH_TOKEN
});
class UploadImageService {
    constructor() {
        this.uploadAttendanceEvidenceFile = (file) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield client.upload({
                    image: file.data
                });
                return response.success ? response.data : null;
            }
            catch (e) {
                console.log(e);
                return null;
            }
        });
        this.uploadReportFiles = (files, report) => __awaiter(this, void 0, void 0, function* () {
            for (var file in files) {
                var img = files[file];
                const response = yield client.upload({
                    image: img.data
                });
                let reportImage = new ReportImage_1.ReportImage();
                reportImage.imageHash = response.data.id;
                reportImage.imageURL = response.data.link;
                reportImage.report = report;
                reportImageRepository.save(reportImage);
            }
        });
        this.uploadFiles = (files, studentID) => __awaiter(this, void 0, void 0, function* () {
            for (var file in files) {
                var img = files[file];
                const response = yield client.upload({
                    image: img.data
                });
                let studentImage = new StudentImage_1.StudentImage();
                studentImage.studentID = studentID;
                studentImage.imageURL = response.data.link;
                studentImage.imageHash = response.data.id;
                studentImageRepository.save(studentImage);
            }
        });
        this.deleteFiles = (studentID) => __awaiter(this, void 0, void 0, function* () {
            let images = yield studentImageRepository.findBy({ studentID: studentID });
            for (var image in images) {
                var file = images[image];
                yield client.deleteImage(file.imageHash);
            }
            yield studentImageRepository.remove(images);
        });
        this.deleteImageByImageHash = (imageHash) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield client.deleteImage(imageHash);
            }
            catch (e) {
                return null;
            }
        });
        //send around 3 images
        //ensure 1 of 3 image is uploaded
        //testable
        this.uploadFile = (image) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield client.upload({ image: image.data });
                if (response.success) {
                    console.log(response.success);
                    return { link: response.data.link, imageHash: response.data.id, error: null };
                }
                return { link: null, imageHash: null, error: "Failed uploading file" };
            }
            catch (e) {
                console.log(e);
                return { link: null, imageHash: null, error: "Failed uploading file" };
            }
        });
        //testable
        this.deleteFile = (imageHash) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield client.deleteImage(imageHash);
                return response.success;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
}
exports.default = new UploadImageService();
