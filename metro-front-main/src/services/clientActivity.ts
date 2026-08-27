import api from "./api";

const FINANCING_ENDPOINTS = ["cashs", "consignments", "consortiums", "contracts", "financings", "loans"];
const REGULARIZATION_ENDPOINTS = ["regularizations"];

export type ActiveCounts = Record<number, number>;

async function countByClient(endpoints: string[]): Promise<ActiveCounts> {
  const counts: ActiveCounts = {};
  const responses = await Promise.all(
    endpoints.map((endpoint) => api.get(`/${endpoint}`).catch(() => ({ data: [] })))
  );
  responses.forEach((response) => {
    (response.data || []).forEach((item: any) => {
      const clientId = item?.proposal?.client?.id;
      if (clientId) {
        counts[clientId] = (counts[clientId] || 0) + 1;
      }
    });
  });
  return counts;
}

export class ClientActivityService {
  static async getFinancingActiveCounts(): Promise<ActiveCounts> {
    return countByClient(FINANCING_ENDPOINTS);
  }

  static async getRegularizationActiveCounts(): Promise<ActiveCounts> {
    return countByClient(REGULARIZATION_ENDPOINTS);
  }
}
