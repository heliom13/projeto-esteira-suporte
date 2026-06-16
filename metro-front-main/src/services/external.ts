import axios from 'axios'

const apiExterno = axios.create({
    baseURL: "https://metro-app-fm78p.ondigitalocean.app/v1",
    // baseURL: "http://localhost:8080/v1",
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
