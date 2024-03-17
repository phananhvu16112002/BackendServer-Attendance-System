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
            for (let i =0 ; i < files.length; i++){
                // console.log(files[i]);
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