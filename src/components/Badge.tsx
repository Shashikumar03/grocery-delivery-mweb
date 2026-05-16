import type { OrderStatus } from '../types'
import { statusLabel } from '../utils/format'

const variantMap: Record<OrderStatus, string> = {
  PENDING: 'badge--assigned',
  COMPLETED: 'badge--done',
  CANCELLED: 'badge--cancelled',
}

export function Badge({ status }: { status: OrderStatus }) {
  return (
    <span className={`badge ${variantMap[status]}`}>
      {statusLabel(status)}
    </span>
  )
}
