import {formattedValue} from '../utils/ValidatorFields';
import api from './api'

export class PropertyService {
    static async createProperty(data: any) {
        return api.post('/properties', {
            description: data.description,
            address: data.address,
            ownerName: data.ownerName,
            ownerDocument: data.cpf ? data.cpf : data.cnpj,
            price: data.price,
            financialPrice: data.financialPrice,
            email: data.mail,
            bank: data.bank ? data.bank : "",
            pix: data.pix ? data.pix : "",
            phone: data.phone,
            maritalStatus: data.maritalStatus ? data.maritalStatus.value : null,
            accountNumberBank: data.accountNumberBank ? data.accountNumberBank : "",
            accountBank: data.accountBank ? data.accountBank : "",
            linkDrive: data.linkDrive,

            nameSecondary: data.nameSecondary,
            emailSecondary: data.emailSecondary,
            phoneSecondary: data.phoneSecondary,
        })
    }

    static async getProperties() {
        return api.get('/properties')
    }

    static async getProperty(id: any) {
        return api.get(`/properties/${id}`)
    }

    static async getPropertyByName(client: any) {
        let ownerName = client.ownerName !== undefined ? client.ownerName?.toUpperCase() : '';
        let description = client.description !== undefined ? client.description?.toUpperCase() : '';

        return api.get(`/properties?ownerName=${ownerName}&description=${description}`);
    }

    static async deleteClient(id: any) {
        return api.delete(`/properties/${id}`)
    }

    static async updateProperty(data: any, id: any) {
        return api.put(`/properties/${id}`, {
            description: data.description,
            pix: data.pix ? data.pix : "",
            price: formattedValue(data.price),
            financialPrice: formattedValue(data.financialPrice),
            ownerName: data.ownerName,
            ownerDocument: data.cpf,
            email: data.mail,
            phone: data.phone,
            address: data.address,
            maritalStatus: data.maritalStatus.value
                ? data.maritalStatus.value
                : data.maritalStatus,
            bank: data.bank ? data.bank : '',
            accountBank: data.accountBank ? data.accountBank : "",
            accountNumberBank: data.accountNumberBank ? data.accountBank : "",
            linkDrive: data.linkDrive,
            nameSecondary: data.nameSecondary,
            emailSecondary: data.emailSecondary,
            phoneSecondary: data.phoneSecondary,
        })
    }
}
