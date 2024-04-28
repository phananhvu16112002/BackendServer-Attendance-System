"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const HistoryFeedback_1 = require("../models/HistoryFeedback");
const HistoryReport_1 = require("../models/HistoryReport");
const HistoryReportImage_1 = require("../models/HistoryReportImage");
const db_config_1 = require("../config/db.config");
class HistoryReportService {
    constructor() {
        this.updateReportAndInsertHistory = (report, historyReport, imageReportList, editImageReportList, topic, message, status, createdAt, problem) => __awaiter(this, void 0, void 0, function* () {
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
                if (report.feedback != null && oldImage.length > 0) {
                    yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                        yield transactionalEntityManager.remove(oldImage);
                        yield transactionalEntityManager.save(report);
                        yield transactionalEntityManager.remove(report.feedback);
                        yield transactionalEntityManager.save(historyReport);
                    }));
                }
                else if (report.feedback == null && oldImage.length > 0) {
                    yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                        yield transactionalEntityManager.remove(oldImage);
                        yield transactionalEntityManager.save(report);
                        yield transactionalEntityManager.save(historyReport);
                    }));
                }
                else if (report.feedback != null && oldImage.length == 0) {
                    yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                        yield transactionalEntityManager.save(report);
                        yield transactionalEntityManager.remove(report.feedback);
                        yield transactionalEntityManager.save(historyReport);
                    }));
                }
                else {
                    yield db_config_1.AppDataSource.transaction((transactionalEntityManager) => __awaiter(this, void 0, void 0, function* () {
                        yield transactionalEntityManager.save(report);
                        yield transactionalEntityManager.save(historyReport);
                    }));
                }
                return { data: report, error: null };
            }
            catch (e) {
                console.log(e);
                return { data: null, error: "Failed editing report" };
            }
        });
        this.copyReport = (report) => {
            let historyReport = new HistoryReport_1.HistoryReport();
            historyReport.createdAt = report.createdAt;
            historyReport.message = report.message;
            historyReport.problem = report.problem;
            historyReport.status = report.status;
            historyReport.topic = report.topic;
            historyReport.historyFeedbacks = this.copyFeedback(report.feedback);
            historyReport.historyReportImages = this.copyReportImageList(report.reportImage);
            historyReport.report = report;
            return historyReport;
        };
        this.copyReportImageList = (reportImageList) => {
            let historyReportImageList = [];
            for (let i = 0; i < reportImageList.length; i++) {
                let reportImage = reportImageList[i];
                let historyReportImage = new HistoryReportImage_1.HistoryReportImage();
                historyReportImage.imageURL = reportImage.imageURL;
                historyReportImageList.push(reportImage);
            }
            return historyReportImageList;
        };
        this.copyFeedback = (feedback) => {
            if (feedback == null) {
                return null;
            }
            let historyFeedback = new HistoryFeedback_1.HistoryFeedback();
            historyFeedback.topic = feedback.topic;
            historyFeedback.confirmStatus = feedback.confirmStatus;
            historyFeedback.createdAt = feedback.createdAt;
            historyFeedback.message = feedback.message;
            return historyFeedback;
        };
    }
}
exports.default = new HistoryReportService();
