import React from 'react';
import './Tile.css';

function Tile({ word, onClick, isSelected, isMerged, mergedData }) {
  return (
    <div
      className={`tile ${isSelected ? 'selected' : ''} ${isMerged ? 'merged' : ''}`}
      onClick={!isMerged ? onClick : null}
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
