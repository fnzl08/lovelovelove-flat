import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import { buildSystemPrompt, buildUserMessage } from '@/lib/ai/prompts';
import type { AiRequestPayload } from '@/lib/ai/types';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return new Response('API 키가 설정되지 않았습니다.', { status: 500 });
  }

  let payload: AiRequestPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('잘못된 요청 형식입니다.', { status: 400 });
  }

  let stream;
  try {
    stream = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      stream: true,
      temperature: 0.85,
      max_tokens: 1200,
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserMessage(payload) },
      ],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'OpenAI 호출 실패';
    if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('rate limit')) {
      return new Response('OpenAI 크레딧 한도 초과. platform.openai.com/billing 에서 결제를 확인해 주세요.', { status: 429 });
    }
    return new Response(msg, { status: 500 });
  }

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : '스트리밍 오류';
        controller.enqueue(new TextEncoder().encode(`\n[오류: ${msg}]`));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
