import React from 'react';
import { useContextMenu } from './useContextMenu';

const Component: React.FC = () => {
  const { isOpen, setIsOpen, position, handleContextMenu } = useContextMenu();

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f0f0f0',
        position: 'relative',
      }}
      onContextMenu={handleContextMenu}
    >
      <h1>Right-click anywhere to open the context menu</h1>
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: position.y,
            left: position.x,
            padding: '8px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p style={{ margin: 0 }}>Context Menu</p>
        </div>
      )}
    </div>
  );
};

export default Component;
