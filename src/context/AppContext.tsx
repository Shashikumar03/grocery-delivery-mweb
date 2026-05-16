import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  fetchRecentOrders,
  fetchTodayHistoryOrders,
  updateOrderStatusApi,
} from '../api/orders'
import type { DeliveryOrderStatus, Order, PartnerStatus } from '../types'

interface AppContextValue {
  partnerStatus: PartnerStatus
  orders: Order[]
  ordersLoading: boolean
  ordersError: string | null
  todayCompleted: Order[]
  todayCancelled: Order[]
  todayLoading: boolean
  todayError: string | null
  statusUpdatingId: string | null
  setPartnerStatus: (status: PartnerStatus) => void
  updateOrderStatus: (orderId: string, status: DeliveryOrderStatus) => Promise<string>
  refreshOrders: () => Promise<void>
  refreshTodayOrders: () => Promise<void>
  refreshAllOrders: () => Promise<void>
  activeOrder: Order | undefined
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [partnerStatus, setPartnerStatus] = useState<PartnerStatus>('online')
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)
  const [todayCompleted, setTodayCompleted] = useState<Order[]>([])
  const [todayCancelled, setTodayCancelled] = useState<Order[]>([])
  const [todayLoading, setTodayLoading] = useState(false)
  const [todayError, setTodayError] = useState<string | null>(null)
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true)
    setOrdersError(null)
    try {
      const data = await fetchRecentOrders()
      setOrders(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load orders'
      setOrdersError(message)
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  const refreshTodayOrders = useCallback(async () => {
    setTodayLoading(true)
    setTodayError(null)
    try {
      const { completed, cancelled } = await fetchTodayHistoryOrders()
      setTodayCompleted(completed)
      setTodayCancelled(cancelled)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load today\'s orders'
      setTodayError(message)
    } finally {
      setTodayLoading(false)
    }
  }, [])

  const refreshAllOrders = useCallback(async () => {
    await Promise.all([refreshOrders(), refreshTodayOrders()])
  }, [refreshOrders, refreshTodayOrders])

  useEffect(() => {
    void refreshAllOrders()
  }, [refreshAllOrders])

  const updateOrderStatus = useCallback(
    async (orderId: string, status: DeliveryOrderStatus) => {
      setStatusUpdatingId(orderId)
      try {
        const message = await updateOrderStatusApi(orderId, status)
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
        )
        if (status === 'COMPLETED') {
          await refreshTodayOrders()
        }
        return message
      } finally {
        setStatusUpdatingId(null)
      }
    },
    [refreshTodayOrders],
  )

  const activeOrder = useMemo(
    () => orders.find((o) => o.status === 'PENDING'),
    [orders],
  )

  const value = useMemo(
    () => ({
      partnerStatus,
      orders,
      ordersLoading,
      ordersError,
      todayCompleted,
      todayCancelled,
      todayLoading,
      todayError,
      statusUpdatingId,
      setPartnerStatus,
      updateOrderStatus,
      refreshOrders,
      refreshTodayOrders,
      refreshAllOrders,
      activeOrder,
    }),
    [
      partnerStatus,
      orders,
      ordersLoading,
      ordersError,
      todayCompleted,
      todayCancelled,
      todayLoading,
      todayError,
      statusUpdatingId,
      updateOrderStatus,
      refreshOrders,
      refreshTodayOrders,
      refreshAllOrders,
      activeOrder,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
