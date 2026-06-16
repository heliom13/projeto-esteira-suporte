import api from "./api";

export class ReportsService {

    static async getReportsFlows() {
        return api.get(`/reports/flows`);
    }

    static async getReportsDays() {
        return api.get(`/reports/process/days`);
    }

    static async getReportsQuantitatives() {
        return api.get(`/reports/quantitatives`);
    }
}