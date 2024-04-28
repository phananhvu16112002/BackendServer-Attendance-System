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
const Student_1 = require("../models/Student");
const StudentImage_1 = require("../models/StudentImage");
const TimeConvert_1 = require("../utils/TimeConvert");
const UploadImageService_1 = __importDefault(require("./UploadImageService"));
const studentImageRepository = db_config_1.AppDataSource.getRepository(StudentImage_1.StudentImage);
const studentRepository = db_config_1.AppDataSource.getRepository(Student_1.Student);
class FaceImageService {
    constructor() {
        //must test
        this.checkImagesValid = (studentImage, timeToLiveImages) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (studentImage.length == 0) {
                    console.log('K co hinh anh');
                    return { data: false, error: null, message: "No images have been uploaded yet. Please upload 3 images" };
                }
                if ((0, TimeConvert_1.MySQLDatetimeToJSDatetime)(timeToLiveImages) < (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(new Date())) {
                    //remove images from imgur and from database
                    console.log('Hinh het han');
                    if ((yield this.removeStudentImagesFromImgurAndDatabase(studentImage)) == false) {
                        return { data: null, error: "Failed removing images", message: "" };
                    }
                    return { data: false, error: null, message: "Images has expired. Please upload 3 images" };
                }
                return { data: true, error: null, message: "Images is still valid" };
            }
            catch (e) {
                return { data: null, error: "Error checking images", message: null };
            }
        });
        //testable
        this.removeStudentImagesFromImgurAndDatabase = (studentImage) => __awaiter(this, void 0, void 0, function* () {
            try {
                //remove image from imgur
                let imageHashList = this.getImageHashesFromStudentImages(studentImage);
                for (let i = 0; i < imageHashList.length; i++) {
                    let hash = imageHashList[i];
                    yield UploadImageService_1.default.deleteFile(hash);
                }
                yield studentImageRepository.remove(studentImage);
                return true;
            }
            catch (e) {
                return false;
            }
        });
        //testable
        this.getImageHashesFromStudentImages = (studentImage) => {
            let imageHashList = [];
            for (let i = 0; i < studentImage.length; i++) {
                let imageHash = studentImage[i].imageHash;
                imageHashList.push(imageHash);
            }
            return imageHashList;
        };
        //testable
        this.imageStudentListFromImage = (files) => __awaiter(this, void 0, void 0, function* () {
            try {
                let imageStudentList = [];
                for (let i = 0; i < files.length; i++) {
                    let data = yield UploadImageService_1.default.uploadFile(files[i]);
                    if (data.error == null)
                        imageStudentList.push(this.imageStudentObject(data));
                }
                return imageStudentList;
            }
            catch (e) {
                return [];
            }
        });
        //oke
        this.loadStudentImagesToDatabase = (imageStudentList, student) => __awaiter(this, void 0, void 0, function* () {
            try {
                let currentDate = new Date();
                let threMonthsFromNow = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, currentDate.getDate());
                student.timeToLiveImages = (0, TimeConvert_1.JSDatetimeToMySQLDatetime)(threMonthsFromNow);
                student.studentImage = imageStudentList;
                yield studentRepository.save(student);
                return { data: imageStudentList, error: null };
            }
            catch (e) {
                console.log('Err', e);
                return { data: null, error: "Failed loading images to database" };
            }
        });
        //testable
        this.imageStudentObject = (data) => {
            let imageStudent = new StudentImage_1.StudentImage();
            imageStudent.imageHash = data.imageHash;
            imageStudent.imageURL = data.link;
            return imageStudent;
        };
    }
}
exports.default = new FaceImageService();
