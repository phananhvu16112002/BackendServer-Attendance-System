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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("../config/db.config");
const ReportImage_1 = require("../models/ReportImage");
const UploadImageService_1 = __importDefault(require("./UploadImageService"));
const reportImageRepository = db_config_1.AppDataSource.getRepository(ReportImage_1.ReportImage);
class ReportImageService {
    constructor() {
        this.imageReportListFromImage = (files) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (files == null) {
                    return [];
                }
                let imageReportList = [];
                for (let i = 0; i < files.length; i++) {
                    let data = yield UploadImageService_1.default.uploadFile(files[i]);
                    if (data.error == null)
                        imageReportList.push(this.imageReportObject(data));
                }
                return imageReportList;
            }
            catch (e) {
                return [];
            }
        });
        this.imageReportObject = (data) => {
            let reportImage = new ReportImage_1.ReportImage();
            reportImage.imageID = data.imageHash;
            reportImage.imageURL = data.link;
            return reportImage;
        };
        this.deleteImageReportList = (imageReportList) => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < imageReportList.length; i++) {
                let imageReport = imageReportList[i];
                yield UploadImageService_1.default.deleteFile(imageReport.imageID);
            }
        });
    }
}
exports.default = new ReportImageService();
