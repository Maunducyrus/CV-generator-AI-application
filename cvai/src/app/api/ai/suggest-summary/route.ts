import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const system = `You write concise, results-focused professional summaries (2-4 sentences). Use strong, ATS-friendly keywords relevant to the candidate's background. Avoid fluff.`;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const data = JSON.parse(body || '{}');

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Create a summary based on this profile: ${JSON.stringify(data?.personal ?? {})}` }
      ],
      temperature: 0.5
    });
    const summary = resp.choices[0]?.message?.content ?? '';
    return new Response(JSON.stringify({ summary }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? 'AI error' }), { status: 500 });
  }
}