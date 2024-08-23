import React from 'react';
import './Tile.css';

function Tile({ word, onClick, isSelected, isMerged, mergedData, color }) {
  const tileStyle = isMerged ? { backgroundColor: color } : {};
  console.log('Tile:', word, 'isMerged:', isMerged, 'Color:', color);

  return (
    <button
      className={`tile game-item ${isSelected ? 'selected' : ''} ${isMerged ? 'merged' : ''}`}
      onClick={!isMerged ? onClick : null}
      style={tileStyle}
    >
      {isMerged ? (
        <>
          <div className="merged-header">{mergedData.theme}</div>
          <div className="merged-words">
            {Array.isArray(mergedData.words) ? mergedData.words.join(', ') : ''}
          </div>
        </>
      ) : (
        word
      )}
    </button>
  );
}

export default Tile;
