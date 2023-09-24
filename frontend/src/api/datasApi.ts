import api from "@/lib/axios";

interface ChartData {
  dId: string;
  variable: string;
  chartTimeAgo?: number;
}

export default {
  getChartDatas(query: ChartData, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
      params: query,
    };
    return api.get("/datas/get-small-charts", axiosHeader);
  },
  getReportDatas(query: ChartData, aToken: string) {
    const axiosHeader = {
      headers: {
        Authorization: `Bearer ${aToken}`,
      },
      params: query,
    };
    return api.get("/datas/reports", axiosHeader);
  },
};
