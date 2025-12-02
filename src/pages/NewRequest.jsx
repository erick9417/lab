import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function NewRequest() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    const newFiles = files.map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type,
    }))
    setUploadedFiles([...uploadedFiles, ...newFiles])
  }

  const removeFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí se guardará en Firebase
    alert('Solicitud creada exitosamente')
    navigate(`/patient/${patientId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/patient/${patientId}`)}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              ← Volver al Expediente
            </button>
            <img src="/lucvan-logo-web.png" alt="Lucván" className="h-10" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border rounded-lg p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Nueva Solicitud de Plantilla</h1>
          <p className="text-sm text-gray-500 mb-8">Complete el formulario con la información requerida</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Documentos Adjuntos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-gray-400 transition">
                <h3 className="text-base font-medium text-gray-900 mb-2">Adjuntar Estudios y Documentos</h3>
                <p className="text-sm text-gray-500 mb-4">Arrastra archivos aquí o selecciona desde tu equipo</p>
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
                className="inline-block px-5 py-2.5 bg-gray-900 text-white rounded-md font-medium cursor-pointer hover:bg-gray-800 transition"
              >
                Seleccionar Archivos
              </label>
              <p className="text-xs text-gray-500 mt-3">Formatos: PDF, JPG, PNG • Tamaño máximo: 10MB por archivo</p>

              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-md">
                      <div className="text-left">
                        <p className="font-medium text-sm text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>

            {/* Doctor Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Información del Doctor</label>
              <input
                type="text"
                placeholder="Nombre completo del doctor"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>

            {/* Template Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Especificaciones de la Plantilla</label>
              <div className="grid grid-cols-2 gap-4">
                <select className="px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent" required>
                  <option value="">Seleccione tipo de plantilla</option>
                  <option>Plantilla Correctiva</option>
                  <option>Plantilla Deportiva</option>
                  <option>Plantilla para Diabético</option>
                  <option>Plantilla Pediátrica</option>
                  <option>Otro</option>
                </select>
                <select className="px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent" required>
                  <option value="">Seleccione arcada</option>
                  <option>Izquierdo</option>
                  <option>Derecho</option>
                  <option>Ambos</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones Clínicas</label>
              <textarea
                rows="4"
                placeholder="Ingrese observaciones, especificaciones o consideraciones especiales..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              ></textarea>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                className="flex-1 bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
              >
                Enviar Solicitud
              </button>
              <button
                type="button"
                onClick={() => navigate(`/patient/${patientId}`)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-md font-medium hover:bg-gray-50 transition"
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
