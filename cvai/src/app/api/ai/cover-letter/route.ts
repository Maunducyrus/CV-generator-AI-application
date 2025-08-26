import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const system = `You are a professional career writer. Generate a persuasive, customized cover letter in professional tone. Use the candidate's background and the job description. Keep it to 3-5 short paragraphs. Use measurable achievements and relevant keywords.`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { candidate, jobDescription, tone = 'professional' } = body ?? {};

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Tone: ${tone}\nJob Description:\n${jobDescription}\nCandidate:\n${JSON.stringify(candidate)}` }
      ],
      temperature: 0.6
    });
    const letter = resp.choices[0]?.message?.content ?? '';
    return new Response(JSON.stringify({ letter }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? 'AI error' }), { status: 500 });
  }
}