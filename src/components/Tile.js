import React from 'react';
import './Tile.css';

function Tile({ word, onClick, isSelected, isMerged, mergedData, color }) {
  const tileStyle = isMerged ? { backgroundColor: color } : {};

  return (
    <div
      className={`tile ${isSelected ? 'selected' : ''} ${isMerged ? 'merged' : ''}`}
      onClick={!isMerged ? onClick : null}
      style={tileStyle}
    >
      {isMerged ? (
        <>
          <div className="merged-header">{mergedData.theme}</div>
          <div className="merged-words">{mergedData.words.join(', ')}</div>
        </>
      ) : (
        word
      )}
    </div>
  );
}

export default Tile;
