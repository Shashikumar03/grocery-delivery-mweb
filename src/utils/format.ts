import type { OrderStatus } from '../types'

const IST_TIMEZONE = 'Asia/Kolkata'

/**
 * API returns UTC datetimes without "Z" (e.g. 2026-05-16T10:49:01.029864).
 * Parse as UTC, then format in IST for display.
 */
export function parseApiDateTime(iso: string): Date {
  if (!iso?.trim()) return new Date()

  const s = iso.trim()

  if (/[Zz]$/.test(s) || /[+-]\d{2}:?\d{2}$/.test(s)) {
    return new Date(s)
  }

  const normalized = s.includes('T') ? s : `${s}T00:00:00`
  return new Date(`${normalized}Z`)
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

/** Format time in Indian Standard Time (IST) */
export function formatTime(iso: string): string {
  if (!iso) return ''

  const time = parseApiDateTime(iso).toLocaleTimeString('en-IN', {
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
    parseApiDateTime(iso).toLocaleString('en-IN', {
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
