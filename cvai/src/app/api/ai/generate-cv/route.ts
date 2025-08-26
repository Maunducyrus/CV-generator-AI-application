import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const system = `You are an expert CV writer. You will receive structured JSON with candidate information. Generate a concise, ATS-friendly resume in Markdown with sections: Header (name, title, contacts), Summary, Experience (reverse-chronological, bullet points with strong verbs and quantified impact), Education, Skills (grouped), Projects, Certifications. Keep it one page equivalent.`;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const data = JSON.parse(body || '{}');

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: system },
    { role: 'user', content: `Candidate data (JSON):\n${JSON.stringify(data)}` }
  ];

  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.4
    });
    const markdown = resp.choices[0]?.message?.content ?? '';
    return new Response(JSON.stringify({ markdown }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? 'AI error' }), { status: 500 });
  }
}