import { Router, Request, Response } from 'express';
import { generateChatResponse } from './utils';

export const chatRouter = Router();

let chatHistory: string[] = [];

interface ChatRequest {
  message: string;
}

chatRouter.post('/chat', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  const { message } = req.body;
  
  chatHistory.push(`User: ${message}\n`);
  const [response, updatedHistory] = await generateChatResponse(message, chatHistory);
  chatHistory = updatedHistory;

  res.json({ response });
});