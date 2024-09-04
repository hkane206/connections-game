# Connections Game

Welcome to the **Connections Game** repository! This project is a web-based game inspired by the New York Times' "Connections" game. The objective is to group words or items based on their shared connections.

## Overview

The Connections Game provides an interactive experience where players are challenged to find connections between different sets of items. The game is built with a React-based frontend and a Node.js/Express backend in the "cheating" branch that uses the Google Cloud Natural Language API for enhanced functionality.

### Connections Data Source

All connection puzzles used in this game are sourced from `Connections.json`, which was downloaded from the [NYT Connections Answers GitHub repository](https://github.com/Eyefyre/NYT-Connections-Answers) as of **August 22, 2024**. This JSON file contains past Connections games from the New York Times.

## Features

- **Interactive React-Based Gameplay:** A responsive, browser-based game interface built with React components.
- **Customizable Word Sets:** The game uses a JSON file (`Connections.json`) for word sets, allowing for easy customization.
- **Different Game Modes:** A standard mode and a "cheating" branch with an AI-powered connection solver using the Google Cloud API.

## Project Structure

### Frontend (in both branches)

The frontend is located in the `src/components` folder and is built with React. It contains the following components:

- **`GameBoard.js`**: The main component that renders the game board and handles the logic for grouping words and managing game state.
- **`GameBoard.css`**: The CSS file that provides styles for the `GameBoard` component.
- **`LoadingSpinner.js`**: A component that displays a loading spinner when waiting for responses or when the game is loading.
- **`LoadingSpinner.css`**: The CSS file for styling the `LoadingSpinner` component.
- **`Tile.js`**: Represents each word or item as a draggable tile on the game board.
- **`Tile.css`**: The CSS file for styling the `Tile` component.

### Data

- **`src/data/Connections.json`**: This file contains all the word sets sourced from the New York Times Connections game. It provides the core data that drives the game logic, defining which words belong together based on common connections.

### Backend (Cheating Branch Only)

The **backend** is only present in the `cheating` branch and provides additional functionality by integrating with the Google Cloud Natural Language API.

- **`backend/index.js`**: The main server file, built with Node.js and Express. This file sets up an Express server to handle API requests from the frontend and communicates with the Google Cloud API to analyze the semantic relationships between words.

### Key Files

- **`index.html`**: The main HTML file that sets up the game layout and includes the necessary scripts and stylesheets for the React app.
- **`src/index.js`**: The entry point for the React application, rendering the main `GameBoard` component and managing the app's state.
- **`src/App.js`**: Wraps the main components and manages high-level app state.

## Branch Information

### Main Branch

The **main branch** contains the standard version of the game, where players manually select and group words based on their connections. The game checks these selections against the pre-defined sets in `Connections.json`.

### Cheating Branch

The **cheating branch** introduces AI assistance to help players find connections:

- **Google Cloud API Integration:** Uses the **Google Cloud Natural Language API** to dynamically analyze and suggest connections between any set of four words selected by the user.
- **Backend Server (`backend/index.js`)**: The backend code uses Node.js and Express to communicate with the Google Cloud API and provide real-time feedback to the frontend based on the semantic relationships between the words.
- **Modified Frontend (`GameBoard.js`)**: The React component logic is adjusted to interact with the backend and display hints or suggestions provided by the AI.

**Note:** This branch is ideal for testing, development, or players who want a more guided experience with AI support.

## How to Play

1. **Clone the Repository:** Clone the repository to your local machine:
    ```bash
    git clone https://github.com/hkane206/connections-game.git
    cd connections-game
    ```
   
2. **Install Dependencies:** Navigate to the project directory and install the dependencies:
    ```bash
    npm install
    ```
   
3. **Start the Frontend:** Run the React development server:
    ```bash
    npm start
    ```
   Open your browser and navigate to `http://localhost:3000` to start playing.

4. **Switch to the Cheating Branch (Optional):** If you want to play the AI-assisted version, switch to the `cheating` branch:
    ```bash
    git checkout cheating
    ```
   
5. **Set Up the Backend (Cheating Branch Only):**
   - Navigate to the `backend` folder.
   - Install backend dependencies:
     ```bash
     cd backend
     npm install
     ```
   - Start the backend server:
     ```bash
     node index.js
     ```

6. **Set Up Google Cloud Project:** To use the backend in the cheating branch:
   - Create a project on Google Cloud Platform.
   - Enable the Natural Language API for your project.

   > **Note:** No API key is needed; just ensure that your Google Cloud project is properly set up with the required API enabled.

## How to Contribute

Contributions are welcome! If you have any ideas for new features or find any bugs, please open an issue or a pull request.

### To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments

Special thanks to [Eyefyre](https://github.com/Eyefyre) for providing the `Connections.json` file containing the New York Times' Connections answers and all contributors who have helped improve this game!
