import { Loader2 } from 'lucide-react'
import { DELIVERY_ORDER_STATUSES, type DeliveryOrderStatus } from '../types'

interface OrderStatusSelectProps {
  value: DeliveryOrderStatus
  canMarkCompleted: boolean
  disabled?: boolean
  saving?: boolean
  onChange: (status: DeliveryOrderStatus) => void
}

export function OrderStatusSelect({
  value,
  canMarkCompleted,
  disabled,
  saving,
  onChange,
}: OrderStatusSelectProps) {
  return (
    <div className="status-select-wrap">
      <label htmlFor="order-status" className="status-select-label">
        Delivery status
      </label>
      <div className="status-select-row">
        <select
          id="order-status"
          className="status-select"
          value={value}
          disabled={disabled || saving}
          onChange={(e) => onChange(e.target.value as DeliveryOrderStatus)}
        >
          {DELIVERY_ORDER_STATUSES.map((status) => (
            <option
              key={status}
              value={status}
              disabled={status === 'COMPLETED' && !canMarkCompleted}
            >
              {status}
              {status === 'COMPLETED' && !canMarkCompleted
                ? ' (payment pending)'
                : ''}
            </option>
          ))}
        </select>
        {saving && <Loader2 size={20} className="spin" aria-hidden />}
      </div>
    </div>
  )
}
