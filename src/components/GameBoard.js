import React, { useState } from 'react';
import Tile from './Tile';
import './GameBoard.css';

const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];
const initialTiles = [
  { word: 'Apple', category: categories[0] },
  { word: 'Orange', category: categories[0] },
  { word: 'Banana', category: categories[0] },
  { word: 'Grape', category: categories[0] },
  { word: 'Dog', category: categories[1] },
  { word: 'Cat', category: categories[1] },
  { word: 'Fish', category: categories[1] },
  { word: 'Bird', category: categories[1] },
  { word: 'Car', category: categories[2] },
  { word: 'Bike', category: categories[2] },
  { word: 'Plane', category: categories[2] },
  { word: 'Boat', category: categories[2] },
  { word: 'Red', category: categories[3] },
  { word: 'Blue', category: categories[3] },
  { word: 'Green', category: categories[3] },
  { word: 'Yellow', category: categories[3] },
];

function GameBoard() {
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [mergedTiles, setMergedTiles] = useState([]);
  const [tiles, setTiles] = useState(initialTiles);
  const [message, setMessage] = useState('');

  const handleTileClick = (tile) => {
    if (selectedTiles.includes(tile)) {
      setSelectedTiles(selectedTiles.filter(t => t !== tile));
    } else {
      setSelectedTiles([...selectedTiles, tile]);
    }
  };

  const isTileSelected = (tile) => selectedTiles.includes(tile);
  const isTileMerged = (tile) => mergedTiles.some(mt => mt.words.includes(tile.word));

  const checkForMatch = () => {
    const categoryGroups = categories.map(cat => (
      selectedTiles.filter(tile => tile.category === cat)
    ));

    let matchFound = false;
    const newMergedTiles = [];

    categoryGroups.forEach(group => {
      if (group.length === 4) {
        newMergedTiles.push({
          theme: group[0].category,
          words: group.map(tile => tile.word),
        });
        setTiles(tiles.filter(tile => !group.includes(tile)));
        matchFound = true;
      }
    });

    if (matchFound) {
      setMergedTiles([...mergedTiles, ...newMergedTiles]);
      setSelectedTiles(selectedTiles.filter(tile => !newMergedTiles.flatMap(mt => mt.words).includes(tile.word)));
      setMessage('');
    } else {
      setSelectedTiles([]);
      
      // Check if the user is one tile away from completing a category
      let oneAwayMessage = '';
      categories.forEach(cat => {
        const selectedInCategory = selectedTiles.filter(tile => tile.category === cat).length;
        const remainingInCategory = tiles.filter(tile => tile.category === cat).length;

        if (selectedInCategory === 3 && remainingInCategory === 1) {
          oneAwayMessage = `You are one tile away from completing ${cat}!`;
        }
      });

      setMessage(oneAwayMessage || 'Incorrect selection. Please try again.');
    }
  };

  const mergedTileData = mergedTiles.reduce((acc, mt) => {
    acc[mt.theme] = mt.words;
    return acc;
  }, {});

  return (
    <div className="game-board">
      <h1>Connections Game</h1>
      <div className="grid">
        {mergedTiles.map((mt, index) => (
          <Tile
            key={`merged-${index}`}
            word=""
            isMerged
            mergedData={{
              theme: mt.theme,
              words: mt.words,
            }}
          />
        ))}
        {tiles.map((tile, index) => (
          <Tile
            key={index}
            word={tile.word}
            onClick={() => handleTileClick(tile)}
            isSelected={isTileSelected(tile)}
            isMerged={isTileMerged(tile)}
            mergedData={mergedTileData[tile.category]}
          />
        ))}
      </div>
      <button onClick={checkForMatch}>Check for Match</button>
      {message && <div className="message">{message}</div>}
      {mergedTiles.length === categories.length && <h2>You Win!</h2>}
    </div>
  );
}

export default GameBoard;
