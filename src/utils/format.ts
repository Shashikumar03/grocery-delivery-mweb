import type { OrderStatus } from '../types'

const IST_TIMEZONE = 'Asia/Kolkata'

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/** Format time in Indian Standard Time (IST) */
export function formatTime(iso: string): string {
  if (!iso) return ''

  const time = new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: IST_TIMEZONE,
  })

  return `${time} IST`
}

/** Format date and time in IST */
export function formatDateTime(iso: string): string {
  if (!iso) return ''

  return (
    new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: IST_TIMEZONE,
    }) + ' IST'
  )
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
