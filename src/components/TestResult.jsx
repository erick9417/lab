import React from 'react'

// Mapea nombre de plantilla → asset. Ajusta los nombres/paths según tus imágenes reales.
const plantillaAsset = (name) => {
  if (!name) return '/lucvan-logo-web.png'
  const slug = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const candidates = [
    `/images/plantillas/${slug}.webp`,
    `/images/plantillas/${slug}.png`,
    `/images/plantillas/${slug}.jpg`,
  ]
  return candidates[0]
}

export default function TestResult({ result, subtitle, onBack }) {
  const imgSrc = plantillaAsset(result)

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl flex items-center justify-between mb-6">
        {onBack ? (
          <button onClick={onBack} className="text-[#003C63] hover:text-[#F5C400] font-medium">← Volver</button>
        ) : <span />}
        <img src="/lucvan-logo-web.png" alt="Lucván" className="h-10 brightness-0 invert" />
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#003C63] mb-2">
        Plantilla {result || '—'}
      </h1>
      {subtitle && (
        <p className="text-sm text-gray-600 mb-6">{subtitle}</p>
      )}

      {/* Imagen resaltada con glow */}
      <div className="relative">
        <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-60"
             style={{
               background: 'radial-gradient(50% 50% at 50% 50%, rgba(245,196,0,0.35) 0%, rgba(0,102,164,0.25) 100%)'
             }}
        />
        <img
          src={imgSrc}
          alt={result || 'Plantilla'}
          onError={(e) => { e.currentTarget.src = '/lucvan-logo-web.png' }}
          className="relative z-10 w-[520px] max-w-[80vw] h-auto object-contain rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,60,99,0.45)] ring-4 ring-[#F5C400]/60"
        />
      </div>
    </div>
  )
}
