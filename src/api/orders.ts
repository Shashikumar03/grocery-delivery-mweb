import { apiGet, apiPut } from './client'
import { parseRecentOrdersResponse, parseTodayHistoryResponse } from './mapOrder'
import type { DeliveryOrderStatus, Order, TodayOrders } from '../types'

export async function fetchRecentOrders(): Promise<Order[]> {
  const data = await apiGet<unknown>('/api/admin/recent-orders')
  return parseRecentOrdersResponse(data)
}

export async function fetchTodayHistoryOrders(): Promise<TodayOrders> {
  const data = await apiGet<unknown>(
    '/api/place-order/today-cancel-and_completed-order',
  )
  return parseTodayHistoryResponse(data)
}

export async function updateOrderStatusApi(
  orderId: string,
  status: DeliveryOrderStatus,
): Promise<string> {
  const result = await apiPut<string>(
    `/api/place-order/${encodeURIComponent(orderId)}/status?status=${status}`,
  )

  if (typeof result === 'string' && result.trim()) {
    return result.trim()
  }

  return `Order status updated to ${status}`
}
