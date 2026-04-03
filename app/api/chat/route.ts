import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import { buildSystemPrompt, buildUserMessage } from '@/lib/ai/prompts';
import type { AiRequestPayload } from '@/lib/ai/types';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response('API 키가 설정되지 않았습니다.', { status: 500 });
  }

  let payload: AiRequestPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('잘못된 요청 형식입니다.', { status: 400 });
  }

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    temperature: 0.85,
    max_tokens: 600,
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserMessage(payload) },
    ],
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
