"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("dotenv/config");
const promises_1 = __importDefault(require("fs/promises"));
const tf = __importStar(require("@tensorflow/tfjs-node"));
const faceapi = __importStar(require("@vladmandic/face-api"));
const canvas_1 = __importDefault(require("canvas"));
const db_config_1 = require("../config/db.config");
const StudentImage_1 = require("../models/StudentImage");
const axios_1 = __importDefault(require("axios"));
// import sharp from 'sharp';
const studentImageRepository = db_config_1.AppDataSource.getRepository(StudentImage_1.StudentImage);
const { Canvas, Image, ImageData } = canvas_1.default;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
function LoadModels() {
    return __awaiter(this, void 0, void 0, function* () {
        yield faceapi.nets.faceRecognitionNet.loadFromDisk("./premodels");
        yield faceapi.nets.faceLandmark68Net.loadFromDisk("./premodels");
        yield faceapi.nets.ssdMobilenetv1.loadFromDisk("./premodels");
    });
}
LoadModels();
class FaceMatchingService {
    constructor() {
        //oke must test
        this.checkFacesTheSame = (images) => __awaiter(this, void 0, void 0, function* () {
            try {
                //Get the first image as a check point
                let checkImageCanvas = yield canvas_1.default.loadImage(images[0].data);
                let faceDescriptionCheck = yield faceapi.detectSingleFace(checkImageCanvas).withFaceLandmarks().withFaceDescriptor();
                faceDescriptionCheck = faceapi.resizeResults(faceDescriptionCheck, checkImageCanvas);
                //Check first image with the other two
                let [, ...restImages] = images;
                const labeledFaceDescriptors = yield Promise.all(restImages.map((image) => __awaiter(this, void 0, void 0, function* () {
                    const canvasImg = yield canvas_1.default.loadImage(image.data);
                    const faceDescription = yield faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
                    return new faceapi.LabeledFaceDescriptors(image.name, [faceDescription.descriptor]);
                })));
                const threshold = 0.52;
                for (let index = 0; index < labeledFaceDescriptors.length; index++) {
                    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors[index], threshold);
                    const results = faceMatcher.findBestMatch(faceDescriptionCheck.descriptor);
                    if (results.label == "unknown") {
                        return false;
                    }
                }
                return true;
            }
            catch (e) {
                return false;
            }
        });
        this.faceMatching = (image, studentID) => __awaiter(this, void 0, void 0, function* () {
            // let canvasImg = await canvas.loadImage(image.data);
            // //get face descriptions and resized
            // let faceDescription = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
            // faceDescription = faceapi.resizeResults(faceDescription, canvasImg);
            // //pre train model
            // const labels = this.getLabels(studentID);
            // const labeledFaceDescriptors = await Promise.all(
            //     labels.map(async label => {
            //         const response = await axios.get(label, {responseType: 'arraybuffer'});
            //         const canvasImg = await canvas.loadImage(response.data);
            //         const faceDescription = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
            //         return new faceapi.LabeledFaceDescriptors(label, faceDescription);
            //     })
            // )
            // //Matching
            // const threshold = 0.6;
            // const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold);
            // const results = faceMatcher.findBestMatch(faceDescription);
            // //check result
            // if (results.label == "unknown"){
            //     return false;
            // }
            // return true;
            console.log(image);
            const canvasImg = yield canvas_1.default.loadImage(image.data);
            console.log(canvasImg);
            console.log("before detection");
            let faceDescription1 = yield faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
            faceDescription1 = faceapi.resizeResults(faceDescription1, canvasImg);
            console.log(faceDescription1);
            const labels = yield this.getLabels(studentID);
            console.log(labels.length);
            const labeledFaceDescriptors = yield Promise.all(labels.map((label) => __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.get(label, { responseType: 'arraybuffer' });
                console.log(response.data);
                const canvasImg = yield canvas_1.default.loadImage(response.data);
                const faceDescription = yield faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
                return new faceapi.LabeledFaceDescriptors(label, [faceDescription.descriptor]);
            })));
            console.log("Matching");
            //Matching
            const threshold = 0.6;
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold);
            console.log(faceMatcher);
            const results = faceMatcher.findBestMatch(faceDescription1.descriptor);
            console.log(results);
            console.log(results);
            //check result
            if (results.label == "unknown") {
                return false;
            }
            return true;
        });
        this.getLabels = (studentID) => __awaiter(this, void 0, void 0, function* () {
            let labels = [];
            let images = yield studentImageRepository.findBy({ studentID: studentID });
            for (var image in images) {
                var file = images[image];
                labels.push(file.imageURL);
            }
            console.log(labels);
            return labels;
        });
    }
}
exports.default = new FaceMatchingService();
