const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai'); // Ensure you have the correct package installed
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
require('dotenv').config();

const app = express();

// Enable CORS for specific origin
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your frontend
}));

app.use(bodyParser.json());

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({project: 'connections-433422', location: 'us-central1'});
const model = 'gemini-1.5-flash-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generationConfig: {
    'maxOutputTokens': 2048,
    'temperature': 1,
    'topP': 0.95,
  }
});
async function generateResponse(selectedWords) {
    const req = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `I'm playing a game where I need to find a common theme or category that links ${selectedWords.join(', ')}. Think step-by-step and structure your response clearly. First, analyze each word individually. Then, explain how they connect. Finally, state the theme explicitly at the end in the format: "Theme: [theme_name]". Please do not use any special characters like asterisks or quotation marks around the theme name.`
            }
          ]
        }
      ],
    };
  
    try {
      const streamingResp = await generativeModel.generateContentStream(req);
  
      let fullText = ''; // Initialize an empty string to collect all parts
  
      for await (const item of streamingResp.stream) {
        if (item.candidates && item.candidates.length > 0) {
          fullText += item.candidates[0].content.parts[0].text.trim(); // Append each part to the fullText
        }
      }
  
      // Now that fullText contains the entire response, extract the theme
      const themeMatch = fullText.match(/Theme:\s*(.*)$/i);
      let theme = themeMatch ? themeMatch[1].trim() : '';
  
      console.log(fullText);
      return theme; // Return the extracted theme
  
    } catch (error) {
      console.error('Error generating response:', error.response ? error.response.data : error.message);
    }
  }  

// Endpoint to handle requests from the frontend
app.post('/api/get-theme', async (req, res) => {
    const { selectedWords } = req.body;
  
    try {
      const theme = await generateResponse(selectedWords);
      res.json({ theme });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate theme' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
