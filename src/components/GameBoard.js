import React, { useState, useEffect } from 'react';
import Tile from './Tile';
import './GameBoard.css';
import puzzles from '../data/puzzles.json'; // Import the JSON file

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

function GameBoard() {
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [mergedTiles, setMergedTiles] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [mistakesArray, setMistakesArray] = useState([false, false, false, false]);
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);

  useEffect(() => {
    const puzzle = getRandomPuzzle(puzzles);
    setSelectedPuzzle(puzzle);

    // Flatten all the members into a list of tiles with their category
    const initialTiles = puzzle.answers.flatMap((answer, index) => 
      answer.members.map(member => ({ word: member, category: answer.group }))
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

  const checkForMatch = () => {
    if (gameOver) return; // Disable checking for match if game is over

    const categoryGroups = selectedPuzzle.answers.map(answer => 
      selectedTiles.filter(tile => tile.category === answer.group)
    );

    let matchFound = false;
    const newMergedTiles = [];
    let oneAway = false;

    categoryGroups.forEach(group => {
      if (group.length === 4) {
        newMergedTiles.push({
          theme: group[0].category,
          words: group.map(tile => tile.word),
        });
        setTiles(tiles.filter(tile => !group.includes(tile)));
        matchFound = true;
      } else if (group.length === 3 && selectedTiles.length === 4) {
        oneAway = true;
      }
    });

    if (matchFound) {
      setMergedTiles([...mergedTiles, ...newMergedTiles]);
      setSelectedTiles(selectedTiles.filter(tile => !newMergedTiles.flatMap(mt => mt.words).includes(tile.word)));
      setMessage('');
    } else {
      // Set message
      if (oneAway) {
        setMessage("You're one away!");
      } else {
        setMessage('Incorrect selection. Please try again.');
      }
    
      setSelectedTiles([]);

      // Update mistakesArray only if not one away
      const firstFalseIndex = mistakesArray.indexOf(false);
      if (firstFalseIndex !== -1) {
        const updatedMistakesArray = [...mistakesArray];
        updatedMistakesArray[firstFalseIndex] = true;
        setMistakesArray(updatedMistakesArray);

        // Check if all mistakes have been used
        if (firstFalseIndex === mistakesArray.length - 1) {
          setGameOver(true); // Trigger game over
          setMessage('Game Over! You have used all your mistakes.');
        }
      }
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

      {/* Mistakes remaining */}
      <div className="mistakes-remaining">
        {mistakesArray.map((mistake, index) => (
          <span key={index} className={mistake ? 'mistake-used' : ''}></span>
        ))}
      </div>

      {/* Buttons */}
      <button onClick={checkForMatch} disabled={gameOver}>Submit</button>
      <button onClick={() => setSelectedTiles([])} disabled={gameOver}>Deselect all</button>
      <button onClick={() => setTiles(shuffleArray([...tiles]))} disabled={gameOver}>Shuffle</button>

      {message && <div className="message">{message}</div>}
      {mergedTiles.length === (selectedPuzzle?.answers.length || 0) && <h2>You Win!</h2>}
    </div>
  );
}

export default GameBoard;
