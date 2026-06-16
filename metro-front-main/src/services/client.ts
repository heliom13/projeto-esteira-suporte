import moment from "moment";
import api from "./api";

export class ClientService {
  static async getClients() {
    return api.get("/clients");
  }

  static async getClient(id: any) {
    return api.get(`/clients/${id}`);
  }

  static async getClientByName(client: any) {
    let name = client.name.toUpperCase()
    return api.get(`/clients?name=${name}`);
  }
  
  static async createClient(data: any) {
    return api.post("/clients", {
      name: data.name,
      document: data.cpf,
      email: data.mail,
      phone: data.phone,
      address: data.address,
      maritalStatus: data.maritalStatus.value ? data.maritalStatus.value : data.maritalStatus,
      job: data.job,
      birthday: moment(data.birthday).format("YYYY-MM-DD"),
      linkDrive: data.link,
      nameSecondary: data.nameSecondary,
      emailSecondary: data.emailSecondary,
      phoneSecondary: data.phoneSecondary,
    });
  }

  static async deleteClient(id: any) {
    return api.delete(`/clients/${id}`)
  }

  static async updateClient(data: any, id: any) {
    return api.put(`/clients/${id}`, {
      name: data.name,
      document: data.cpf,
      birthday: moment(data.birthday).format("YYYY-MM-DD"),
      email: data.mail,
      phone: data.phone,
      address: data.address,
      maritalStatus: data.maritalStatus.value ? data.maritalStatus.value : data.maritalStatus,
      job: data.job,
      linkDrive: data.link,
      nameSecondary: data.nameSecondary,
      emailSecondary: data.emailSecondary,
      phoneSecondary: data.phoneSecondary,
    });
  }
}
