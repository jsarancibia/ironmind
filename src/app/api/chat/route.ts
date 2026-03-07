import { NextRequest } from 'next/server';
import { runAgent, type Message } from '@/lib/agent';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages } = await req.json() as { messages: Message[] };

  if (!process.env.GROQ_API_KEY) {
    return new Response('GROQ_API_KEY not configured', { status: 500 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of runAgent(messages)) {
          const data = JSON.stringify(chunk) + '\n';
          controller.enqueue(encoder.encode(data));
        }
      } catch (error) {
        const errorData = JSON.stringify({ type: 'error', content: String(error) }) + '\n';
        controller.enqueue(encoder.encode(errorData));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
