import { ChatGroq } from '@langchain/groq';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { encoding_for_model } from 'tiktoken';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { trimMessages, HumanMessage, SystemMessage, BaseMessage } from '@langchain/core/messages';
import { RunnablePassthrough } from '@langchain/core/runnables';
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { BaseChatMessageHistory, InMemoryChatMessageHistory } from '@langchain/core/chat_history';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SYSTEM_MESSAGE = `
Your name is Nova. You are an AI thought partner for startup founders. Your
task in this conversation is to ask thorough questions to understand their
business. It is not to provide insights into that business and do not give
advice. You are not a business consultant. You are a tool to help founders
think through their business tasks.

Be clear, concise, friendly, and professional.

You are helping {username} with their startup {company_name}.
`;

function _build_prompt(system_message: string, variable_name: string) {
  return ChatPromptTemplate.fromMessages([
    new SystemMessage(system_message),
    new MessagesPlaceholder(variable_name),
  ]);
}

async function countTokens(messages: BaseMessage[]): Promise<number> {
  const enc = await encoding_for_model("gpt-4");  // Use cl100k_base for GPT-3.5 and GPT-4 models
  
  let tokenCount = 0;
  
  for (const message of messages) {
    if (typeof message.content === 'string') {
      tokenCount += enc.encode(message.content).length;
    } else if (Array.isArray(message.content)) {
      // Handle array content (e.g., for multi-modal messages)
      for (const part of message.content) {
        if (typeof part === 'string') {
          tokenCount += enc.encode(part).length;
        } else if (part.type === 'text') {
          tokenCount += enc.encode(part.text).length;
        }
        // Add handling for other content types if needed
      }
    }
    // Add tokens for message role (system, human, ai)
    tokenCount += 3;  // Each message follows <im_start>{role/name}\n{content}<im_end>\n
  }

  tokenCount += 3;  // Every reply is primed with <im_start>assistant
  
  enc.free();  // Remember to free the encoder when you're done
  
  return tokenCount;
}

const model_class = ChatGroq;  // ChatGroq | ChatAnthropic
const model_name = "llama-3.1-70b-versatile";  // "llama-3.1-70b-versatile" | "gpt-4o" | gpt-3.5-turbo
const temperature = 0.0;

const model = new model_class({
  model: model_name,
  temperature: temperature,
});

const SESSION_ID = Date.now().toString();
const USERNAME = "Wilson";
const COMPANY_NAME = "Compass";
const SYSTEM_MESSAGE_FORMATTED = SYSTEM_MESSAGE.replace('{username}', USERNAME).replace('{company_name}', COMPANY_NAME);

const prompt = _build_prompt(SYSTEM_MESSAGE_FORMATTED, "trimmed_messages");

const store: Record<string, BaseChatMessageHistory> = {};

function get_session_history(sessionId: string): BaseChatMessageHistory {
  if (!(sessionId in store)) {
    store[sessionId] = new InMemoryChatMessageHistory();
  }
  return store[sessionId];
}

const trimmer = trimMessages({
  maxTokens: 1024,
  strategy: "last",
  tokenCounter: countTokens,  // TODO: Implement token counter
  includeSystem: true,
  allowPartial: false,
  startOn: "human",  // TODO: "system" or "human". Start on system. 
});

const chain = RunnablePassthrough.assign({
  trimmed_messages: (input: any) => trimmer.invoke(input.messages),
})
  .pipe(prompt)
  .pipe(model);

const chatbot = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: get_session_history,
  inputMessagesKey: "messages",
});

export async function generateChatResponse(user_input: string, chat_history: string[]): Promise<[string, string[]]> {
  const conversation = chat_history.join('');
  const ai_response = await chatbot.invoke(
    {
      "messages": [new HumanMessage(user_input)],
    },
    {
      "configurable": { sessionId: SESSION_ID },
    }
  );

  // Convert the content to a string
  const content = typeof ai_response.content === 'string' 
    ? ai_response.content 
    : JSON.stringify(ai_response.content);

  chat_history.push(`AI: ${content}\n`);

  return [content, chat_history];
}