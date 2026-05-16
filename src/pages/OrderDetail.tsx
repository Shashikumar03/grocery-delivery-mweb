import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Navigation,
  Phone,
  ShoppingBag,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { CopyableOrderId } from '../components/CopyableOrderId'
import { OrderStatusSelect } from '../components/OrderStatusSelect'
import { PaymentInfo } from '../components/PaymentInfo'
import { useApp } from '../context/AppContext'
import type { DeliveryOrderStatus } from '../types'
import { formatCurrency, formatTime } from '../utils/format'
import {
  canMarkOrderCompleted,
  isOnlinePayment,
} from '../utils/order'

export function OrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const {
    orders,
    todayCompleted,
    todayCancelled,
    updateOrderStatus,
    statusUpdatingId,
  } = useApp()

  const order = useMemo(() => {
    const all = [...orders, ...todayCompleted, ...todayCancelled]
    return all.find((o) => o.id === orderId)
  }, [orders, todayCompleted, todayCancelled, orderId])

  const [statusError, setStatusError] = useState<string | null>(null)
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null)

  if (!order) {
    return (
      <div className="page">
        <p>Order not found</p>
        <Link to="/orders">Back to orders</Link>
      </div>
    )
  }

  const saving = statusUpdatingId === order.id
  const canUpdateStatus =
    order.status === 'PENDING' || order.status === 'COMPLETED'
  const deliveryStatus: DeliveryOrderStatus =
    order.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING'
  const canComplete = canMarkOrderCompleted(order)
  const online = isOnlinePayment(order)

  const handleStatusChange = async (status: DeliveryOrderStatus) => {
    if (status === order.status) return

    if (status === 'COMPLETED' && !canComplete) {
      setStatusError(
        'Online payment must be COMPLETED before you can mark this delivery as completed.',
      )
      setStatusSuccess(null)
      return
    }

    setStatusError(null)
    setStatusSuccess(null)
    try {
      const message = await updateOrderStatus(order.id, status)
      setStatusSuccess(message)
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : 'Failed to update status',
      )
    }
  }

  return (
    <div className="page order-detail-page">
      <header className="detail-header">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <CopyableOrderId orderId={order.id} size="lg" />
          <Badge status={order.status} />
        </div>
      </header>

      {statusSuccess && (
        <div className="status-success-cta card" role="status">
          <CheckCircle2 size={28} />
          <div className="status-success-cta__text">
            <strong>Status updated</strong>
            <p>{statusSuccess}</p>
          </div>
          <Button fullWidth onClick={() => navigate('/orders')}>
            View all orders
          </Button>
          <button
            type="button"
            className="link-btn"
            onClick={() => setStatusSuccess(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {canUpdateStatus ? (
        <section className="card detail-section status-section">
          <OrderStatusSelect
            value={deliveryStatus}
            canMarkCompleted={canComplete}
            saving={saving}
            onChange={handleStatusChange}
          />
          {statusError && <p className="status-error">{statusError}</p>}
          {online && !canComplete && !statusSuccess && (
            <div className="banner banner--warning payment-block-banner">
              Payment status is <strong>{order.paymentStatus ?? 'pending'}</strong>.
              Delivery can be marked COMPLETED only after online payment is COMPLETED.
            </div>
          )}
          {!statusSuccess && canComplete && (
            <p className="status-hint">
              Set to <strong>COMPLETED</strong> after the order is delivered.
            </p>
          )}
        </section>
      ) : (
        <div className="banner banner--warning">
          This order was cancelled and cannot be updated.
        </div>
      )}

      <section className="card detail-section">
        <h2>{order.restaurant}</h2>
        <p className="detail-time">Placed at {formatTime(order.placedAt)}</p>
        <div className="detail-row">
          <span>Payment mode</span>
          <strong>{paymentTypeLabel(order.paymentType)}</strong>
        </div>
        {online && order.paymentStatus && (
          <div className="detail-row">
            <span>Payment status</span>
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        )}
        <div className="detail-row">
          <span>Order value</span>
          <strong className="text-accent">{formatCurrency(order.amount)}</strong>
        </div>
      </section>

      <section className="card detail-section">
        <h3>
          <ShoppingBag size={18} /> Items
        </h3>
        <ul className="item-list">
          {order.items.map((item) => (
            <li key={item.name}>
              <span>{item.qty}×</span> {item.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="card detail-section">
        <h3>Customer</h3>
        <p className="customer-name">{order.customerName}</p>
        <div className="contact-actions">
          <a href={`tel:${order.customerPhone}`} className="contact-btn">
            <Phone size={18} />
            Call
          </a>
          <button type="button" className="contact-btn">
            <Navigation size={18} />
            Navigate
          </button>
        </div>
      </section>

      <section className="card detail-section route-section">
        <div className="route-line">
          <span className="route-dot route-dot--drop" />
          <div>
            <p className="route-label">Delivery address</p>
            <p>{order.dropAddress}</p>
          </div>
        </div>
        {order.distanceKm > 0 && (
          <p className="distance">
            <MapPin size={14} /> {order.distanceKm} km
          </p>
        )}
      </section>
    </div>
  )
}
