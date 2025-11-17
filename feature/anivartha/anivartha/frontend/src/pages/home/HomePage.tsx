/**
 * CON-1, CON-3, CON-8: Home Page
 * Main upload and download interface
 */

import React from 'react';
import FileUpload from '../../components/file-upload/FileUpload';
import Downloader from '../../components/downloader/Downloader';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <h1>File Upload & Download Service</h1>
      <p>CON-1: Upload | CON-3: Download | CON-8: Fast UX</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <FileUpload />
        <Downloader />
      </div>
    </div>
  );
};

export default HomePage;

