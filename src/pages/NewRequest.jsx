import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../lib/api'

export default function NewRequest() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [patient, setPatient] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [doctorName, setDoctorName] = useState('')
  const [templateType, setTemplateType] = useState('')
  const [footSide, setFootSide] = useState('')
  const [shoeSize, setShoeSize] = useState('')
  const [observations, setObservations] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar paciente
  useEffect(() => {
    const loadPatient = async () => {
      try {
            const res = await apiFetch('/api/patients')
        if (res.ok) {
          const patients = await res.json()
          const p = patients.find((x) => x.id === parseInt(patientId))
          setPatient(p || null)
        }
      } catch (err) {
        console.error('Error loading patient', err)
      }
    }
    if (currentUser?.token) loadPatient()
  }, [patientId, currentUser?.token])
  
  // Especificaciones de cuñas y alzas
  const [specs, setSpecs] = useState({
    arcoTransverso: { izq: false, der: false },
    barraMetatarsal: { izq: false, der: false },
    cunaCalcaneaInterna: { izq: '', der: '' }, // '3mm', '5mm', '7mm'
    cunaCalcaneaExtrema: { izq: '', der: '' },
    cunaCalcaneaLarga: { izq: '', der: '' },
    elevacionAL: { izqSelected: false, izqMm: '', derSelected: false, derMm: '' },
    alza: { 
      izq: { tipo: '', mm: '' }, // tipo: 'talon', '3/4', 'larga'
      der: { tipo: '', mm: '' }
    }
  })

  const allowLeft = footSide === 'Izquierdo' || footSide === 'Ambos'
  const allowRight = footSide === 'Derecho' || footSide === 'Ambos'
  const allowAnySide = allowLeft || allowRight

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setUploadedFiles([...uploadedFiles, ...files])
  }

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prevenir múltiples envíos
    if (isSubmitting) return
    
    if (!doctorName || !templateType || !footSide || !shoeSize) {
      alert('Por favor completa los campos obligatorios: Doctor, Tipo de plantilla, Lado del pie y Talla de calzado.')
      return
    }
    const size = parseFloat(shoeSize)
    if (isNaN(size) || size < 19 || size > 50) {
      alert('La talla debe estar entre 19 y 50.')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('patientId', parseInt(patientId))
      formData.append('doctorName', doctorName)
      formData.append('templateType', templateType)
      formData.append('footSide', footSide)
      formData.append('shoeSize', shoeSize)
      formData.append('specs', JSON.stringify(specs))
      formData.append('observations', observations)
      uploadedFiles.forEach((file) => formData.append('files', file))

      const res = await apiFetch('/api/requests', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al crear la solicitud')
      }

      alert('Solicitud creada exitosamente')
      navigate(`/patient/${patientId}`)
    } catch (err) {
      console.error('Error al crear solicitud:', err)
      alert('Error al crear la solicitud: ' + err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <header className="bg-gradient-to-r from-[#0066A4] to-[#003C63] shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/patient/${patientId}`)}
              className="text-white hover:text-[#F5C400] font-medium transition-colors"
            >
              ← Volver
            </button>
            <img src="/lucvan-logo-web.png" alt="Lucván" className="h-12 brightness-0 invert" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[#003C63] mb-2">Nueva Solicitud de Plantilla</h1>
          <p className="text-sm text-[#333333] mb-8">Complete el formulario con la información requerida</p>

          {/* Resumen del Paciente */}
          <div className="mb-8 bg-white border-2 border-[#0066A4] rounded-2xl p-5 shadow-md">
            <h2 className="text-sm font-bold text-[#0066A4] mb-2">Paciente</h2>
            <div className="text-sm">
              <span className="text-gray-600">Nombre:</span> <span className="font-medium text-gray-900">{patient ? patient.name : 'Cargando...'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Doctor</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Nombre completo del doctor"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
            </div>

            {/* Template Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Plantilla</label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              >
                <option value="">Seleccione tipo de plantilla</option>
                <option>Amputado</option>
                <option>Pie cavo</option>
                <option>Diabético</option>
                <option>Pie plano</option>
                <option>Fascitis plantar</option>
                <option>Espolón</option>
                <option>Ultrasoft</option>
              </select>
            </div>

            {/* Foot Side */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lado del Pie</label>
              <select
                value={footSide}
                onChange={(e) => setFootSide(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              >
                <option value="">Seleccione lado del pie</option>
                <option>Izquierdo</option>
                <option>Derecho</option>
                <option>Ambos</option>
              </select>
            </div>

            {/* Shoe Size - Simple input with range validation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Talla de Calzado</label>
              <input
                type="number"
                value={shoeSize}
                onChange={(e) => setShoeSize(e.target.value)}
                placeholder="Ingrese talla (19-50)"
                min="19"
                max="50"
                step="0.5"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0066A4] focus:border-[#0066A4] transition-all"
                onWheel={(e) => e.currentTarget.blur()}
                required
              />
            </div>

            {/* Especificaciones de Cuñas y Alzas */}
            <div className="border-2 border-[#0066A4] rounded-2xl p-6 bg-gradient-to-br from-blue-50/30 to-white">
              <h3 className="text-lg font-bold text-[#003C63] mb-4">Especificaciones de Cuñas y Alzas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Arco Transverso */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex flex-col items-center">
                    <img src="/images/cunas/arco-transverso.webp" alt="AT" className="w-20 h-20 object-contain mb-2" onError={(e) => { console.error('Image failed to load:', e.target.src); e.target.style.display='none' }} />
                    <h4 className="font-semibold text-[#003C63] text-sm mb-3 text-center">Arco Transverso (AT)</h4>
                  </div>
                  <div className="flex justify-center gap-4">
                    <label className={`inline-flex items-center gap-2 cursor-pointer ${!allowLeft ? 'opacity-50' : ''}`}>
                      <input
                        type="checkbox"
                        checked={specs.arcoTransverso.izq}
                        onChange={(e) => setSpecs({...specs, arcoTransverso: {...specs.arcoTransverso, izq: e.target.checked}})}
                        className="rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]"
                        disabled={!allowLeft}
                      />
                      <span className="text-sm text-red-600">Izq</span>
                    </label>
                    <label className={`inline-flex items-center gap-2 cursor-pointer ${!allowRight ? 'opacity-50' : ''}`}>
                      <input
                        type="checkbox"
                        checked={specs.arcoTransverso.der}
                        onChange={(e) => setSpecs({...specs, arcoTransverso: {...specs.arcoTransverso, der: e.target.checked}})}
                        className="rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]"
                        disabled={!allowRight}
                      />
                      <span className="text-sm text-red-600">Der</span>
                    </label>
                  </div>
                </div>

                {/* Barra Metatarsal */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex flex-col items-center">
                    <img src="/images/cunas/barra-metatarsal.webp" alt="BTM" className="w-20 h-20 object-contain mb-2" onError={(e) => { console.error('Image failed to load:', e.target.src); e.target.style.display='none' }} />
                    <h4 className="font-semibold text-[#003C63] text-sm mb-3 text-center">Barra Metatarsal (BTM)</h4>
                  </div>
                  <div className="flex justify-center gap-4">
                    <label className={`inline-flex items-center gap-2 cursor-pointer ${!allowLeft ? 'opacity-50' : ''}`}>
                      <input
                        type="checkbox"
                        checked={specs.barraMetatarsal.izq}
                        onChange={(e) => setSpecs({...specs, barraMetatarsal: {...specs.barraMetatarsal, izq: e.target.checked}})}
                        className="rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]"
                        disabled={!allowLeft}
                      />
                      <span className="text-sm text-red-600">Izq</span>
                    </label>
                    <label className={`inline-flex items-center gap-2 cursor-pointer ${!allowRight ? 'opacity-50' : ''}`}>
                      <input
                        type="checkbox"
                        checked={specs.barraMetatarsal.der}
                        onChange={(e) => setSpecs({...specs, barraMetatarsal: {...specs.barraMetatarsal, der: e.target.checked}})}
                        className="rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]"
                        disabled={!allowRight}
                      />
                      <span className="text-sm text-red-600">Der</span>
                    </label>
                  </div>
                </div>

                {/* Cuña Calcánea Interna */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex flex-col items-center">
                    <img src="/images/cunas/cuna-calcanea-interna.webp" alt="CCI" className="w-20 h-20 object-contain mb-2" onError={(e) => { console.error('Image failed to load:', e.target.src); e.target.style.display='none' }} />
                    <h4 className="font-semibold text-[#003C63] text-sm mb-3 text-center">Cuña Calcánea Interna (CCI)</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Izquierda:</label>
                      <div className="flex gap-2 mt-1">
                        {['3mm', '5mm', '7mm'].map(size => (
                          <label key={size} className={`inline-flex items-center gap-1 cursor-pointer text-xs ${!allowLeft ? 'opacity-50' : ''}`}>
                            <input
                              type="radio"
                              name="cci-izq"
                              checked={specs.cunaCalcaneaInterna.izq === size}
                              onChange={() => setSpecs({...specs, cunaCalcaneaInterna: {...specs.cunaCalcaneaInterna, izq: size}})}
                              className="text-[#0066A4] focus:ring-[#0066A4]"
                              disabled={!allowLeft}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Derecha:</label>
                      <div className="flex gap-2 mt-1">
                        {['3mm', '5mm', '7mm'].map(size => (
                          <label key={size} className={`inline-flex items-center gap-1 cursor-pointer text-xs ${!allowRight ? 'opacity-50' : ''}`}>
                            <input
                              type="radio"
                              name="cci-der"
                              checked={specs.cunaCalcaneaInterna.der === size}
                              onChange={() => setSpecs({...specs, cunaCalcaneaInterna: {...specs.cunaCalcaneaInterna, der: size}})}
                              className="text-[#0066A4] focus:ring-[#0066A4]"
                              disabled={!allowRight}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cuña Calcánea Extrema */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex flex-col items-center">
                    <img src="/images/cunas/cuna-calcanea-extrema.webp" alt="CCE" className="w-20 h-20 object-contain mb-2" onError={(e) => { console.error('Image failed to load:', e.target.src); e.target.style.display='none' }} />
                    <h4 className="font-semibold text-[#003C63] text-sm mb-3 text-center">Cuña Calcánea Extrema (CCE)</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Izquierda:</label>
                      <div className="flex gap-2 mt-1">
                        {['3mm', '5mm', '7mm'].map(size => (
                          <label key={size} className={`inline-flex items-center gap-1 cursor-pointer text-xs ${!allowLeft ? 'opacity-50' : ''}`}>
                            <input
                              type="radio"
                              name="cce-izq"
                              checked={specs.cunaCalcaneaExtrema.izq === size}
                              onChange={() => setSpecs({...specs, cunaCalcaneaExtrema: {...specs.cunaCalcaneaExtrema, izq: size}})}
                              className="text-[#0066A4] focus:ring-[#0066A4]"
                              disabled={!allowLeft}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Derecha:</label>
                      <div className="flex gap-2 mt-1">
                        {['3mm', '5mm', '7mm'].map(size => (
                          <label key={size} className={`inline-flex items-center gap-1 cursor-pointer text-xs ${!allowRight ? 'opacity-50' : ''}`}>
                            <input
                              type="radio"
                              name="cce-der"
                              checked={specs.cunaCalcaneaExtrema.der === size}
                              onChange={() => setSpecs({...specs, cunaCalcaneaExtrema: {...specs.cunaCalcaneaExtrema, der: size}})}
                              className="text-[#0066A4] focus:ring-[#0066A4]"
                              disabled={!allowRight}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cuña Calcánea Larga Extrema */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex flex-col items-center">
                    <img src="/images/cunas/cuna-calcanea-larga.webp" alt="CCL" className="w-20 h-20 object-contain mb-2" onError={(e) => { console.error('Image failed to load:', e.target.src); e.target.style.display='none' }} />
                    <h4 className="font-semibold text-[#003C63] text-sm mb-3 text-center">Cuña Calcánea Larga (Antepie)</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Izquierda:</label>
                      <div className="flex gap-2 mt-1">
                        {['3mm', '5mm', '7mm'].map(size => (
                          <label key={size} className={`inline-flex items-center gap-1 cursor-pointer text-xs ${!allowLeft ? 'opacity-50' : ''}`}>
                            <input
                              type="radio"
                              name="ccl-izq"
                              checked={specs.cunaCalcaneaLarga.izq === size}
                              onChange={() => setSpecs({...specs, cunaCalcaneaLarga: {...specs.cunaCalcaneaLarga, izq: size}})}
                              className="text-[#0066A4] focus:ring-[#0066A4]"
                              disabled={!allowLeft}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Derecha:</label>
                      <div className="flex gap-2 mt-1">
                        {['3mm', '5mm', '7mm'].map(size => (
                          <label key={size} className={`inline-flex items-center gap-1 cursor-pointer text-xs ${!allowRight ? 'opacity-50' : ''}`}>
                            <input
                              type="radio"
                              name="ccl-der"
                              checked={specs.cunaCalcaneaLarga.der === size}
                              onChange={() => setSpecs({...specs, cunaCalcaneaLarga: {...specs.cunaCalcaneaLarga, der: size}})}
                              className="text-[#0066A4] focus:ring-[#0066A4]"
                              disabled={!allowRight}
                            />
                            {size}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Elevación A.L. */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                  <div className="flex flex-col items-center">
                    <img src="/images/cunas/elevacion-al.webp" alt="EAL" className="w-20 h-20 object-contain mb-2" onError={(e) => { console.error('Image failed to load:', e.target.src); e.target.style.display='none' }} />
                    <h4 className="font-semibold text-[#003C63] text-sm mb-3 text-center">Elevación A.L.</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Izquierda:</label>
                      <div className="flex gap-2 mt-1">
                        <label className={`inline-flex items-center gap-2 cursor-pointer ${!allowLeft ? 'opacity-50' : ''}`}>
                          <input
                            type="checkbox"
                            checked={specs.elevacionAL.izqSelected}
                            onChange={(e) => setSpecs({...specs, elevacionAL: {...specs.elevacionAL, izqSelected: e.target.checked, izqMm: e.target.checked ? '' : ''}})}
                            className="rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]"
                            disabled={!allowLeft}
                          />
                          <span className="text-sm text-red-600">Sí</span>
                        </label>
                      </div>
                      {specs.elevacionAL.izqSelected && (
                        <input
                          type="number"
                          value={specs.elevacionAL.izqMm}
                          onChange={(e) => setSpecs({...specs, elevacionAL: {...specs.elevacionAL, izqMm: e.target.value}})}
                          placeholder="mm"
                          className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0066A4]"
                          disabled={!allowLeft}
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Derecha:</label>
                      <div className="flex gap-2 mt-1">
                        <label className={`inline-flex items-center gap-2 cursor-pointer ${!allowRight ? 'opacity-50' : ''}`}>
                          <input
                            type="checkbox"
                            checked={specs.elevacionAL.derSelected}
                            onChange={(e) => setSpecs({...specs, elevacionAL: {...specs.elevacionAL, derSelected: e.target.checked, derMm: e.target.checked ? '' : ''}})}
                            className="rounded border-gray-300 text-[#0066A4] focus:ring-[#0066A4]"
                            disabled={!allowRight}
                          />
                          <span className="text-sm text-red-600">Sí</span>
                        </label>
                      </div>
                      {specs.elevacionAL.derSelected && (
                        <input
                          type="number"
                          value={specs.elevacionAL.derMm}
                          onChange={(e) => setSpecs({...specs, elevacionAL: {...specs.elevacionAL, derMm: e.target.value}})}
                          placeholder="mm"
                          className="w-full mt-2 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0066A4]"
                          disabled={!allowRight}
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Alza */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 md:col-span-2 lg:col-span-1">
                  <div className="flex flex-col items-center">
                    <img src="/images/cunas/Alza.webp" alt="Alza" className="w-20 h-20 object-contain mb-2" onError={(e) => { console.error('Image failed to load:', e.target.src); e.target.style.display='none' }} />
                    <h4 className="font-semibold text-[#003C63] text-sm mb-3 text-center">Alza</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Izquierda:</label>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {['talon', '3/4', 'larga'].map(tipo => (
                          <label key={tipo} className={`inline-flex items-center gap-1 cursor-pointer text-xs ${!allowLeft ? 'opacity-50' : ''}`}>
                            <input
                              type="radio"
                              name="alza-izq-tipo"
                              checked={specs.alza.izq.tipo === tipo}
                              onChange={() => setSpecs({...specs, alza: {...specs.alza, izq: {...specs.alza.izq, tipo}}})}
                              className="text-[#0066A4] focus:ring-[#0066A4]"
                              disabled={!allowLeft}
                            />
                            {tipo === 'talon' ? 'Talón' : tipo === '3/4' ? '3/4' : 'Larga'}
                          </label>
                        ))}
                      </div>
                      <input
                        type="number"
                        value={specs.alza.izq.mm}
                        onChange={(e) => setSpecs({...specs, alza: {...specs.alza, izq: {...specs.alza.izq, mm: e.target.value}}})}
                        placeholder="mm"
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0066A4]"
                        disabled={!allowLeft}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Derecha:</label>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {['talon', '3/4', 'larga'].map(tipo => (
                          <label key={tipo} className={`inline-flex items-center gap-1 cursor-pointer text-xs ${!allowRight ? 'opacity-50' : ''}`}>
                            <input
                              type="radio"
                              name="alza-der-tipo"
                              checked={specs.alza.der.tipo === tipo}
                              onChange={() => setSpecs({...specs, alza: {...specs.alza, der: {...specs.alza.der, tipo}}})}
                              className="text-[#0066A4] focus:ring-[#0066A4]"
                              disabled={!allowRight}
                            />
                            {tipo === 'talon' ? 'Talón' : tipo === '3/4' ? '3/4' : 'Larga'}
                          </label>
                        ))}
                      </div>
                      <input
                        type="number"
                        value={specs.alza.der.mm}
                        onChange={(e) => setSpecs({...specs, alza: {...specs.alza, der: {...specs.alza.der, mm: e.target.value}}})}
                        placeholder="mm"
                        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#0066A4]"
                        disabled={!allowRight}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
              <textarea
                rows="4"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ingrese observaciones, especificaciones o consideraciones especiales..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              ></textarea>
            </div>

            {/* File Upload - Moved to end, made smaller */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Documentos Adjuntos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition">
                <p className="text-xs text-gray-500 mb-2">Arrastra archivos o haz clic para seleccionar</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="inline-block px-3 py-1.5 bg-gray-900 text-white rounded text-xs font-medium cursor-pointer hover:bg-gray-800 transition"
                >
                  Seleccionar
                </label>
                <p className="text-xs text-gray-400 mt-2">PDF, JPG, PNG • Máx. 10MB</p>

                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                        <span className="text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 ml-2 font-medium"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-full font-bold transition-all shadow-[0_12px_24px_-10px_rgba(0,60,99,0.25)] ${
                  isSubmitting 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#F5C400] text-[#003C63] hover:bg-[#ffd933] hover:shadow-[0_16px_32px_-12px_rgba(0,60,99,0.3)] hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/patient/${patientId}`)}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                  isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                    : 'bg-white border-2 border-[#0066A4] text-[#003C63] hover:bg-[#F4F6F8]'
                }`}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
