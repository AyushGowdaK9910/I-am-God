/**
 * CON-8: Progress Loader Component
 * Fast UX with visual feedback
 */

import React from 'react';

interface ProgressLoaderProps {
  progress: number;
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({ progress }) => {
  return (
    <div className="progress-loader" style={{
      width: '100%',
      margin: '20px 0',
    }}>
      <div style={{
        width: '100%',
        height: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#4caf50',
            transition: 'width 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {progress}%
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: '5px' }}>
        Uploading... {progress}% (CON-8: Fast UX)
      </p>
    </div>
  );
};

export default ProgressLoader;

