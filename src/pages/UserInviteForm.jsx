
import React, { useState } from 'react';
import { apiFetch } from '../lib/api';


export default function UserInviteForm({ clinics, onClose, onCreated, onClinicCreated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [showCreateClinic, setShowCreateClinic] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Limpia el estado al cerrar
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, clinic_id: clinicId || null }),
      });
      if (!res.ok) throw new Error('Error enviando invitación');
      const user = await res.json();
      if (onCreated) onCreated(user);
      handleClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
            <input type="text" className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} required title="Por favor ingrese el nombre completo" placeholder="Ej: Juan Pérez" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required title="Por favor ingrese un email válido" placeholder="ejemplo@correo.com" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Rol</label>
            <select className="w-full border rounded px-3 py-2" value={role} onChange={e=>setRole(e.target.value)} required title="Por favor seleccione un rol">
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
                <select className="w-full border rounded px-3 py-2" value={clinicId} onChange={e=>setClinicId(e.target.value)} required title="Por favor seleccione una clínica">
                  <option value="">Selecciona una clínica</option>
                  {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition whitespace-nowrap" onClick={()=>setShowCreateClinic(true)}>Nueva clínica</button>
              </div>
            </div>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={handleClose}>Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Enviando...' : 'Invitar'}</button>
          </div>
        </form>
      )}
    </div>
  );
}

export function CreateClinicForm({ onCreated, onCancel }) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mapa de códigos telefónicos por país
  const countryCodes = {
    'Argentina': '+54',
    'Bolivia': '+591',
    'Brasil': '+55',
    'Chile': '+56',
    'Colombia': '+57',
    'Costa Rica': '+506',
    'Cuba': '+53',
    'Ecuador': '+593',
    'El Salvador': '+503',
    'Guatemala': '+502',
    'Honduras': '+504',
    'México': '+52',
    'Nicaragua': '+505',
    'Panamá': '+507',
    'Paraguay': '+595',
    'Perú': '+51',
    'Puerto Rico': '+1',
    'República Dominicana': '+1',
    'Uruguay': '+598',
    'Venezuela': '+58'
  };

  // Auto-llenar código de país cuando se selecciona un país
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, country, phone: countryCode + phone, address }),
      });
      if (!res.ok) throw new Error('Error creando clínica');
      const clinic = await res.json();
      onCreated(clinic);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block mb-1 font-medium">Nombre de la clínica</label>
        <input className="w-full border rounded px-3 py-2" value={name} onChange={e=>{setName(e.target.value); e.target.setCustomValidity('')}} onInvalid={e=>e.target.setCustomValidity('Por favor ingrese el nombre de la clínica')} required placeholder="Ej: Clínica San José" />
      </div>
      <div>
        <label className="block mb-1 font-medium">País</label>
        <select className="w-full border rounded px-3 py-2" value={country} onChange={e=>{handleCountryChange(e.target.value); e.target.setCustomValidity('')}} onInvalid={e=>e.target.setCustomValidity('Por favor seleccione un país')} required>
          <option value="">Selecciona un país</option>
          <option value="Argentina">Argentina</option>
          <option value="Bolivia">Bolivia</option>
          <option value="Brasil">Brasil</option>
          <option value="Chile">Chile</option>
          <option value="Colombia">Colombia</option>
          <option value="Costa Rica">Costa Rica</option>
          <option value="Cuba">Cuba</option>
          <option value="Ecuador">Ecuador</option>
          <option value="El Salvador">El Salvador</option>
          <option value="Guatemala">Guatemala</option>
          <option value="Honduras">Honduras</option>
          <option value="México">México</option>
          <option value="Nicaragua">Nicaragua</option>
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
          <input 
            type="text" 
            className="w-20 border rounded px-3 py-2 bg-gray-100 font-semibold" 
            value={countryCode} 
            disabled 
            placeholder="Cód."
          />
          <input 
            type="tel" 
            className="w-full border rounded px-3 py-2" 
            value={phone} 
            onChange={e=>setPhone(e.target.value)}
            disabled={!country}
            placeholder={country ? "Ej: 24304847" : "Seleccione un país primero"}
          />
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Dirección</label>
        <input className="w-full border rounded px-3 py-2" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Dirección completa (opcional)" />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
      </div>
    </form>
  );
}
