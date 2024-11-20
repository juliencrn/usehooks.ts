import React, { useRef } from 'react';
import { useFullscreen } from './useFullscreen';

const Component: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen, exitFullscreen } = useFullscreen(containerRef);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: isFullscreen ? '100%' : '300px',
          height: isFullscreen ? '100%' : '300px',
          backgroundColor: '#4caf50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          borderRadius: isFullscreen ? '0' : '8px',
          transition: 'all 0.3s ease',
        }}
      >
        <p>{isFullscreen ? 'Fullscreen Mode' : 'Click to Enter Fullscreen'}</p>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={toggleFullscreen}
          style={{
            marginRight: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        </button>
        {isFullscreen && (
          <button
            onClick={exitFullscreen}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Exit Fullscreen
          </button>
        )}
      </div>
    </div>
  );
};

export default Component;
