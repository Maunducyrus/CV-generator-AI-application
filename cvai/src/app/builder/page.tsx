"use client";
import { useState, useEffect, Suspense } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input, Label, Textarea, Section } from '@/components/inputs';
import { clsx } from 'clsx';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

export type CvForm = {
  personal: {
    fullName: string;
    title?: string;
    email?: string;
    phone?: string;
    address?: string;
    links?: { label: string; url: string }[];
    summary?: string;
  };
  education: { school: string; degree: string; start: string; end?: string; achievements?: string }[];
  experience: { company: string; role: string; start: string; end?: string; responsibilities?: string; achievements?: string }[];
  skills: { category: string; items: string }[];
  certifications: { name: string; issuer?: string; date?: string }[];
  projects: { name: string; description?: string; link?: string }[];
  languages: { name: string; level?: string }[];
};

const steps = ['Personal', 'Education', 'Experience', 'Skills', 'Projects', 'Review'];

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="container py-8">Loading builder…</div>}>
      <BuilderContent />
    </Suspense>
  );
}

function BuilderContent() {
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<string>('');
  const [docId, setDocId] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [templateKey, setTemplateKey] = useState<string>('minimal');
  const [tone, setTone] = useState<string>('professional');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [skillsSuggestions, setSkillsSuggestions] = useState<string[]>([]);

  const sp = useSearchParams();

  const { control, register, handleSubmit, watch, reset } = useForm<CvForm>({
    defaultValues: {
      personal: { fullName: '' },
      education: [{} as any],
      experience: [{} as any],
      skills: [{ category: 'Technical', items: '' }],
      certifications: [],
      projects: [],
      languages: []
    }
  });

  useEffect(() => {
    const id = sp.get('id');
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/documents/${id}`);
      if (res.ok) {
        const j = await res.json();
        setDocId(id);
        try { reset(JSON.parse(j.content)); } catch { /* ignore */ }
        setPreview(j.content);
        setTemplateKey(j.templateKey ?? 'minimal');
      }
    })();
  }, [sp, reset]);

  const education = useFieldArray({ control, name: 'education' });
  const experience = useFieldArray({ control, name: 'experience' });
  const skills = useFieldArray({ control, name: 'skills' });
  const projects = useFieldArray({ control, name: 'projects' });

  const onGenerateCV = async (data: CvForm) => {
    const res = await fetch('/api/ai/generate-cv', { method: 'POST', body: JSON.stringify({ ...data, templateKey }) });
    const json = await res.json();
    setPreview(json.markdown ?? '');
  };

  const onSuggestSummary = async () => {
    const data = watch();
    const res = await fetch('/api/ai/suggest-summary', { method: 'POST', body: JSON.stringify(data) });
    const json = await res.json();
    (document.getElementById('personal.summary') as HTMLTextAreaElement).value = json.summary ?? '';
  };

  const onTailorToJob = async () => {
    const data = watch();
    const res = await fetch('/api/ai/generate-cv', { method: 'POST', body: JSON.stringify({ ...data, jobDescription, templateKey }) });
    const json = await res.json();
    setPreview(json.markdown ?? '');
  };

  const onGenerateCoverLetter = async () => {
    const data = watch();
    const res = await fetch('/api/ai/cover-letter', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ candidate: data, jobDescription, tone }) });
    const json = await res.json();
    setCoverLetter(json.letter ?? '');
  };

  const onComputeAts = async () => {
    const res = await fetch('/api/ai/ats-score', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ resumeText: preview, jobDescription }) });
    const json = await res.json();
    setAtsScore(json.score ?? null);
    setMissingKeywords(Array.isArray(json.missingKeywords) ? json.missingKeywords : []);
  };

  const onSkillsGap = async () => {
    const res = await fetch('/api/ai/skills-gap', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ resumeText: preview, jobDescription }) });
    const json = await res.json();
    setSkillsSuggestions(Array.isArray(json.suggestions) ? json.suggestions : []);
  };

  const onSave = async () => {
    const payload = JSON.stringify(watch());
    if (docId) {
      await fetch(`/api/documents/${docId}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: watch().personal.fullName || 'CV', content: payload, templateKey, language: 'en' }) });
    } else {
      const res = await fetch('/api/documents', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: watch().personal.fullName || 'CV', content: payload, templateKey }) });
      const j = await res.json();
      setDocId(j.id);
    }
    alert('Saved');
  };

  const exportUrl = (fmt: 'pdf' | 'docx' | 'txt') => (docId ? `/api/export/${fmt}/${docId}` : '#');

  return (
    <div className="container py-8 grid lg:grid-cols-2 gap-6">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {steps.map((label, i) => (
            <button key={i} onClick={() => setStep(i)} className={clsx('px-3 py-1.5 rounded-full border', i === step ? 'bg-brand text-white border-brand' : 'hover:bg-gray-50')}>
              {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <Section title="Personal Information" action={<Button variant="ghost" size="sm" onClick={onSuggestSummary}>Suggest summary</Button>}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="personal.fullName">Full Name</Label>
                <Input id="personal.fullName" {...register('personal.fullName')} placeholder="John Doe" />
              </div>
              <div>
                <Label htmlFor="personal.title">Title</Label>
                <Input id="personal.title" {...register('personal.title')} placeholder="Software Engineer" />
              </div>
              <div>
                <Label htmlFor="personal.email">Email</Label>
                <Input id="personal.email" {...register('personal.email')} placeholder="john@example.com" />
              </div>
              <div>
                <Label htmlFor="personal.phone">Phone</Label>
                <Input id="personal.phone" {...register('personal.phone')} placeholder="+1 555 123" />
              </div>
              <div>
                <Label htmlFor="personal.address">Address</Label>
                <Input id="personal.address" {...register('personal.address')} placeholder="City, Country" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="personal.summary">Summary</Label>
                <Textarea id="personal.summary" {...register('personal.summary')} rows={4} placeholder="Brief professional summary" />
              </div>
            </div>
          </Section>
        )}

        {step === 1 && (
          <Section title="Education">
            {education.fields.map((f, idx) => (
              <div key={f.id} className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`education.${idx}.school`}>School</Label>
                  <Input id={`education.${idx}.school`} {...register(`education.${idx}.school` as const)} />
                </div>
                <div>
                  <Label htmlFor={`education.${idx}.degree`}>Degree</Label>
                  <Input id={`education.${idx}.degree`} {...register(`education.${idx}.degree` as const)} />
                </div>
                <div>
                  <Label htmlFor={`education.${idx}.start`}>Start</Label>
                  <Input id={`education.${idx}.start`} {...register(`education.${idx}.start` as const)} />
                </div>
                <div>
                  <Label htmlFor={`education.${idx}.end`}>End</Label>
                  <Input id={`education.${idx}.end`} {...register(`education.${idx}.end` as const)} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`education.${idx}.achievements`}>Achievements</Label>
                  <Textarea id={`education.${idx}.achievements`} {...register(`education.${idx}.achievements` as const)} rows={3} />
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => education.append({} as any)}>+ Add education</Button>
          </Section>
        )}

        {step === 2 && (
          <Section title="Experience">
            {experience.fields.map((f, idx) => (
              <div key={f.id} className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`experience.${idx}.company`}>Company</Label>
                  <Input id={`experience.${idx}.company`} {...register(`experience.${idx}.company` as const)} />
                </div>
                <div>
                  <Label htmlFor={`experience.${idx}.role`}>Role</Label>
                  <Input id={`experience.${idx}.role`} {...register(`experience.${idx}.role` as const)} />
                </div>
                <div>
                  <Label htmlFor={`experience.${idx}.start`}>Start</Label>
                  <Input id={`experience.${idx}.start`} {...register(`experience.${idx}.start` as const)} />
                </div>
                <div>
                  <Label htmlFor={`experience.${idx}.end`}>End</Label>
                  <Input id={`experience.${idx}.end`} {...register(`experience.${idx}.end` as const)} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`experience.${idx}.responsibilities`}>Responsibilities</Label>
                  <Textarea id={`experience.${idx}.responsibilities`} {...register(`experience.${idx}.responsibilities` as const)} rows={3} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`experience.${idx}.achievements`}>Achievements</Label>
                  <Textarea id={`experience.${idx}.achievements`} {...register(`experience.${idx}.achievements` as const)} rows={3} />
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => experience.append({} as any)}>+ Add experience</Button>
          </Section>
        )}

        {step === 3 && (
          <Section title="Skills">
            {skills.fields.map((f, idx) => (
              <div key={f.id} className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`skills.${idx}.category`}>Category</Label>
                  <Input id={`skills.${idx}.category`} {...register(`skills.${idx}.category` as const)} />
                </div>
                <div>
                  <Label htmlFor={`skills.${idx}.items`}>Items (comma separated)</Label>
                  <Input id={`skills.${idx}.items`} {...register(`skills.${idx}.items` as const)} />
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => skills.append({ category: '', items: '' })}>+ Add skills</Button>
          </Section>
        )}

        {step === 4 && (
          <Section title="Projects">
            {projects.fields.map((f, idx) => (
              <div key={f.id} className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`projects.${idx}.name`}>Name</Label>
                  <Input id={`projects.${idx}.name`} {...register(`projects.${idx}.name` as const)} />
                </div>
                <div>
                  <Label htmlFor={`projects.${idx}.link`}>Link</Label>
                  <Input id={`projects.${idx}.link`} {...register(`projects.${idx}.link` as const)} />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`projects.${idx}.description`}>Description</Label>
                  <Textarea id={`projects.${idx}.description`} {...register(`projects.${idx}.description` as const)} rows={3} />
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" onClick={() => projects.append({ name: '' })}>+ Add project</Button>
          </Section>
        )}

        {step === 5 && (
          <Section title="Review & Generate">
            <p className="text-sm text-gray-600">Review your inputs and generate your AI-optimized CV and cover letter. You can also export later.</p>
            <div className="grid gap-3">
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="template">Template</Label>
                  <select id="template" className="w-full rounded-md border px-3 py-2 text-sm" value={templateKey} onChange={(e) => setTemplateKey(e.target.value)}>
                    <option value="minimal">Minimal</option>
                    <option value="modern">Modern</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="tone">Cover letter tone</Label>
                  <select id="tone" className="w-full rounded-md border px-3 py-2 text-sm" value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="persuasive">Persuasive</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="job">Job description (optional)</Label>
                  <Textarea id="job" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={3} placeholder="Paste a job description to tailor your CV" />
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button onClick={handleSubmit(onGenerateCV)}>Generate CV</Button>
                <Button variant="secondary" onClick={onTailorToJob}>Tailor to Job</Button>
                <Button variant="secondary" onClick={onGenerateCoverLetter}>Generate Cover Letter</Button>
                <Button variant="secondary" onClick={onComputeAts}>ATS Score</Button>
                <Button variant="secondary" onClick={onSkillsGap}>Skills Gap</Button>
                <Button variant="secondary" onClick={onSave}>Save</Button>
                {docId && (
                  <>
                    <a className="px-4 py-2 rounded-md border" href={exportUrl('pdf')}>Export PDF</a>
                    <a className="px-4 py-2 rounded-md border" href={exportUrl('docx')}>Export DOCX</a>
                    <a className="px-4 py-2 rounded-md border" href={exportUrl('txt')}>Export TXT</a>
                  </>
                )}
              </div>
              {(atsScore !== null || skillsSuggestions.length > 0) && (
                <div className="rounded-lg border p-3 text-sm">
                  {atsScore !== null && (
                    <div className="mb-2">ATS Score: <span className="font-semibold">{atsScore}</span>{missingKeywords.length ? ` • Missing: ${missingKeywords.join(', ')}` : ''}</div>
                  )}
                  {skillsSuggestions.length > 0 && (
                    <div>Skills to add: {skillsSuggestions.join(', ')}</div>
                  )}
                </div>
              )}
              {coverLetter && (
                <div className="rounded-lg border p-3">
                  <h4 className="font-medium">Cover Letter</h4>
                  <div className="prose max-w-none mt-2 whitespace-pre-wrap text-sm">{coverLetter}</div>
                </div>
              )}
            </div>
          </Section>
        )}
      </div>

      <div className="lg:sticky lg:top-16 h-fit">
        <div className="rounded-xl border bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Live Preview</h3>
            <div className="text-sm text-gray-500">Template: {templateKey[0].toUpperCase() + templateKey.slice(1)}</div>
          </div>
          <div className="prose max-w-none mt-4 whitespace-pre-wrap text-sm">
            {preview || 'Your generated CV will appear here.'}
          </div>
        </div>
      </div>
    </div>
  );
}