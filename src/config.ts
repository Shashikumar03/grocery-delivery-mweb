const envUrl = import.meta.env.VITE_API_BASE_URL

/**
 * Empty base URL → requests go to `/api/...` on the same host.
 * - Local dev: Vite proxy (vite.config.ts)
 * - Netlify: redirect proxy (netlify.toml)
 */
export const API_BASE_URL =
  envUrl !== undefined && String(envUrl).trim().length > 0
    ? String(envUrl).replace(/\/$/, '')
    : ''
