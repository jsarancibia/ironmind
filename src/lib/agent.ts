import { groq, MODEL } from './groq';
import { toolDefinitions, executeTool } from './tools';

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_call_id?: string;
  name?: string;
}

type GroqMessage = {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_call_id?: string;
  name?: string;
};

const MAX_TOOL_ITERATIONS = 10;

export async function* runAgent(messages: Message[]) {
  let currentMessages: GroqMessage[] = [...messages];
  let iterations = 0;

  while (iterations < MAX_TOOL_ITERATIONS) {
    iterations++;

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: currentMessages as never,
      tools: toolDefinitions,
      temperature: 0.7,
    });

    const choice = response.choices[0];
    const message = choice?.message;

    if (!message) {
      yield { type: 'error', content: 'No response from model' };
      break;
    }

    if (message.tool_calls && message.tool_calls.length > 0) {
      currentMessages.push(message as GroqMessage);

      for (const toolCall of message.tool_calls) {
        const toolResult = executeTool(
          toolCall.function.name,
          JSON.parse(toolCall.function.arguments || '{}')
        );

        const toolMessage: GroqMessage = {
          role: 'tool',
          content: JSON.stringify(toolResult),
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
        };

        currentMessages.push(toolMessage);
        yield { type: 'tool', toolName: toolCall.function.name, content: toolResult };
      }

      continue;
    }

    if (message.content) {
      currentMessages.push({ role: 'assistant', content: message.content });
      yield { type: 'content', content: message.content };
      break;
    }
  }

  if (iterations >= MAX_TOOL_ITERATIONS) {
    yield { type: 'error', content: 'Max tool iterations reached' };
  }
}
