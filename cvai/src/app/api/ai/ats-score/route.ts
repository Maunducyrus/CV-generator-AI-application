import { NextRequest } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { resumeText = '', jobDescription = '' } = body ?? {};
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You score resumes for ATS keyword match. Return JSON {score:0-100, missingKeywords:string[]} only.' },
        { role: 'user', content: `Resume:\n${resumeText}\n\nJobDescription:\n${jobDescription}` }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' as any }
    });
    const content = resp.choices[0]?.message?.content ?? '{}';
    return new Response(content, { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? 'AI error' }), { status: 500 });
  }
}