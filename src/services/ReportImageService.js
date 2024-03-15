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
            for (let file in files){
                let data = await UploadImageService.uploadFile(files[file]);
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
}

export default new ReportImageService();