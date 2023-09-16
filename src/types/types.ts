export type OpenAIModel = 'cohere' | 'openai';

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}
