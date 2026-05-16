import type {
  Order,
  OrderItem,
  OrderStatus,
  PaymentType,
  TodayOrders,
} from '../types'
import { parseApiDateTime } from '../utils/format'

type ApiRecord = Record<string, unknown>

/** Shape returned by GET /api/admin/recent-orders */
export interface RecentOrderGroup {
  userDto: {
    id?: number
    name?: string
    email?: string
    phoneNumber?: string
    role?: string
  }
  orderDto: GroceryOrderDto[]
}

export interface GroceryOrderDto {
  orderId: number
  orderTime?: string
  orderStatus?: string
  paymentMode?: string
  address?: string
  landmark?: string
  mobile?: string
  city?: string
  pin?: string
  state?: string
  note?: string | null
  paymentDto?: {
    paymentAmount?: number
    paymentMode?: string
    paymentStatus?: string
  }
  deliveryDto?: {
    deliveryStatus?: string
    deliveryTime?: string
  }
  cartDto?: {
    cartTotalPrice?: number
    cartItemsDto?: Array<{
      productName?: string
      quantity?: number
      price?: number
    }>
  }
}

function pickString(obj: ApiRecord, ...keys: string[]): string {
  for (const key of keys) {
    const value = obj[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number') return String(value)
  }
  return ''
}

function pickNumber(obj: ApiRecord, ...keys: string[]): number {
  for (const key of keys) {
    const value = obj[key]
    if (typeof value === 'number' && !Number.isNaN(value)) return value
    if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value)
    }
  }
  return 0
}

function asRecord(value: unknown): ApiRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as ApiRecord)
    : {}
}

function mapGroceryStatus(order: ApiRecord): OrderStatus {
  const raw = (
    pickString(order, 'orderStatus') ||
    pickString(asRecord(order.deliveryDto), 'deliveryStatus')
  ).toUpperCase()

  if (raw === 'COMPLETED') return 'COMPLETED'
  if (
    raw === 'CANCELLED' ||
    raw === 'CANCELED' ||
    pickString(order, 'cancelledAt')
  ) {
    return 'CANCELLED'
  }
  return 'PENDING'
}

function mapCartItems(order: ApiRecord): OrderItem[] {
  const cart = asRecord(order.cartDto)
  const list = cart.cartItemsDto
  if (!Array.isArray(list)) return []

  return list.map((entry, index) => {
    const item = asRecord(entry)
    return {
      name: pickString(item, 'productName') || `Item ${index + 1}`,
      qty: pickNumber(item, 'quantity') || 1,
    }
  })
}

function mapPayment(order: ApiRecord): {
  paymentType: PaymentType
  paymentStatus: string | null
} {
  const payment = asRecord(order.paymentDto)
  const mode = (
    pickString(order, 'paymentMode') ||
    pickString(payment, 'paymentMode') ||
    ''
  ).toUpperCase()

  const paymentStatus =
    pickString(payment, 'paymentStatus') || null

  if (mode.includes('CASH') || mode.includes('COD')) {
    return { paymentType: 'cod', paymentStatus }
  }

  return { paymentType: 'online', paymentStatus }
}

function formatDropAddress(order: ApiRecord): string {
  const line1 = pickString(order, 'address')
  const landmark = pickString(order, 'landmark')
  const city = pickString(order, 'city')
  const state = pickString(order, 'state')
  const pin = pickString(order, 'pin')

  const parts: string[] = []
  if (line1) parts.push(line1)
  if (landmark) parts.push(`Near ${landmark}`)
  const cityLine = [city, state, pin].filter(Boolean).join(', ')
  if (cityLine) parts.push(cityLine)

  return parts.join(' · ') || 'Address not provided'
}

export function mapGroceryOrder(order: ApiRecord, user: ApiRecord): Order {
  const payment = asRecord(order.paymentDto)
  const cart = asRecord(order.cartDto)
  const orderId = pickNumber(order, 'orderId')

  const amount =
    pickNumber(cart, 'cartTotalPrice') ||
    pickNumber(payment, 'paymentAmount') ||
    0

  const { paymentType, paymentStatus } = mapPayment(order)

  return {
    id: orderId ? String(orderId) : pickString(order, 'orderId'),
    restaurant: 'Grocery Order',
    customerName: pickString(user, 'name') || 'Customer',
    customerPhone:
      pickString(order, 'mobile') || pickString(user, 'phoneNumber') || '',
    dropAddress: formatDropAddress(order),
    items: mapCartItems(order),
    amount,
    tip: 0,
    distanceKm: 0,
    status: mapGroceryStatus(order),
    placedAt: pickString(order, 'orderTime') || new Date().toISOString(),
    paymentType,
    paymentStatus,
  }
}

export function sortOrdersNewestFirst(orders: Order[]): Order[] {
  return [...orders].sort(
    (a, b) =>
      parseApiDateTime(b.placedAt).getTime() -
      parseApiDateTime(a.placedAt).getTime(),
  )
}

/** Flatten `[{ userDto, orderDto[] }]` into app orders, newest first */
export function parseRecentOrdersResponse(data: unknown): Order[] {
  if (!Array.isArray(data)) return []

  const flattened: Order[] = []

  for (const entry of data) {
    const group = asRecord(entry)

    if (group.userDto != null && Array.isArray(group.orderDto)) {
      const user = asRecord(group.userDto)
      for (const rawOrder of group.orderDto) {
        flattened.push(mapGroceryOrder(asRecord(rawOrder), user))
      }
      continue
    }

    // Fallback for flat order objects
    flattened.push(mapGroceryOrder(group, asRecord(group.userDto)))
  }

  return sortOrdersNewestFirst(flattened)
}

/** Today's completed & cancelled — completed first, then cancelled (each newest first) */
export function parseTodayHistoryResponse(data: unknown): TodayOrders {
  const all = parseRecentOrdersResponse(data)

  return {
    completed: sortOrdersNewestFirst(
      all.filter((o) => o.status === 'COMPLETED'),
    ),
    cancelled: sortOrdersNewestFirst(
      all.filter((o) => o.status === 'CANCELLED'),
    ),
  }
}
