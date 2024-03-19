import { AppDataSource } from "../config/db.config";
import { ReportImage } from "../models/ReportImage";
import UploadImageService from "./UploadImageService";

const reportImageRepository = AppDataSource.getRepository(ReportImage);

class ReportImageService {
    imageReportListFromImage = async (files) => {
        try {
            if (files == null){
                return [];
            }
            
            let imageReportList = [];
<<<<<<< HEAD
            for (let i =0 ; i < files.length; i++){
                // console.log(files[i]);
=======
            for (let i = 0; i < files.length; i++){
>>>>>>> a4df1acdcf432e2dfecee452c010cc8bec80f42b
                let data = await UploadImageService.uploadFile(files[i]);
                if (data.error == null) 
                    imageReportList.push(this.imageReportObject(data));
            }     
            return imageReportList;
        } catch (e) {
            return [];
        }
    }

    imageReportObject = (data) => {
        let reportImage = new ReportImage();
        reportImage.imageID = data.imageHash;
        reportImage.imageURL = data.link;
        return reportImage;
    }

    deleteImageReportList = async (imageReportList) => {
        for (let i = 0; i < imageReportList.length; i++){
            let imageReport = imageReportList[i];
            await UploadImageService.deleteFile(imageReport.imageID);
        }
    }
}

export default new ReportImageService();