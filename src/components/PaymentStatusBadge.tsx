import { paymentStatusVariant } from '../utils/format'

export function PaymentStatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase()
  const variant = paymentStatusVariant(normalized)

  return (
    <span className={`badge badge--payment badge--payment-${variant}`}>
      {status}
    </span>
  )
}
