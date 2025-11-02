import { useState } from 'react'
import { pb } from '../lib/pocketbase'

function FileUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      // Upload file - let backend calculate hash
      const formData = new FormData()
      formData.append('filename', file.name)
      formData.append('file_hash', 'temp') // Placeholder, will be updated by hook
      formData.append('status', 'pending')
      formData.append('row_count', 0)
      formData.append('csv_file', file)

      const record = await pb.collection('files').create(formData)
      
      onUploadComplete(record)
      e.target.value = '' // Clear input

    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <label style={{
        display: 'inline-block',
        padding: '0.75rem 1.5rem',
        background: '#28a745',
        color: 'white',
        borderRadius: '4px',
        cursor: uploading ? 'not-allowed' : 'pointer'
      }}>
        {uploading ? 'Uploading...' : '📁 Upload CSV File'}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={uploading}
          style={{ display: 'none' }}
        />
      </label>
      
      {error && (
        <div style={{ 
          marginTop: '0.5rem',
          color: 'red',
          padding: '0.5rem',
          background: '#fee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

export default FileUpload