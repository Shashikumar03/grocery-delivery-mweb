import type { OrderStatus } from '../types'

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function statusLabel(status: OrderStatus | string): string {
  if (status === 'PENDING' || status === 'COMPLETED' || status === 'CANCELLED') {
    return status
  }
  return status
}

export function paymentStatusVariant(
  status: string,
): 'done' | 'pending' | 'failed' {
  const s = status.toUpperCase()
  if (s === 'COMPLETED' || s === 'SUCCESS' || s === 'CAPTURED') return 'done'
  if (s === 'FAILED' || s === 'CANCELLED' || s === 'REFUNDED') return 'failed'
  return 'pending'
}
