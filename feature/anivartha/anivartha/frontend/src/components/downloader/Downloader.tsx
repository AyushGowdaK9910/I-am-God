/**
 * CON-3: File Download Component
 */

import React, { useState } from 'react';
import axios from 'axios';

const Downloader: React.FC = () => {
  const [fileId, setFileId] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!fileId) return;

    setDownloading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/download/${fileId}`,
        {
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileId);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed', error);
      alert('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="downloader">
      <h2>Download File (CON-3)</h2>
      <input
        type="text"
        placeholder="Enter file ID"
        value={fileId}
        onChange={(e) => setFileId(e.target.value)}
      />
      <button onClick={handleDownload} disabled={!fileId || downloading}>
        {downloading ? 'Downloading...' : 'Download'}
      </button>
    </div>
  );
};

export default Downloader;

