export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED'

/** Statuses delivery partner can set via API */
export type DeliveryOrderStatus = 'PENDING' | 'COMPLETED'

export type PartnerStatus = 'online' | 'offline'

export const DELIVERY_ORDER_STATUSES: DeliveryOrderStatus[] = ['PENDING', 'COMPLETED']

export interface OrderItem {
  name: string
  qty: number
}

export interface Order {
  id: string
  restaurant: string
  customerName: string
  customerPhone: string
  dropAddress: string
  items: OrderItem[]
  amount: number
  tip: number
  distanceKm: number
  status: OrderStatus
  placedAt: string
  paymentType: 'cod' | 'prepaid'
}

export interface TodayOrders {
  completed: Order[]
  cancelled: Order[]
}
