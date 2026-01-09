import React, { useState } from 'react';
import { apiFetch } from '../lib/api';

export default function CreateUserForm({ clinics, onClose, onCreated, onClinicCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [showCreateClinic, setShowCreateClinic] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Contraseña temporal: Lucvan2025
      const res = await apiFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name,
          email, 
          password: 'Lucvan2025', // Contraseña temporal
          role, 
          clinic_id: clinicId || null 
        }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error creando usuario');
      }
      
      const user = await res.json();
      alert(`Usuario creado exitosamente.\nContraseña temporal: Lucvan2025\nEl usuario debe cambiarla en su primer inicio de sesión.`);
      if (onCreated) onCreated(user);
      handleClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setRole('');
    setClinicId('');
    setShowCreateClinic(false);
    setError('');
    setLoading(false);
    if (onClose) onClose();
  };

  return (
    <div>
      {showCreateClinic ? (
        <div className="mb-4 p-4 border rounded bg-gray-50">
          <CreateClinicForm 
            onCreated={clinic => {
              setShowCreateClinic(false);
              setClinicId(clinic.id);
              if (onClinicCreated) onClinicCreated(clinic);
            }}
            onCancel={() => setShowCreateClinic(false)}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block mb-1 font-medium">Nombre completo</label>
            <input 
              type="text" 
              className="w-full border rounded px-3 py-2" 
              value={name} 
              onChange={e=>{setName(e.target.value); e.target.setCustomValidity('')}} 
              onInvalid={e=>e.target.setCustomValidity('Por favor ingrese el nombre completo')}
              required 
              placeholder="Ej: Juan Pérez" 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input 
              type="email" 
              className="w-full border rounded px-3 py-2" 
              value={email} 
              onChange={e=>{setEmail(e.target.value); e.target.setCustomValidity('')}} 
              onInvalid={e=>e.target.setCustomValidity('Por favor ingrese un email válido')}
              required 
              placeholder="ejemplo@correo.com" 
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Rol</label>
            <select 
              className="w-full border rounded px-3 py-2" 
              value={role} 
              onChange={e=>{setRole(e.target.value); e.target.setCustomValidity('')}} 
              onInvalid={e=>e.target.setCustomValidity('Por favor seleccione un rol')}
              required 
            >
              <option value="">Selecciona un rol</option>
              <option value="admin">Administrador</option>
              <option value="clinic">Clínica</option>
              <option value="workshop">Producción</option>
            </select>
          </div>
          {role === 'clinic' && (
            <div>
              <label className="block mb-1 font-medium">Clínica <span className="text-red-600">*</span></label>
              <div className="flex gap-2">
                <select 
                  className="w-full border rounded px-3 py-2" 
                  value={clinicId} 
                  onChange={e=>{setClinicId(e.target.value); e.target.setCustomValidity('')}} 
                  onInvalid={e=>e.target.setCustomValidity('Por favor seleccione una clínica')}
                  required
                >
                  <option value="">Selecciona una clínica</option>
                  {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button 
                  type="button" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition whitespace-nowrap" 
                  onClick={()=>setShowCreateClinic(true)}
                >
                  Nueva clínica
                </button>
              </div>
            </div>
          )}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Se creará el usuario con la contraseña temporal: <strong>Lucvan2025</strong>
              <br />
              El usuario deberá cambiarla en su primer inicio de sesión.
            </p>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" disabled={loading}>
              {loading ? 'Creando...' : 'Crear usuario'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Importar CreateClinicForm del otro archivo
import { CreateClinicForm } from './UserInviteForm';
