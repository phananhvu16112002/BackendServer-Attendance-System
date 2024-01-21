import 'dotenv/config';
import fs from "fs/promises";
import * as tf from "@tensorflow/tfjs-node";
import * as faceapi from "@vladmandic/face-api";
import canvas from "canvas";
import { AppDataSource } from "../config/db.config";
import { StudentImage } from "../models/StudentImage";
import axios from "axios";

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
    faceMatching = async (image, studentID) => {
        let canvasImg = await canvas.loadImage(image.data);
        let faceDescription = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
        faceDescription = faceapi.resizeResults(faceDescription, canvasImg);
        
        const labels = await this.getLabels(studentID);

        const labeledFaceDescriptors = await Promise.all(
            labels.map(async label => {
                const response = await axios.get(label, {responseType: 'arraybuffer'});
                console.log(response.data);
                const canvasImg = await canvas.loadImage(response.data);
                const faceDescription = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
                
                return new faceapi.LabeledFaceDescriptors(label, [faceDescription.descriptor]);
            })
        )

        console.log("Matching");

        //Matching
        const threshold = 0.52;
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold);
        const results = faceMatcher.findBestMatch(faceDescription.descriptor);
        console.log(results);
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