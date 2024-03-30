import { AppDataSource } from "../config/db.config";
import { Student } from "../models/Student";
import { StudentImage } from "../models/StudentImage";
import { JSDatetimeToMySQLDatetime, MySQLDatetimeToJSDatetime } from "../utils/TimeConvert";
import UploadImageService from "./UploadImageService";

const studentImageRepository = AppDataSource.getRepository(StudentImage);
const studentRepository = AppDataSource.getRepository(Student);
class FaceImageService {
    //must test
    checkImagesValid = async (studentImage, timeToLiveImages) => {
        try {
            if (studentImage.length == 0){
                console.log('K co hinh anh')
                return {data: false, error: null, message: "No images have been uploaded yet. Please upload 3 images"};
            }
            if (MySQLDatetimeToJSDatetime(timeToLiveImages) < JSDatetimeToMySQLDatetime(new Date())){
                //remove images from imgur and from database
                console.log('Hinh het han');
                if (await this.removeStudentImagesFromImgurAndDatabase(studentImage) == false){
                    return {data: null, error: "Failed removing images", message: ""};
                }
                return {data: false, error: null, message: "Images has expired. Please upload 3 images"};
            }
            return {data: true, error: null, message: "Images is still valid"};
        } catch (e) {
            return {data: null, error: "Error checking images", message: null};
        }
    }

    //testable
    removeStudentImagesFromImgurAndDatabase = async (studentImage) => {
        try {
            //remove image from imgur
            let imageHashList = this.getImageHashesFromStudentImages(studentImage);
            for (let i = 0; i < imageHashList.length; i++){
                let hash = imageHashList[i];
                await UploadImageService.deleteFile(hash);
            }
            await studentImageRepository.remove(studentImage);
            return true;
        } catch (e) {
            return false;
        }
    }

    //testable
    getImageHashesFromStudentImages = (studentImage) => {
        let imageHashList = [];
        for (let i = 0; i < studentImage.length; i++){
            let imageHash = studentImage[i].imageHash;
            imageHashList.push(imageHash);
        }
        return imageHashList;
    }

    //testable
    imageStudentListFromImage = async (files) => {
        try {
            let imageStudentList = [];
            for (let i = 0; i < files.length; i++){
                let data = await UploadImageService.uploadFile(files[i]);
                if (data.error == null)
                    imageStudentList.push(this.imageStudentObject(data));
            }
            return imageStudentList;
        } catch (e) {
            return [];
        }
    }

    loadStudentImagesToDatabase = async (imageStudentList, student) => {
        try {
            let currentDate = new Date();
            let threMonthsFromNow = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, currentDate.getDate());
            
            student.timeToLiveImages = JSDatetimeToMySQLDatetime(threMonthsFromNow);
            await AppDataSource.transaction(async () => {
                await studentImageRepository.insert(imageStudentList);
                await studentImageRepository.save(student);
            })
            return {data: imageStudentList, error: null};
        } catch(e){
            return {data: null, error: "Failed loading images to database"};
        }
    }

    //testable
    imageStudentObject = (data) => {
        let imageStudent = new StudentImage();
        imageStudent.imageHash = data.imageHash;
        imageStudent.imageURL = data.link;
        return imageStudent;
    }
}

export default new FaceImageService();