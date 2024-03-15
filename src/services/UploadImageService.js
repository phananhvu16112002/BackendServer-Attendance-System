import 'dotenv/config';
import {ImgurClient} from "imgur";
import { StudentImage } from '../models/StudentImage';
import { AppDataSource } from '../config/db.config';
import { ReportImage } from '../models/ReportImage';

const studentImageRepository = AppDataSource.getRepository(StudentImage);
const reportImageRepository = AppDataSource.getRepository(ReportImage);

const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_CLIENT_REFRESH_TOKEN
})

class UploadImageService {
    uploadAttendanceEvidenceFile = async (file) => {
        try {
            const response = await client.upload({
                image: file.data
            })
            return response.success ? response.data : null;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    uploadReportFiles = async (files, report) => {
        for (var file in files){
            var img = files[file];
            const response = await client.upload({
                image: img.data
            })

            let reportImage = new ReportImage();
            reportImage.imageHash = response.data.id;
            reportImage.imageURL = response.data.link;
            reportImage.report = report;

            reportImageRepository.save(reportImage);
        }
    }

    uploadFiles = async (files, studentID) => {
        for (var file in files){
            var img = files[file];
            const response = await client.upload({
                image: img.data
            })

            let studentImage = new StudentImage();
            studentImage.studentID = studentID;
            studentImage.imageURL = response.data.link;
            studentImage.imageHash = response.data.id;

            studentImageRepository.save(studentImage);
        }
    }

    deleteFiles = async (studentID) => {
        let images = await studentImageRepository.findBy({studentID : studentID});
        
        for (var image in images){
            var file = images[image];
            await client.deleteImage(file.imageHash);
        }

        await studentImageRepository.remove(images);
    }

    deleteImageByImageHash = async (imageHash) => {
        try {
            await client.deleteImage(imageHash);
        } catch (e) {
            return null;
        }
    }

    //send around 3 images
    //ensure 1 of 3 image is uploaded

    //testable
    uploadFile = async (image) => {
        try {       
            const response = await client.upload({image: image.data});
            if (response.success){
                console.log(response.success);
                return {link: response.data.link, imageHash: response.data.id, error: null};
            }
            return {link: null, imageHash: null, error: "Failed uploading file"};
        } catch (e) {
            console.log(e);
            return {link: null, imageHash: null, error: "Failed uploading file"};
        }
    }

    //testable
    deleteFile = async (imageHash) => {
        try {
            const response = await client.deleteImage(imageHash);
            
            return response.status;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

export default new UploadImageService();