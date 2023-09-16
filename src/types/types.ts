export type OpenAIModel = 'cohere' | 'openai';

export interface Message {
  content: string;
  role: 'user' | 'assistant';
}

export interface ChatBody {
  messages: Message[];
}
