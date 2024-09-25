import express from 'express';
import cors from 'cors';
import sequelize from './db';
import { insertData } from './insertData';
import { fetchData } from './fetchData';
import { generateChatResponse } from './utils';


const app = express();
const port = 3002;

app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON bodies

// TODO: Global variable to store chat history. This is not ideal for a production application
let chatHistory: string[] = [];

app.post('/api/data', async (req, res) => {
    console.log('Inserting data')
  try {
    const data = req.body;
    await insertData(data);
    res.status(201).send('Data inserted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting data');
  }
});

app.get('/api/data', async (req, res) => {
    console.log('Fetching data')
  try {
    const blocks = await fetchData();
    res.json(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    chatHistory.push(`User: ${message}\n`);
    const [response, updatedHistory] = await generateChatResponse(message, chatHistory);
    chatHistory = updatedHistory;

    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

const main = async () => {
  await sequelize.sync(); // Ensure the database schema is up-to-date

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
};

main().catch(err => console.error(err));