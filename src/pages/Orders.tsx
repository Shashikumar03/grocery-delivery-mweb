import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { OrderCard } from '../components/OrderCard'
import { Button } from '../components/Button'
import { useApp } from '../context/AppContext'

type Filter = 'active' | 'today'

export function Orders() {
  const {
    orders,
    ordersLoading,
    ordersError,
    todayCompleted,
    todayCancelled,
    todayLoading,
    todayError,
    refreshAllOrders,
  } = useApp()
  const [filter, setFilter] = useState<Filter>('active')
  const [refreshing, setRefreshing] = useState(false)

  const activeOrders = useMemo(
    () => orders.filter((o) => o.status === 'PENDING'),
    [orders],
  )

  const todayTotal = todayCompleted.length + todayCancelled.length
  const isLoading =
    filter === 'active'
      ? ordersLoading && !orders.length
      : todayLoading && !todayTotal

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshAllOrders()
    setRefreshing(false)
  }

  const countLabel =
    filter === 'active'
      ? `${activeOrders.length} pending`
      : `${todayTotal} today (${todayCompleted.length} completed, ${todayCancelled.length} cancelled)`

  return (
    <div className="page orders-page">
      <header className="page-header orders-header">
        <div>
          <h1>Orders</h1>
          <p>
            {isLoading ? 'Loading orders…' : countLabel}
          </p>
        </div>
        <button
          type="button"
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={(ordersLoading || todayLoading) && refreshing}
          aria-label="Refresh orders"
        >
          <RefreshCw
            size={20}
            className={
              ordersLoading || todayLoading || refreshing ? 'spin' : undefined
            }
          />
        </button>
      </header>

      {(ordersError || todayError) && (
        <div className="banner banner--error">
          <AlertCircle size={18} />
          <span>{filter === 'active' ? ordersError : todayError || ordersError}</span>
          <Button variant="ghost" onClick={handleRefresh}>
            Retry
          </Button>
        </div>
      )}

      <div className="filter-tabs" role="tablist">
        {(['active', 'today'] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={`filter-tab${filter === f ? ' filter-tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'active' ? 'Active' : 'Today'}
          </button>
        ))}
      </div>

      <div className="order-list">
        {filter === 'active' ? (
          isLoading ? (
            <div className="empty-state card">
              <Loader2 size={32} className="spin" />
              <p>Fetching active orders…</p>
            </div>
          ) : activeOrders.length === 0 ? (
            <div className="empty-state card">
              <p>No pending orders</p>
              <Button variant="secondary" onClick={handleRefresh}>
                Refresh
              </Button>
            </div>
          ) : (
            activeOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )
        ) : isLoading ? (
          <div className="empty-state card">
            <Loader2 size={32} className="spin" />
            <p>Fetching today&apos;s orders…</p>
          </div>
        ) : todayTotal === 0 ? (
          <div className="empty-state card">
            <p>No completed or cancelled orders today</p>
            <Button variant="secondary" onClick={handleRefresh}>
              Refresh
            </Button>
          </div>
        ) : (
          <>
            {todayCompleted.length > 0 && (
              <section className="order-section">
                <h2 className="order-section__title">Completed</h2>
                {todayCompleted.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </section>
            )}
            {todayCancelled.length > 0 && (
              <section className="order-section">
                <h2 className="order-section__title order-section__title--cancelled">
                  Cancelled
                </h2>
                {todayCancelled.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
