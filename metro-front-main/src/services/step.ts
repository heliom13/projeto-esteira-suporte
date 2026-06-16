import api from "./api";

export class StepService {
  static async getSteps() {
    return api.get("/steps?size=1000");
  }

  static async createStep(data: any, docs: any[]) {
    return api.post("/steps", {
      description: data.description,
      deadLine: parseInt(data.deadline),
      requiredDocument: data.requiredDocument,
      documents: docs.map((item) => item.value),
    });
  }

  static async updateStep(data: any, docs: any[], id: any) {
    return api.put(`/steps/${id}/`, {
      description: data.description,
      deadLine: parseInt(data.deadline),
      requiredDocument: data.requiredDocument,
      documents: docs.map((item) => item.value),
    });
  }

  static async getStep(id: any) {
    return api.get(`/steps/${id}`);
  }
  static async deleteStep(id: number) {
    return api.delete(`/steps/${id}`);
  }

  static async getStepByDescription(flow: any) {
    let description = flow.description.toUpperCase()
    return api.get(`/steps?description=${description}`);
  }

}
