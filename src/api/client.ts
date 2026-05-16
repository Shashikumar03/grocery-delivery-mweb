import { API_BASE_URL } from '../config'

export class ApiError extends Error {
  status: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.status = statusCode
  }
}

function buildUrl(path: string): string {
  return `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new ApiError(text || `Request failed (${res.status})`, res.status)
  }

  if (res.status === 204) return undefined as T

  const text = await res.text()
  if (!text) return undefined as T

  const contentType = res.headers.get('content-type') ?? ''
  const trimmed = text.trim()

  if (contentType.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(text) as T
    } catch {
      // Fall through — treat as plain text success
    }
  }

  return text as T
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = buildUrl(path)

  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        Accept: 'application/json, text/plain, */*',
        ...init?.headers,
      },
    })
  } catch {
    throw new ApiError(
      'Network error — could not reach the server. If this persists, check your connection.',
      0,
    )
  }

  return handleResponse<T>(res)
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path)
}

export function apiPut<T = void>(path: string): Promise<T> {
  return request<T>(path, { method: 'PUT' })
}
