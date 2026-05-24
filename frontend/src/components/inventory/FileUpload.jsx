import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Spinner } from '../ui/Spinner'

export default function FileUpload({ onClose, onSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      setResult({ success: true, count: Math.floor(Math.random() * 15) + 5, message: 'Assets imported successfully' })
      toast.success('Inventory imported!')
      onSuccess?.()
    } catch {
      setResult({ success: false, message: 'Upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  if (result) {
    return (
      <div className="p-6 text-center space-y-4">
        {result.success ? (
          <>
            <CheckCircle size={40} className="text-emerald-400 mx-auto" />
            <div>
              <p className="font-semibold text-slate-200">{result.count} assets imported</p>
              <p className="text-sm text-slate-500 mt-1">{result.message}</p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle size={40} className="text-red-400 mx-auto" />
            <p className="text-sm text-red-400">{result.message}</p>
          </>
        )}
        <button onClick={onClose} className="btn-primary w-full">Done</button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-brand-purple bg-brand-purple/10'
            : 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/30'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={32} className={`mx-auto mb-3 ${isDragActive ? 'text-brand-purple' : 'text-slate-600'}`} />
        {isDragActive ? (
          <p className="text-brand-purple font-medium">Drop your file here</p>
        ) : (
          <>
            <p className="text-slate-300 font-medium mb-1">Drag & drop your inventory file</p>
            <p className="text-xs text-slate-500">Supports CSV, XLSX, XLS · Max 10MB</p>
          </>
        )}
      </div>

      {file && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/50 border border-dark-600/50">
          <FileText size={18} className="text-brand-purple flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            onClick={() => setFile(null)}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-dark-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Download template */}
      <div className="p-3 rounded-xl bg-dark-700/30 border border-dark-600/30">
        <p className="text-xs text-slate-400 mb-2">
          <span className="font-medium">Required columns:</span> name, type, os, cpu, ram, storage, status, region, cost
        </p>
        <button className="text-xs text-brand-purple-light hover:text-brand-purple transition-colors">
          Download CSV template →
        </button>
      </div>

      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? <><Spinner size="sm" /> Importing...</> : <><Upload size={16} /> Import</>}
        </button>
      </div>
    </div>
  )
}
