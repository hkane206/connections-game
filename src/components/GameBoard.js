import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import './GameBoard.css';
import puzzles from '../data/puzzles.json'; // Adjust the path as needed

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomPuzzle(puzzles) {
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}

function getTileColor(level) {
  switch(level) {
    case 0: return '#F7E29C'; // Yellow
    case 1: return '#A8D08D'; // Green
    case 2: return '#BDD7EE'; // Blue
    case 3: return '#D5A6BD'; // Purple
    default: return 'gray'; // Fallback color
  }
}

function GameBoard() {
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [mergedTiles, setMergedTiles] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [mistakesArray, setMistakesArray] = useState([false, false, false, false]);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);

  useEffect(() => {
    const puzzle = getRandomPuzzle(puzzles);
    setSelectedPuzzle(puzzle);

    // Flatten all the members into a list of tiles with their category and level
    const initialTiles = puzzle.answers.flatMap(answer => 
      answer.members.map(member => ({ word: member, category: answer.group, level: answer.level }))
    );

    setTiles(shuffleArray(initialTiles)); // Shuffle and set the tiles when the component mounts
  }, []);

  const handleTileClick = (tile) => {
    if (gameOver) return; // Disable clicking if game is over

    if (selectedTiles.includes(tile)) {
      setSelectedTiles(selectedTiles.filter(t => t !== tile));
    } else {
      setSelectedTiles([...selectedTiles, tile]);
    }
  };

  const isTileSelected = (tile) => selectedTiles.includes(tile);
  const isTileMerged = (tile) => mergedTiles.some(mt => mt.words.includes(tile.word));

  async function generateThemeWithGemini(selectedWords) {
    try {
        const response = await fetch('http://localhost:5001/api/get-theme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedWords })
        });

        const data = await response.json();
        return data.theme;
    } catch (error) {
        console.error('Error fetching theme:', error);
        return 'Random Theme';
    }
  }

  const checkForMatch = async () => {
    if (gameOver) return; // Disable checking for match if game is over

    if (selectedTiles.length !== 4) {
      setMessage('Please select 4 tiles to submit.');
      return;
    }

    // Generate a theme using Gemini for the selected tiles
    const theme = await generateThemeWithGemini(selectedTiles.map(tile => tile.word));

    // Create a new merged tile with the generated theme
    const newMergedTile = {
      theme: theme,
      words: selectedTiles.map(tile => tile.word),
      color: getTileColor(mergedTiles.length), // Assign a new color
    };

    setMergedTiles([...mergedTiles, newMergedTile]);
    setTiles(tiles.filter(tile => !selectedTiles.includes(tile)));
    setSelectedTiles([]);
    setMessage('');

    // Check if the player has won
    if (mergedTiles.length + 1 === 4) {
      setGameOver(true);
      setPopupMessage('Congratulations! You won the game!');
      setShowPopup(true);
      setTiles([]); // Clear remaining tiles
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
            color={mt.color} // Pass color prop to Tile
            mergedData={{
              theme: mt.theme,
              words: mt.words,
            }}
          />
        ))}
        {tiles.length + mergedTiles.length <= 16 && tiles.map((tile, index) => (
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

      <div className="mistakes-remaining">
        {mistakesArray.map((mistake, index) => (
          <span key={index} className={mistake ? 'mistake-used' : ''}></span>
        ))}
      </div>

      <button onClick={checkForMatch} disabled={gameOver}>Submit</button>
      <button onClick={() => setSelectedTiles([])} disabled={gameOver}>Deselect all</button>
      <button onClick={() => setTiles(shuffleArray([...tiles]))} disabled={gameOver}>Shuffle</button>

      {message && <div className="message">{message}</div>}

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {gameOver && (
        <button className="play-again-button" onClick={() => window.location.reload()}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default GameBoard;
