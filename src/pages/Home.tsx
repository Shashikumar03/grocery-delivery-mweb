import { MapPin, Navigation, Package, Power, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { CopyableOrderId } from '../components/CopyableOrderId'
import { PaymentInfo } from '../components/PaymentInfo'
import { useApp } from '../context/AppContext'

export function Home() {
  const {
    partnerStatus,
    setPartnerStatus,
    activeOrder,
    orders,
    todayCompleted,
    ordersLoading,
    refreshAllOrders,
  } = useApp()

  const pendingCount = orders.filter((o) => o.status === 'PENDING').length
  const completedCount = todayCompleted.length

  const toggleOnline = () => {
    setPartnerStatus(partnerStatus === 'online' ? 'offline' : 'online')
  }

  return (
    <div className="page home-page">
      <header className="page-header home-header">
        <div>
          <p className="greeting">Delivery partner</p>
          <h1>RapidDrop</h1>
        </div>
        <button
          type="button"
          className={`status-pill status-pill--${partnerStatus}`}
          onClick={toggleOnline}
        >
          <Power size={16} />
          {partnerStatus === 'online' ? 'Online' : 'Offline'}
        </button>
      </header>

      <section className="stats-grid stats-grid--two">
        <div className="stat-card">
          <Package size={20} />
          <span className="stat-value">{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-card--accent">
          <CheckCircle2 size={20} />
          <span className="stat-value">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
      </section>

      {partnerStatus === 'offline' && (
        <div className="banner banner--warning">
          Go online to receive new delivery requests
        </div>
      )}

      <section className="section">
        <div className="section-head">
          <h2>Active delivery</h2>
          {activeOrder && <Badge status={activeOrder.status} />}
        </div>

        {activeOrder ? (
          <div className="active-order card">
            <CopyableOrderId orderId={activeOrder.id} size="sm" className="active-order__id" />
            <h3>{activeOrder.restaurant}</h3>
            <p className="active-order__customer">{activeOrder.customerName}</p>
            <PaymentInfo order={activeOrder} compact />
            <div className="active-order__route">
              <span className="route-dot route-dot--drop" />
              <p>{activeOrder.dropAddress}</p>
            </div>
            <div className="active-order__actions">
              <Button variant="outline" className="btn-icon">
                <Navigation size={18} />
                Navigate
              </Button>
              <Link to={`/orders/${activeOrder.id}`}>
                <Button fullWidth>View order</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="empty-state card">
            <MapPin size={32} />
            <p>
              {ordersLoading
                ? 'Loading orders…'
                : 'No active delivery right now'}
            </p>
            <Link to="/orders">
              <Button variant="secondary">View all orders</Button>
            </Link>
            {!ordersLoading && (
              <Button variant="ghost" onClick={() => void refreshAllOrders()}>
                Refresh orders
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
