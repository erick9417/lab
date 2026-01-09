import React, { useState, useEffect } from 'react'
import { apiFetch } from '../lib/api'

/**
 * Backup & Restore Management Panel
 * Integrated into AdminDashboard
 * 
 * Features:
 * - View backup history
 * - Manual backup trigger
 * - Restore from backup (global or partial)
 * - Safety confirmations
 */

export default function BackupRestorePanel() {
  const [activeTab, setActiveTab] = useState('backups') // 'backups', 'restore'
  const [backups, setBackups] = useState([])
  const [clinics, setClinics] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Manual backup
  const [manualBackupInProgress, setManualBackupInProgress] = useState(false)
  const [manualBackupMessage, setManualBackupMessage] = useState('')

  // Restore dialog state
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState(null)
  const [restoreType, setRestoreType] = useState('global') // 'global' or 'partial'
  const [selectedClinic, setSelectedClinic] = useState('')
  const [restoreStep, setRestoreStep] = useState(1) // 1, 2, 3 (confirmation steps)
  const [confirmationCode, setConfirmationCode] = useState('')

  // Load backups and clinics on mount
  useEffect(() => {
    loadRestoreData()
    // Refresh every 30 seconds
    const interval = setInterval(loadRestoreData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Load backups and available clinics
  const loadRestoreData = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/backup/restore/list', {
        method: 'GET'
      })

      if (response.success) {
        setBackups(response.backups || [])
        setClinics(response.clinics || [])
        setError('')
      } else {
        setError(response.error || 'Error al cargar datos de backup')
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Manual backup trigger
  const handleManualBackup = async () => {
    try {
      setManualBackupInProgress(true)
      setManualBackupMessage('')

      const response = await apiFetch('/backup/manual', {
        method: 'POST'
      })

      if (response.success) {
        setManualBackupMessage('✅ Backup iniciado. Se enviará por correo cuando se complete.')
        setTimeout(() => {
          setManualBackupMessage('')
          loadRestoreData()
        }, 5000)
      } else {
        setManualBackupMessage('❌ Error: ' + (response.error || 'Unknown error'))
      }
    } catch (err) {
      setManualBackupMessage('❌ Error: ' + err.message)
    } finally {
      setManualBackupInProgress(false)
    }
  }

  // Start restore dialog
  const startRestore = (backup) => {
    setSelectedBackup(backup)
    setRestoreType('global')
    setSelectedClinic('')
    setRestoreStep(1)
    setConfirmationCode('')
    setShowRestoreDialog(true)
  }

  // Execute restore
  const handleRestore = async () => {
    if (restoreStep < 3) {
      setRestoreStep(restoreStep + 1)
      return
    }

    // Validate confirmation code
    if (confirmationCode !== 'RESTORE_CONFIRM') {
      setError('Código de confirmación incorrecto')
      return
    }

    // Validate selections
    if (restoreType === 'partial' && !selectedClinic) {
      setError('Debe seleccionar una clínica para restauración parcial')
      return
    }

    try {
      setLoading(true)

      const response = await apiFetch('/backup/restore', {
        method: 'POST',
        body: {
          backupFile: selectedBackup.filename,
          restoreType: restoreType,
          clinicId: restoreType === 'partial' ? parseInt(selectedClinic) : null,
          confirmationCode: 'RESTORE_CONFIRM'
        }
      })

      if (response.success) {
        setMessage(`✅ Restauración ${restoreType} iniciada. Se ejecutará en segundo plano.`)
        setShowRestoreDialog(false)
        setError('')
        setTimeout(() => {
          setMessage('')
          loadRestoreData()
        }, 5000)
      } else {
        setError(response.error || 'Error en restauración')
      }
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelRestore = () => {
    setShowRestoreDialog(false)
    setSelectedBackup(null)
    setRestoreStep(1)
  }

  return (
    <div className="backup-restore-panel p-6 bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('backups')}
          className={`pb-2 font-semibold transition ${
            activeTab === 'backups'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📦 Backups
        </button>
        <button
          onClick={() => setActiveTab('restore')}
          className={`pb-2 font-semibold transition ${
            activeTab === 'restore'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔄 Restaurar
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {manualBackupMessage && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          {manualBackupMessage}
        </div>
      )}

      {/* BACKUPS TAB */}
      {activeTab === 'backups' && (
        <div>
          <div className="mb-4">
            <button
              onClick={handleManualBackup}
              disabled={manualBackupInProgress || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {manualBackupInProgress ? '⏳ Procesando...' : '🔄 Realizar Backup Ahora'}
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : backups.length === 0 ? (
            <p className="text-gray-500">No hay backups disponibles</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2">Archivo</th>
                    <th className="text-left p-2">Fecha</th>
                    <th className="text-right p-2">Tamaño</th>
                    <th className="text-center p-2">Estado</th>
                    <th className="text-center p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map((backup) => (
                    <tr key={backup.filename} className="border-t hover:bg-gray-50">
                      <td className="p-2 font-mono text-xs">{backup.filename}</td>
                      <td className="p-2">{backup.date || new Date(backup.createdAt).toLocaleString()}</td>
                      <td className="p-2 text-right">{backup.sizeFormatted}</td>
                      <td className="p-2 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm font-semibold">
                          ✓ Completado
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => startRestore(backup)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Restaurar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* RESTORE TAB */}
      {activeTab === 'restore' && (
        <div>
          <p className="text-gray-600 mb-4">
            Selecciona un backup de la pestaña anterior para restaurar datos.
          </p>
        </div>
      )}

      {/* RESTORE DIALOG */}
      {showRestoreDialog && selectedBackup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">
              {restoreStep === 1
                ? '🔄 Restaurar desde Backup'
                : restoreStep === 2
                ? '⚠️ Confirmación de Seguridad'
                : '✓ Confirmar Código'}
            </h2>

            {/* Step 1: Select restore type */}
            {restoreStep === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Archivo: <span className="font-mono">{selectedBackup.filename}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Fecha: <span className="font-mono">{selectedBackup.date}</span>
                </p>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="global"
                      checked={restoreType === 'global'}
                      onChange={(e) => setRestoreType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>🌍 <strong>Global</strong> - Restaurar toda la base de datos</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">
                    ⚠️ Todos perderán datos posteriores a esta fecha
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="partial"
                      checked={restoreType === 'partial'}
                      onChange={(e) => setRestoreType(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span>🏥 <strong>Parcial</strong> - Restaurar una clínica específica</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">
                    ✅ Solo afecta esa clínica. Otros continúan normalmente.
                  </p>
                </div>

                {restoreType === 'partial' && (
                  <div className="ml-6">
                    <label className="text-sm font-semibold block mb-2">Seleccionar clínica:</label>
                    <select
                      value={selectedClinic}
                      onChange={(e) => setSelectedClinic(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">-- Selecciona una clínica --</option>
                      {clinics.map((clinic) => (
                        <option key={clinic.id} value={clinic.id}>
                          {clinic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Safety warning */}
            {restoreStep === 2 && (
              <div className="space-y-4 bg-red-50 p-4 rounded border border-red-200">
                <p className="text-sm font-semibold text-red-800">⚠️ Advertencia de Seguridad</p>
                <p className="text-sm text-red-700">
                  {restoreType === 'global'
                    ? 'Restaurará TODA la base de datos a la fecha del backup. Todos los cambios posteriores se perderán.'
                    : 'Restaurará solo los datos de la clínica seleccionada. Los demás clientes no se verán afectados.'}
                </p>
                <p className="text-sm text-red-700 font-semibold">
                  Se creará un backup de seguridad antes de restaurar.
                </p>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="confirm-understanding"
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Entiendo los riesgos y deseo continuar</span>
                </label>
              </div>
            )}

            {/* Step 3: Confirmation code */}
            {restoreStep === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Para confirmar la restauración, ingresa el código de seguridad:
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm font-bold text-center mb-4">
                  RESTORE_CONFIRM
                </div>
                <input
                  type="text"
                  placeholder="Ingresa el código aquí"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                  className="w-full border rounded px-3 py-2 font-mono"
                  autoFocus
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={cancelRestore}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestore}
                disabled={loading || (restoreStep === 3 && confirmationCode.length === 0)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                {restoreStep === 3
                  ? loading
                    ? '⏳ Restaurando...'
                    : '✓ Confirmar Restauración'
                  : 'Siguiente'}
              </button>
            </div>

            {/* Progress indicator */}
            <div className="text-xs text-gray-500 text-center mt-4">
              Paso {restoreStep} de 3
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
