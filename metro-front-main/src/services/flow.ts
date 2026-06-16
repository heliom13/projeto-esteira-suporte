import api from "./api";

export class FlowService {
  static async createFlow(data: any, steps: any[]) {
    return api.post("/flows", {
      description: data.description,
      typeFlowId: data.flowType.value,
      steps: steps,
      hasClient: data.hasClient,
      hasProperty: data.hasProperty,
      hasSellerMain: data.hasSellerMain,
      hasSellerSecondary: data.hasSellerSecondary,
      sendMessage: data.sendMessage,
    });
  }

  static async updateFlow(data: any, steps: any[], id: any) {
    return api.put(`/flows/${id}`, {
      description: data.description,
      typeFlowId: data.flowType.value,
      steps: steps,
      hasClient: data.hasClient,
      hasProperty: data.hasProperty,
      hasSellerMain: data.hasSellerMain,
      hasSellerSecondary: data.hasSellerSecondary,
      sendMessage: data.sendMessage,
    });
  }

  static async getFlow(id: any) {
    return api.get(`/flows/${id}`);
  }

  static async getFlows() {
    return api.get("/flows");
  }

  static async getFlowByDescription(flow: any) {
    let description = flow.description;
    return api.get(`/flows?description=${description}`);
  }

  static async getFlowTypes() {
    return api.get("/flowTypes");
  }
}
