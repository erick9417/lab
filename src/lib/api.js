export const getApiBase = () => {
  const base = import.meta.env.VITE_API_BASE || ''
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export const apiFetch = (path, options = {}) => {
  const p = path.startsWith('/') ? path : `/${path}`
  const url = `${getApiBase()}${p}`

  let token
  try {
    token = JSON.parse(sessionStorage.getItem('lucvan_user') || 'null')?.token
  } catch {}

  const isFormData = options.body instanceof FormData
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...(options.headers || {})
  }
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(url, { 
    ...options, 
    headers,
    cache: 'no-store'
  })
}
