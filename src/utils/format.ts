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
