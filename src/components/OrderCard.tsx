import { ChevronRight, MapPin, IndianRupee } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Order } from '../types'
import { formatCurrency, formatTime } from '../utils/format'
import { Badge } from './Badge'
import { CopyableOrderId } from './CopyableOrderId'

export function OrderCard({ order }: { order: Order }) {
  return (
    <Link to={`/orders/${order.id}`} className="order-card">
      <div className="order-card__top">
        <div>
          <CopyableOrderId orderId={order.id} size="sm" className="order-card__id" />
          <h3 className="order-card__restaurant">{order.restaurant}</h3>
        </div>
        <Badge status={order.status} />
      </div>
      <p className="order-card__customer">{order.customerName}</p>
      <div className="order-card__meta">
        {order.distanceKm > 0 && (
          <span>
            <MapPin size={14} />
            {order.distanceKm} km
          </span>
        )}
        {order.items.length > 0 && (
          <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
        )}
        <span>
          <IndianRupee size={14} />
          {formatCurrency(order.amount + order.tip)}
        </span>
        <span>{formatTime(order.placedAt)}</span>
      </div>
      <ChevronRight className="order-card__chevron" size={20} />
    </Link>
  )
}
