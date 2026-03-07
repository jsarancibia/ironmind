---
name: groq-nextjs
description: Use Groq AI with Next.js and Vercel - integration with openai/gpt-oss-120b and other models
when_to_use: When working with Groq API in Next.js projects, especially on Vercel deployment
---

# Groq + Next.js + Vercel Skill

This skill helps integrate Groq's fast inference API into Next.js applications deployed on Vercel.

## Installation

```bash
npm install groq-sdk
```

## Environment Variables

Add to `.env.local` (development) and Vercel Project Settings (production):

```
GROQ_API_KEY=your_groq_api_key
```

Get your API key from: https://console.groq.com/keys

## Available Models

| Model | Context | Max Output | Speed |
|-------|---------|------------|-------|
| `openai/gpt-oss-120b` | 131K | 65K | ~500 tps |
| `openai/gpt-oss-20b` | 131K | 65K | ~1000 tps |
| `llama-3.3-70b-versatile` | 131K | 32K | ~280 tps |
| `llama-3.1-8b-instant` | 131K | 131K | ~560 tps |
| `mixtral-8x7b-32768` | 32K | 32K | ~450 tps |

## Basic Usage (Server-Side)

```typescript
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getCompletion(prompt: string) {
  const chat = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'openai/gpt-oss-120b',
    temperature: 0.7,
    max_tokens: 1024,
  });

  return chat.choices[0]?.message?.content;
}
```

## Next.js API Route Example

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const chat = await groq.chat.completions.create({
    messages,
    model: 'openai/gpt-oss-120b',
    temperature: 0.7,
    max_tokens: 1024,
  });

  return NextResponse.json({
    content: chat.choices[0]?.message?.content,
  });
}
```

## Vercel Edge Runtime

For better performance on Vercel, use Edge Runtime:

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const chat = await groq.chat.completions.create({
    messages,
    model: 'openai/gpt-oss-20b', // faster model for edge
    temperature: 0.7,
  });

  return NextResponse.json({
    content: chat.choices[0]?.message?.content,
  });
}
```

## Streaming Response

```typescript
// app/api/stream/route.ts
import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const stream = await groq.chat.completions.create({
    messages,
    model: 'openai/gpt-oss-120b',
    temperature: 0.7,
    stream: true,
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
```

## Vercel AI SDK Integration

```bash
npm install ai @ai-sdk/groq
```

```typescript
// lib/groq-client.ts
import { createGroq } from '@ai-sdk/groq';

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Use with AI SDK
import { generateText } from 'ai';

export async function chat(prompt: string) {
  const { text } = await generateText({
    model: groq('openai/gpt-oss-120b'),
    prompt,
  });
  return text;
}
```

## Best Practices for Vercel

1. **Use Edge Runtime** for lower latency
2. **Cache responses** when possible using Vercel KV or similar
3. **Set up spend limits** in Groq console to prevent runaway costs
4. **Use faster models** (`openai/gpt-oss-20b`) for simple tasks
5. **Implement rate limiting** using Vercel Edge Config or upstash/ratelimit

## Troubleshooting

- **401 Error**: Check that `GROQ_API_KEY` is set correctly in Vercel
- **Timeout**: Use smaller `max_tokens` or faster models
- **Rate limits**: Check Groq console for your plan's limits
