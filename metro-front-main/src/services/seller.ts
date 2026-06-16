import api from "./api";

export class SellerService {
    static async createSeller(data) {
        return api.post("/sellers", {
            name: data.name,
            document: data.document,
            email: data.email,
            emailOther: data.emailSecondary,
            phone: data.phone,
            otherPhone: data.otherPhone,
            bank: data.bank ? data.bank : "",
            accountNumberBank: data.accountNumberBank ? data.accountNumberBank : "",
            accountBank: data.accountBank ? data.accountBank : "",
            creci: data.creci,
            pix: data.pix,
        });
    }

    static async updateSeller(data, id) {
        return api.put(`/sellers/${id}`, {
            name: data.name,
            document: data.document,
            email: data.email,
            emailOther: data.emailSecondary,
            phone: data.phone,
            otherPhone: data.otherPhone,
            bank: data.bank,
            accountBank: data.accountBank,
            accountNumberBank: data.accountNumberBank,
            creci: data.creci,
            pix: data.pix,
        });
    }


    static async getSellerByName(seller: any) {
        let name = seller.name.toUpperCase()
        return api.get(`/sellers?name=${name}`);
    }


    static async deleteClient(id: any) {
        return api.delete(`/sellers/${id}`)
    }


    static async getSeller(id) {
        return api.get(`/sellers/${id}`);
    }

    static async getSellers() {
        return api.get("/sellers");
    }
}
