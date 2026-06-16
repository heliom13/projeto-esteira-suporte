import api from "./api";

export class DocumentsService {
  static async typesDocuments() {
    return api.get("/typesDocument");
  }
  static async typeDocument(id) {
    return api.get(`/typesDocument/${id}`);
  }

  static async newDocument(data){
    return api.post("/typesDocument", {
      description: data.description
    })
  }

  static async updateDocument(data, id){
    return api.put(`/typesDocument/${id}`, {
      description: data.description
    })
  }
}
