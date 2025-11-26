import { api } from "../utils/apiClient";

export interface AlertItem {
  _id: string;
  item_name: string;
  barcode?: string;
  category: string;
  quantity: number;
  threshold: number;
  expiry_date?: string;
  status: string;
  severity: 'critical' | 'warning' | 'low-stock' | 'out-of-stock';
  alertType: 'expired' | 'expiring-soon' | 'expiring' | 'low-stock' | 'out-of-stock';
  daysLeft: number;
}

export interface AlertStats {
  total: number;
  critical: number;
  warning: number;
  lowStock: number;
  outOfStock: number;
  expired: number;
  expiringSoon: number;
  expiring: number;
}

export interface AlertsResponse {
  alerts: AlertItem[];
  stats: AlertStats;
}

// Get all alerts (low stock and expiring items)
export const getAlerts = async (): Promise<AlertsResponse> => {
  const response = await api.get("/inventory/alerts");
  return await response.json();
};
