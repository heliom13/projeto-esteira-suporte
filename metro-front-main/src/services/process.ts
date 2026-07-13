import api from "./api";
import {ComissionProps} from "../pages/process/endProcess";

export class ProcessService {
    static async createProcess(data: any) {
        return api.post("processes", {
            flowId: data.flow.value,
            propertyId: data.property?.value,
            clientId: data.client?.value,
            sellerMainId: data.seller ? data.seller.value : null,
            sellerSecondaryId: data.sellerSecondary ? data.sellerSecondary.value : null,
        });
    }

    static async getProcess() {
        return api.get("processes");
    }

    static async deleteProcess(id) {
        return api.delete(`/processes/${id}`)
    }

    static async getProcessById(id: any) {
        return api.get(`processes/${id}`);
    }

    static async getProcessInvoice(id: any) {
        return api.get(`processes/${id}/invoices`);
    }

    static async getInvoice(id) {
        return api.get(`invoices/${id}`)
    }


    static async removeInvoice(id) {
        return api.delete(`invoices/${id}`)
    }


    static async getProcessSteps(id: any) {
        return api.get(`processes/${id}/steps`);
    }

    static async getProcessByName(sale: any) {
        let name = sale.name.toUpperCase()
        return api.get(`/processes?name=${name}`);
    }

    static async nextStepProcess(id: any, data: any) {
        return api.put(`/processes/${id}/nexts/`, {
            reasonDelay: data.reason,
            observation: data.observation ?? null,
        });
    }

    static async addUnforeseen(id: any, data: any) {
        return api.put(`/processes/${id}/nexts/unforeseens`, {
            reason: data.reason,
            deadLine: parseInt(data.deadline),
        });
    }

    static async getProcesssDocuments(id: any) {
        return api.get(`/processes/${id}/documentsNotRated`);
    }

    static async addEndProcess(processId: any, data: any, comissions: ComissionProps[]) {
        return (api.post(`/invoices`, {
            fee: data.fee,
            value: data.price,
            processId: processId,
            commission: comissions
        }))
    }

    static async changeResponsible(processId: number, userDestiny: number) {
        return api.patch(`/processes/${processId}/change-users`, { userDestiny });
    }

    static async getStepNotes(processStepId: number) {
        return api.get(`/process-steps/${processStepId}/notes`);
    }

    static async addStepNote(processStepId: number, content: string) {
        return api.post(`/process-steps/${processStepId}/notes`, { content });
    }

    static async addComment(id: any, data: any) {
        return api.post(`/processes/${id}/comments`, {
            content: data.content,
        });
    }

    static async getComments(id: any) {
        return api.get(`/processes/${id}/comments`);
    }
}
