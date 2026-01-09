import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiFetch } from '../lib/api'

export default function InviteAccept(){
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token')
  const [token, setToken] = useState(tokenFromUrl || '')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{
    if(token){
      (async()=>{
        try{
          const res = await apiFetch(`/api/auth/invite/${token}`)
          if(res.ok){
            const data = await res.json()
            setEmail(data.email)
            setRole(data.role)
          } else {
            const err = await res.json()
            setMessage(err.error || 'Invitación inválida')
          }
        }catch(e){ setMessage('Error validando invitación') }
      })()
    }
  },[token])

  const submit = async ()=>{
    if(!token || !password) return setMessage('Token y contraseña son requeridos')
    try{
      setLoading(true)
      const res = await apiFetch('/api/auth/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      const data = await res.json()
      if(res.ok){
        setMessage('Cuenta creada. Ahora puedes iniciar sesión.')
        setTimeout(()=> navigate('/login'), 1500)
      } else {
        setMessage(data.error || 'Error aceptando invitación')
      }
    }catch(e){ console.error(e); setMessage('Error de red') }
    finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8] p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Aceptar Invitación</h2>
        {message && <div className="mb-3 text-sm text-red-600">{message}</div>}
        {email && <div className="mb-2 text-sm text-gray-700">Registrando: <strong>{email}</strong> — rol: {role}</div>}
        <div className="space-y-3">
          {!tokenFromUrl && (
            <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Token de invitación" className="w-full px-3 py-2 border rounded" />
          )}
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nueva contraseña" className="w-full px-3 py-2 border rounded" />
          <button onClick={submit} disabled={loading} className="w-full bg-[#0066A4] text-white py-2 rounded">{loading? 'Procesando...':'Establecer contraseña'}</button>
        </div>
      </div>
    </div>
  )
}
