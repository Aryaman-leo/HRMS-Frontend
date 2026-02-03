/**
 * Central API client for HRMS Lite.
 * Base URL from env; builds full URL, JSON headers, and throws on non-ok with message.
 */

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function buildUrl(path, searchParams = {}) {
  const url = new URL(path, baseUrl)
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value != null && value !== '') url.searchParams.set(key, value)
  })
  return url.toString()
}

async function request(path, options = {}, searchParams = {}) {
  const url = buildUrl(path, searchParams)
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body)
  }
  const response = await fetch(url, config)
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  let data = null
  if (isJson) {
    try {
      data = await response.json()
    } catch {
      data = {}
    }
  }
  if (!response.ok) {
    let message = response.statusText || 'Request failed'
    if (data && typeof data === 'object') {
      message = data.message ?? data.error ?? data.detail ?? message
      if (Array.isArray(data.detail)) {
        message = data.detail.map((d) => d.msg ?? d).join(', ')
      }
    }
    const err = new Error(message)
    err.status = response.status
    err.message = message
    throw err
  }
  if (isJson) return data
  return response
}

export const api = {
  get: (path, searchParams) => request(path, { method: 'GET' }, searchParams),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export default api
