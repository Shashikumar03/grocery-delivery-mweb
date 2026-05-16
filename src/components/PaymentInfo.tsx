import type { Order } from '../types'
import { isOnlinePayment, paymentTypeLabel } from '../utils/order'
import { PaymentStatusBadge } from './PaymentStatusBadge'

interface PaymentInfoProps {
  order: Order
  /** Compact layout for order list cards */
  compact?: boolean
}

export function PaymentInfo({ order, compact = false }: PaymentInfoProps) {
  const online = isOnlinePayment(order)
  const modeLabel = paymentTypeLabel(order.paymentType)

  if (compact) {
    return (
      <div className="payment-info payment-info--compact">
        <span className="payment-info__compact-label">Payment mode</span>
        <span className="payment-info__mode">{modeLabel}</span>
        {online && order.paymentStatus && (
          <PaymentStatusBadge status={order.paymentStatus} />
        )}
      </div>
    )
  }

  return (
    <div className="payment-info">
      <div className="payment-info__row">
        <span className="payment-info__label">Payment mode</span>
        <strong className="payment-info__mode">{modeLabel}</strong>
      </div>
      {online && order.paymentStatus && (
        <div className="payment-info__row">
          <span className="payment-info__label">Payment status</span>
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      )}
    </div>
  )
}
