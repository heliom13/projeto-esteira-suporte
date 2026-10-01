import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL || "https://projeto-esteira-suporte.onrender.com"

const apiExterno = axios.create({
    baseURL: `${API_BASE}/v1`,
})

export class ExternalClass {
    static async externalClient(externalId) {
        return apiExterno.get(`/processes/clients/${externalId}`)
    }

    static async externalProperty(externalId) {
        return apiExterno.get(`/processes/properties/${externalId}`)
    }

    static async externalSeller(externalId) {
        return apiExterno.get(`/processes/sellers/${externalId}`)
    }

    static async externalProcess(externalId) {
        return apiExterno.get(`/processes/external/${externalId}/steps`)
    }
}
