import api from "./api";

export class TaskService {
  static async createTask(data: any) {
    return api.post("/tasks", data);
  }

  static async getMine() {
    return api.get("/tasks/mine");
  }

  static async getAssignedByMe() {
    return api.get("/tasks/assigned-by-me");
  }

  static async getUnseenCount() {
    return api.get("/tasks/unseen-count");
  }

  static async complete(id: any) {
    return api.put(`/tasks/${id}/complete`);
  }

  static async markAllSeen() {
    return api.put(`/tasks/seen-all`);
  }
}
