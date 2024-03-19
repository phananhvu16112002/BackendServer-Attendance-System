import { HistoryFeedback } from "../models/HistoryFeedback"
import { HistoryReport } from "../models/HistoryReport";
import { HistoryReportImage } from "../models/HistoryReportImage";
import { AppDataSource } from "../config/db.config";

class HistoryReportService {
    updateReportAndInsertHistory = async (report, historyReport, imageReportList, editImageReportList, topic, message, status, createdAt, problem) => {
        report.new = true;
        report.important = true;
        report.status = status;
        report.createdAt = createdAt;
        report.message = message;
        report.topic = topic;
        
        let oldImage = editImageReportList;

        report.reportImage = imageReportList;
        report.problem = problem;
        try {
            if (report.feedback != null && oldImage.length > 0){
                await AppDataSource.transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager.remove(oldImage);
                    await transactionalEntityManager.save(report);
                    await transactionalEntityManager.remove(report.feedback);
                    await transactionalEntityManager.save(historyReport);
                });
            } else if (report.feedback == null && oldImage.length > 0){
                await AppDataSource.transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager.remove(oldImage);
                    await transactionalEntityManager.save(report);
                    await transactionalEntityManager.save(historyReport);
                });
            } else if (report.feedback != null && oldImage.length == 0) {
                await AppDataSource.transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager.save(report);
                    await transactionalEntityManager.remove(report.feedback);
                    await transactionalEntityManager.save(historyReport);
                });
            } else {
                await AppDataSource.transaction(async (transactionalEntityManager) => {
                    await transactionalEntityManager.save(report);
                    await transactionalEntityManager.save(historyReport);
                });
            }
            
            return {data: report, error: null};
        } catch (e) {
            console.log(e);
            return {data: null, error: "Failed editing report"};
        }
    }

    copyReport = (report) => {
        let historyReport = new HistoryReport();
        historyReport.createdAt = report.createdAt;
        historyReport.message = report.message;
        historyReport.problem = report.problem;
        historyReport.status = report.status;
        historyReport.topic = report.topic;

        historyReport.historyFeedbacks = this.copyFeedback(report.feedback);
        historyReport.historyReportImages = this.copyReportImageList(report.reportImage);
        historyReport.report = report;

        return historyReport;
    }

    copyReportImageList = (reportImageList) => {
        let historyReportImageList = [];
        for (let i = 0; i < reportImageList.length; i++){
            let reportImage = reportImageList[i];
            let historyReportImage = new HistoryReportImage();
            historyReportImage.imageURL = reportImage.imageURL;

            historyReportImageList.push(reportImage);
        }

        return historyReportImageList;
    }

    copyFeedback = (feedback) => {
        if (feedback == null){
            return null;
        }
        let historyFeedback = new HistoryFeedback();
        historyFeedback.topic = feedback.topic;
        historyFeedback.confirmStatus = feedback.confirmStatus;
        historyFeedback.createdAt = feedback.createdAt;
        historyFeedback.message = feedback.message;
        return historyFeedback;
    }
}

export default new HistoryReportService()