import type { Order } from '../types'

export function isOnlinePayment(order: Order): boolean {
  return order.paymentType === 'online'
}

export function isPaymentCompleted(order: Order): boolean {
  return order.paymentStatus?.toUpperCase() === 'COMPLETED'
}

/** Online orders require payment COMPLETED before delivery can be marked COMPLETED */
export function canMarkOrderCompleted(order: Order): boolean {
  if (!isOnlinePayment(order)) return true
  return isPaymentCompleted(order)
}

export function paymentTypeLabel(type: Order['paymentType']): string {
  return type === 'online' ? 'Online' : 'Cash on delivery'
}
