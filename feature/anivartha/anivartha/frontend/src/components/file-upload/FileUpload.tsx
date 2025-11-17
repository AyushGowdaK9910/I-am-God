/**
 * CON-1, CON-8: File Upload Component
 * Fast UX with progress indicators
 */

import React, { useState, useCallback } from 'react';
import axios from 'axios';
import ProgressLoader from '../progress-loader/ProgressLoader';
import ValidationErrors from '../validation-errors/ValidationErrors';

interface UploadResult {
  fileId: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
}

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrors([]);
      setResult(null);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setErrors([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (error: any) {
      if (error.response?.data?.error?.errors) {
        setErrors(error.response.data.error.errors);
      } else {
        setErrors([error.message || 'Upload failed']);
      }
    } finally {
      setUploading(false);
    }
  }, [file]);

  return (
    <div className="file-upload">
      <h2>Upload File (CON-1)</h2>
      
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {file && (
        <div className="file-info">
          <p>Selected: {file.name}</p>
          <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      {uploading && <ProgressLoader progress={progress} />}

      {errors.length > 0 && <ValidationErrors errors={errors} />}

      {result && (
        <div className="upload-success">
          <p>✅ Upload successful!</p>
          <p>File ID: {result.fileId}</p>
        </div>
      )}

      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default FileUpload;

