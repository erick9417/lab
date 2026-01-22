import { useEffect, useState } from "react"
import { Dialog } from "@headlessui/react"
import CreateUserForm from './CreateUserForm';
import { CreateClinicForm } from './UserInviteForm';
import { apiFetch } from "../lib/api"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../components/AdminSidebar"

export default function UsersManagement() {
  const navigate = useNavigate()
  const [tab, setTab] = useState("users")
  const [users, setUsers] = useState([])
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showUserModal, setShowUserModal] = useState(false)
  const [showClinicModal, setShowClinicModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchUser, setSearchUser] = useState("")
  const [searchClinic, setSearchClinic] = useState("")
  const [showEditClinicModal, setShowEditClinicModal] = useState(false)
  const [editingClinic, setEditingClinic] = useState(null)
  const [showDeleteClinicConfirm, setShowDeleteClinicConfirm] = useState(false)
  const [clinicToDelete, setClinicToDelete] = useState(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const roleLabels = {
    admin: "Administrador",
    clinic: "Clínica",
    workshop: "Producción",
    production: "Producción",
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [uRes, cRes] = await Promise.all([
        apiFetch("/api/users?limit=100&offset=0"),
        apiFetch("/api/clinics?limit=100&offset=0"),
      ])

      const usersJson = uRes.ok ? await uRes.json() : []
      const clinicsJson = cRes.ok ? await cRes.json() : []

      // Mapa de clínicas para enriquecer usuarios con nombre de clínica
      const clinicNameById = new Map(clinicsJson.map(c => [c.id, c.name]))

      const enrichedUsers = usersJson.map(u => ({
        ...u,
        clinic_name: u.clinic_name || (u.clinic_id ? clinicNameById.get(u.clinic_id) || null : null),
      }))

      setClinics(clinicsJson)
      setUsers(enrichedUsers)
    } catch (e) {
      setError("Error cargando datos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const removeUser = async (id) => {
    if (!window.confirm("Confirmar eliminación de usuario")) return
    const res = await apiFetch(`/api/users/${id}`, { method: "DELETE" })
    if (res.ok) setUsers(users.filter((u) => u.id !== id))
    else alert("Error al eliminar usuario")
  }

  const removeClinic = async (id) => {
    const clinic = clinics.find(c => c.id === id)
    setClinicToDelete(clinic)
    setDeleteConfirmText("")
    setShowDeleteClinicConfirm(true)
  }
  
  const confirmDeleteClinic = async () => {
    if (deleteConfirmText !== 'eliminar clinica') {
      alert("Debe escribir exactamente: eliminar clinica")
      return
    }

    const res = await apiFetch(`/api/clinics/${clinicToDelete.id}`, { 
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmText: deleteConfirmText })
    })
    
    if (res.ok) {
      const data = await res.json()
      setClinics(clinics.filter((c) => c.id !== clinicToDelete.id))
      setUsers(users.filter(u => u.clinic_id !== clinicToDelete.id))
      setShowDeleteClinicConfirm(false)
      setClinicToDelete(null)
      setDeleteConfirmText("")
      alert(data.message || "Clínica eliminada exitosamente")
    } else {
      const data = await res.json()
      alert(data.error || "Error al eliminar clínica")
    }
  }
  
  const disableClinic = async (id) => {
    if (!window.confirm("¿Desactivar clínica? Esto también desactivará todos sus usuarios.")) return
    const res = await apiFetch(`/api/clinics/${id}/disable`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: true })
    })
    if (res.ok) {
      setClinics(clinics.map(c => c.id === id ? { ...c, disabled: true } : c))
      setUsers(users.map(u => u.clinic_id === id ? { ...u, disabled: true } : u))
    } else {
      alert("Error al desactivar clínica")
    }
  }
  
  const enableClinic = async (id) => {
    const res = await apiFetch(`/api/clinics/${id}/enable`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: false })
    })
    if (res.ok) {
      setClinics(clinics.map(c => c.id === id ? { ...c, disabled: false } : c))
    } else {
      alert("Error al activar clínica")
    }
  }

  const toggleClinicStatus = async (clinic, targetDisabled) => {
    const endpoint = targetDisabled ? "disable" : "enable"
    const res = await apiFetch(`/api/clinics/${clinic.id}/${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ disabled: targetDisabled })
    })
    if (res.ok) {
      setClinics(clinics.map(c => c.id === clinic.id ? { ...c, disabled: targetDisabled } : c))
      if (targetDisabled) {
        setUsers(users.map(u => u.clinic_id === clinic.id ? { ...u, disabled: true } : u))
      }
      setEditingClinic(prev => prev && prev.id === clinic.id ? { ...prev, disabled: targetDisabled } : prev)
      return true
    }
    const data = await res.json().catch(() => null)
    alert(data?.error || "Error al cambiar estado de clínica")
    return false
  }
  const updateClinic = async (clinic) => {
    const res = await apiFetch(`/api/clinics/${clinic.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clinic)
    })
    if (res.ok) {
      setShowEditClinicModal(false)
      await loadData() // Recarga datos frescos de la BD
    } else {
      alert("Error al actualizar clínica")
    }
  }
  if (loading) return <div className="p-6">Cargando...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  const sidebarTabs = [
    { id: 'users', label: 'Usuarios' },
    { id: 'clinics', label: 'Clínicas' },
    { id: 'admin', label: 'Panel Admin', icon: '⬅️', onClick: () => navigate('/admin') }
  ]

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex">
      <AdminSidebar activeTab={tab} onTabChange={setTab} tabs={sidebarTabs} />

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto lg:ml-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 lg:mt-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {tab === 'users' ? 'Usuarios' : tab === 'clinics' ? 'Clínicas' : 'Pacientes Huérfanos'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Panel de gestión</p>
            </div>
            {tab === 'users' ? (
              <button className="bg-emerald-600 text-white px-4 py-2 rounded shadow hover:bg-emerald-700 transition" onClick={()=>navigate('/admin/users/new')}>Crear nuevo usuario</button>
            ) : tab === 'clinics' ? (
              <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition" onClick={()=>navigate('/admin/clinics/new')}>Crear nueva clínica</button>
            ) : null}
          </div>

        {tab === "users" && (
          <div>
            <div className="mb-4">
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2" 
                placeholder="Buscar por email o nombre..." 
                value={searchUser}
                onChange={e=>setSearchUser(e.target.value)}
              />
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50 text-blue-900">
                    <th className="py-2 px-3 text-left">Nombre</th>
                    <th className="py-2 px-3 text-left">Correo</th>
                    <th className="py-2 px-3 text-left">Rol</th>
                    <th className="py-2 px-3 text-left">Clínica</th>
                    <th className="py-2 px-3 text-left">Estado</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u => {
                      const term = searchUser.toLowerCase()
                      return (
                        (u.email && u.email.toLowerCase().includes(term)) ||
                        (u.name && u.name.toLowerCase().includes(term))
                      )
                    })
                    .map((u) => (
                      <tr key={u.id} className="border-b hover:bg-blue-50">
                        <td className="py-2 px-3">{u.name || "-"}</td>
                        <td className="px-3">{u.email}</td>
                        <td className="px-3">{roleLabels[u.role] || u.role}</td>
                        <td className="px-3">{u.clinic_name || "-"}</td>
                        <td className="px-3">
                          <span className={`inline-block text-xs px-2 py-1 rounded ${u.disabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {u.disabled ? "Deshabilitado" : "Activo"}
                          </span>
                        </td>
                        <td className="px-3 text-right space-x-2">
                          <button className="text-blue-600 hover:underline text-xs" onClick={()=>{ setEditingUser(u); setShowEditModal(true) }}>Editar</button>
                          <button className="text-red-600 hover:underline text-xs" onClick={()=>removeUser(u.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "clinics" && (
          <div>
            <div className="mb-4">
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2" 
                placeholder="Buscar clínica por nombre..."
                value={searchClinic}
                onChange={e=>setSearchClinic(e.target.value)}
              />
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-50 text-blue-900">
                    <th className="py-2 px-3 text-left">Nombre</th>
                    <th className="py-2 px-3 text-left">País</th>
                    <th className="py-2 px-3 text-left">Teléfono</th>
                    <th className="py-2 px-3 text-left">Dirección</th>
                    <th className="py-2 px-3 text-left">Estado</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {clinics
                    .filter(c => c.name && c.name.toLowerCase().includes(searchClinic.toLowerCase()))
                    .map((c) => (
                      <tr key={c.id} className="border-b hover:bg-blue-50">
                        <td className="py-2 px-3">{c.name}</td>
                        <td className="px-3">{c.country || "-"}</td>
                        <td className="px-3">{c.phone || "-"}</td>
                        <td className="px-3">{c.address ? c.address.substring(0, 30) + (c.address.length > 30 ? "..." : "") : "-"}</td>
                        <td className="px-3">
                          <span className={`inline-block text-xs px-2 py-1 rounded ${c.disabled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {c.disabled ? "Desactivada" : "Activa"}
                          </span>
                        </td>
                        <td className="px-3 text-right space-x-2">
                          <button className="text-blue-600 hover:underline text-xs" onClick={()=>{ setEditingClinic(c); setShowEditClinicModal(true) }}>Editar</button>
                          <button className="text-red-600 hover:underline text-xs" onClick={()=>removeClinic(c.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showEditModal && editingUser && (
          <Dialog open={true} onClose={()=>setShowEditModal(false)} className="fixed z-50 inset-0 overflow-y-auto p-4">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
                <h2 className="text-lg font-bold mb-4">Editar usuario</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Nombre</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={editingUser.name || ""}
                      onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      placeholder="Nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Email</label>
                    <input
                      type="email"
                      className="w-full border rounded px-3 py-2"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      placeholder="correo@dominio.com"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Rol</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={editingUser.role}
                      onChange={(e) => {
                        const newRole = e.target.value
                        setEditingUser({
                          ...editingUser,
                          role: newRole,
                          clinic_id: newRole === "clinic" ? editingUser.clinic_id : null,
                          clinic_name: newRole === "clinic" ? editingUser.clinic_name : null,
                        })
                      }}
                    >
                      <option value="admin">Administrador</option>
                      <option value="clinic">Clínica</option>
                      <option value="workshop">Producción</option>
                    </select>
                  </div>
                  {editingUser.role === "clinic" && (
                    <div>
                      <label className="block mb-1 font-medium">Clínica</label>
                      <select 
                        className="w-full border rounded px-3 py-2" 
                        value={editingUser.clinic_id || ""}
                        onChange={(e) => {
                          const clinicId = e.target.value ? parseInt(e.target.value) : null;
                          const selectedClinic = clinics.find(c => c.id === clinicId);
                          setEditingUser({ 
                            ...editingUser, 
                            clinic_id: clinicId,
                            clinic_name: selectedClinic?.name || null
                          });
                        }}
                      >
                        <option value="">Sin clínica asignada</option>
                        {clinics.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block mb-1 font-medium">Estado</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        className="w-full border rounded px-3 py-2 bg-gray-100" 
                        value={editingUser.disabled ? "Deshabilitado" : "Activo"} 
                        disabled 
                      />
                      <button 
                        className={`px-4 py-2 rounded text-white whitespace-nowrap ${editingUser.disabled ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`}
                        onClick={() => {
                          if (editingUser.disabled && editingUser.clinic_id && clinics.find(c => c.id === editingUser.clinic_id)?.disabled) {
                            alert("No puedes habilitar un usuario si su clínica está desactivada");
                            return;
                          }
                          const endpoint = editingUser.disabled ? "enable" : "disable"
                          apiFetch(`/api/users/${editingUser.id}/${endpoint}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ disabled: !editingUser.disabled })
                          }).then(res => {
                            if (res.ok) {
                              setUsers(users.map((u) => u.id === editingUser.id ? { ...u, disabled: !editingUser.disabled } : u))
                              setEditingUser({ ...editingUser, disabled: !editingUser.disabled })
                            } else {
                              res.json().then(data => {
                                alert(data.error || "Error al cambiar estado del usuario");
                              });
                            }
                          })
                        }}
                      >
                        {editingUser.disabled ? "Habilitar" : "Deshabilitar"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={()=>setShowEditModal(false)}>Cancelar</button>
                  <button 
                    type="button" 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => {
                      if (editingUser.role === "clinic" && !editingUser.clinic_id) {
                        alert("Selecciona una clínica para usuarios con rol clínica");
                        return;
                      }

                      apiFetch(`/api/users/${editingUser.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email: editingUser.email,
                          name: editingUser.name,
                          role: editingUser.role,
                          clinic_id: editingUser.role === "clinic" ? editingUser.clinic_id : null,
                        })
                      }).then(async res => {
                        if (res.ok) {
                          const updated = await res.json().catch(() => null)
                          const merged = updated ? { ...editingUser, ...updated } : editingUser
                          setUsers(users.map(u => u.id === editingUser.id ? merged : u))
                          setShowEditModal(false)
                        } else {
                          const data = await res.json().catch(() => null)
                          alert(data?.error || "Error al actualizar usuario")
                        }
                      })
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </Dialog>
        )}

        {showUserModal && (
          <Dialog open={true} onClose={()=>setShowUserModal(false)} className="fixed z-50 inset-0 overflow-y-auto p-4">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
                <h2 className="text-lg font-bold mb-4">Crear nuevo usuario</h2>
                <CreateUserForm 
                  clinics={clinics} 
                  onClose={()=>setShowUserModal(false)} 
                  onCreated={(u)=>{if (u) { setUsers([...users, u]); setShowUserModal(false); loadData(); }}}
                  onClinicCreated={(c)=>{if (c) loadData()}}
                />
              </div>
            </div>
          </Dialog>
        )}

        {showClinicModal && (
          <Dialog open={true} onClose={()=>setShowClinicModal(false)} className="fixed z-50 inset-0 overflow-y-auto p-4">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
                <h2 className="text-lg font-bold mb-4">Crear nueva clínica</h2>
                <CreateClinicForm onCreated={(c)=>{if (c) { setShowClinicModal(false); loadData(); }}} onCancel={()=>setShowClinicModal(false)} />
              </div>
            </div>
          </Dialog>
        )}

        {showEditClinicModal && editingClinic && (
          <Dialog open={true} onClose={()=>setShowEditClinicModal(false)} className="fixed z-50 inset-0 overflow-y-auto p-4">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
                <h2 className="text-lg font-bold mb-4">Editar clínica</h2>
                <EditClinicForm 
                  clinic={editingClinic} 
                  onSave={(c) => updateClinic(c)} 
                  onCancel={()=>setShowEditClinicModal(false)}
                  onToggleStatus={(targetDisabled) => toggleClinicStatus(editingClinic, targetDisabled)}
                />
              </div>
            </div>
          </Dialog>
        )}

        {/* Confirmación de eliminación de clínica con CASCADE */}
        {showDeleteClinicConfirm && clinicToDelete && (
          <Dialog open={true} onClose={()=>{setShowDeleteClinicConfirm(false); setDeleteConfirmText("");}} className="fixed z-50 inset-0 overflow-y-auto p-4">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-black opacity-30"></div>
              <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
                <h2 className="text-xl font-bold mb-4 text-red-600">⚠️ Confirmar Eliminación</h2>
                <div className="space-y-3 mb-6">
                  <p className="text-gray-700">
                    Está a punto de eliminar permanentemente la clínica:
                  </p>
                  <p className="font-bold text-lg text-gray-900">{clinicToDelete.name}</p>
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-red-800 font-semibold mb-2">⚠️ Esta acción eliminará:</p>
                    <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                      <li>La clínica y toda su información</li>
                      <li>Todos los usuarios asociados</li>
                      <li>Todos los pacientes de esta clínica</li>
                      <li>Todas las solicitudes relacionadas</li>
                    </ul>
                    <p className="text-red-800 font-bold mt-2">Esta acción NO se puede deshacer.</p>
                  </div>
                  <div className="pt-2">
                    <label className="block mb-2 font-medium text-gray-700">
                      Para confirmar, escriba: <span className="font-mono bg-gray-100 px-2 py-1 rounded">eliminar clinica</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border-2 border-red-300 rounded px-3 py-2 focus:border-red-500 focus:outline-none"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Escriba aquí..."
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button 
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                    onClick={()=>{setShowDeleteClinicConfirm(false); setDeleteConfirmText("");}}
                  >
                    Cancelar
                  </button>
                  <button 
                    className={`px-4 py-2 rounded text-white transition ${
                      deleteConfirmText === 'eliminar clinica' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={confirmDeleteClinic}
                    disabled={deleteConfirmText !== 'eliminar clinica'}
                  >
                    Eliminar Permanentemente
                  </button>
                </div>
              </div>
            </div>
          </Dialog>
        )}
        </div>
      </div>
    </div>
  )
}

function EditClinicForm({ clinic, onSave, onCancel, onToggleStatus }) {
  const [name, setName] = useState(clinic.name);
  const [country, setCountry] = useState(clinic.country || '');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState(clinic.address || '');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(!!clinic.disabled);

  const countryCodes = {
    'Argentina': '+54', 'Bolivia': '+591', 'Brasil': '+55', 'Chile': '+56',
    'Colombia': '+57', 'Costa Rica': '+506', 'Cuba': '+53', 'Ecuador': '+593',
    'El Salvador': '+503', 'Guatemala': '+502', 'Honduras': '+504', 'México': '+52',
    'Nicaragua': '+505', 'Panamá': '+507', 'Paraguay': '+595', 'Perú': '+51',
    'Puerto Rico': '+1', 'República Dominicana': '+1', 'Uruguay': '+598', 'Venezuela': '+58'
  };

  useEffect(() => {
    if (clinic.phone) {
      const matchedCode = Object.values(countryCodes).find(code => clinic.phone.startsWith(code));
      if (matchedCode) {
        setCountryCode(matchedCode);
        setPhone(clinic.phone.substring(matchedCode.length).trim());
      } else {
        setPhone(clinic.phone);
      }
    }
  }, [clinic.phone]);

  const handleCountryChange = (selectedCountry) => {
    setCountry(selectedCountry);
    if (selectedCountry && countryCodes[selectedCountry]) {
      setCountryCode(countryCodes[selectedCountry]);
      setPhone('');
    } else {
      setCountryCode('');
      setPhone('');
    }
  };

  const handleSave = () => {
    setLoading(true);
    onSave({
      id: clinic.id,
      name,
      country,
      phone: phone ? countryCode + phone : null,
      address,
      disabled,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Nombre de la clínica</label>
        <input className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1 font-medium">País</label>
        <select className="w-full border rounded px-3 py-2" value={country} onChange={e=>handleCountryChange(e.target.value)} required>
          <option value="">Selecciona un País</option>
          <option value="Costa Rica">Costa Rica</option>
          <option value="Panamá">Panamá</option>
          <option value="Paraguay">Paraguay</option>
          <option value="Perú">Perú</option>
          <option value="Puerto Rico">Puerto Rico</option>
          <option value="República Dominicana">República Dominicana</option>
          <option value="Uruguay">Uruguay</option>
          <option value="Venezuela">Venezuela</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Teléfono</label>
        <div className="flex gap-2">
          <input type="text" className="w-20 border rounded px-3 py-2 bg-gray-100 font-semibold" value={countryCode} disabled placeholder="Cód." />
          <input
            type="text"
            inputMode="numeric"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={e=>{
              const digits = e.target.value.replace(/[^0-9]/g, '');
              setPhone(digits);
            }}
            onKeyDown={e=>{
              if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;
              if (!/[0-9]/.test(e.key)) e.preventDefault();
            }}
            onPaste={e=>{
              e.preventDefault();
              const pastedText = e.clipboardData.getData('text');
              const digits = pastedText.replace(/[^0-9]/g, '');
              setPhone(phone + digits);
            }}
            disabled={!country}
            placeholder={country ? "Ej: 24304847" : "Seleccione un País primero"}
          />
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Dirección</label>
        <input className="w-full border rounded px-3 py-2" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Dirección completa (opcional)" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Estado</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={disabled ? "Desactivada" : "Activa"}
            disabled
          />
          <button
            type="button"
            className={`px-4 py-2 rounded text-white whitespace-nowrap ${disabled ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`}
            onClick={async () => {
              if (!onToggleStatus) return
              const ok = await onToggleStatus(!disabled)
              if (ok) setDisabled(!disabled)
            }}
          >
            {disabled ? "Activar" : "Desactivar"}
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onCancel}>Cancelar</button>
        <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </div>
  );
}

