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
    //oke must test
    checkFacesTheSame = async (images) => {
        try {
            //Get the first image as a check point
            let checkImageCanvas = await canvas.loadImage(images[0].data);
            let faceDescriptionCheck = await faceapi.detectSingleFace(checkImageCanvas).withFaceLandmarks().withFaceDescriptor();
            faceDescriptionCheck = faceapi.resizeResults(faceDescriptionCheck, checkImageCanvas);

            //Check first image with the other two
            let [,...restImages] = images;
            const labeledFaceDescriptors = await Promise.all(
                restImages.map(async image => {
                    const canvasImg = await canvas.loadImage(image.data);
                    const faceDescription = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
                    return new faceapi.LabeledFaceDescriptors(image.name, [faceDescription.descriptor]);
                })
            );
            
            const threshold = 0.52;
            for (let index = 0; index < labeledFaceDescriptors.length; index++){
                const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors[index], threshold);
                const results = faceMatcher.findBestMatch(faceDescriptionCheck.descriptor);
                if (results.label == "unknown"){
                    return false;
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    faceMatching = async (image, studentID) => {
        console.log(image);
        const canvasImg = await canvas.loadImage(image.data);
        console.log(canvasImg);

        console.log("before detection");
        let faceDescription1 = await faceapi.detectSingleFace(canvasImg).withFaceLandmarks().withFaceDescriptor();
        faceDescription1 = faceapi.resizeResults(faceDescription1, canvasImg);
        
        const labels = await this.getLabels(studentID);
        console.log(labels.length);
        
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
        const threshold = 0.6;
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, threshold);
        console.log(faceMatcher);
        const results = faceMatcher.findBestMatch(faceDescription1.descriptor);
        
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
        console.log(labels);
        return labels;
    }
}

export default new FaceMatchingService();