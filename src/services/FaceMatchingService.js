import fs from "fs/promises";
import * as tf from "@tensorflow/tfjs-node";
import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import { AppDataSource } from "../config/db.config";
import { StudentImage } from "../models/StudentImage";

const studentImageRepository = AppDataSource.getRepository(StudentImage);
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function LoadModels() {
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./premodels");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./premodels");
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./premodels");
}

LoadModels();

class FaceMatchingService {
    faceMatching = async (files, studentID) => {
        const canvasImg = await canvas.loadImage(files.file.data);
        const faceDescription = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
        faceDescription = faceapi.resizeResults(faceDescription, canvasImg);
        
        const labels = await this.getLabels(studentID);

        const labeledFaceDescriptors = await Promise.all(
            labels.map(async label => {
                const canvasImg = await faceapi.fetchImage(label);
                const faceDescription = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
                return new faceapi.LabeledFaceDescriptors(label, faceDescription);
            })
        )

        //Matching
        const threshold = 0.6;
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold);
        const results = faceMatcher.findBestMatch(faceDescription);

        //check result
        if (results.label == "unknown"){
            return false;
        }

        return true;
    }

    getLabels = async (studentID) => {
        let labels = [];
        let images = await studentImageRepository.findBy({studentID : studentID});
        
        for (var image in images){
            var file = images[image];
            labels.push(file.imageURL);
        }

        return labels;
    }
}

export default new FaceMatchingService();