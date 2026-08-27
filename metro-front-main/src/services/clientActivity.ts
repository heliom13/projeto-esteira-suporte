import api from "./api";

export type ActiveCounts = Record<number, number>;

const isRegularizacaoFlow = (flowType: string) =>
  (flowType || "").toLowerCase().includes("regulariz");

async function getActiveCountsBoth(): Promise<{ financiamento: ActiveCounts; regularizacao: ActiveCounts }> {
  const financiamento: ActiveCounts = {};
  const regularizacao: ActiveCounts = {};

  const response = await api.get("/processes").catch(() => ({ data: [] }));
  (response.data || []).forEach((process: any) => {
    if (process.status !== "ACTIVE") return;
    const clientId = process?.client?.id;
    if (!clientId) return;

    const counts = isRegularizacaoFlow(process?.stepCurrent?.flowType) ? regularizacao : financiamento;
    counts[clientId] = (counts[clientId] || 0) + 1;
  });

  return {financiamento, regularizacao};
}

export class ClientActivityService {
  static async getFinancingActiveCounts(): Promise<ActiveCounts> {
    const {financiamento} = await getActiveCountsBoth();
    return financiamento;
  }

  static async getRegularizationActiveCounts(): Promise<ActiveCounts> {
    const {regularizacao} = await getActiveCountsBoth();
    return regularizacao;
  }
}
