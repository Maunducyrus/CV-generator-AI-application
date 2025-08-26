"use client";
import { useState, useEffect, Suspense } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input, Label, Textarea, Section } from '@/components/inputs';
import { clsx } from 'clsx';
import { useSearchParams } from 'next/navigation';

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
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-8">Loading builder…</div>}>
      <BuilderContent />
    </Suspense>
  );
}

function BuilderContent() {
  const [step, setStep] = useState(0);
  const [preview, setPreview] = useState<string>('');
  const [docId, setDocId] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
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
      }
    })();
  }, [sp, reset]);

  const education = useFieldArray({ control, name: 'education' });
  const experience = useFieldArray({ control, name: 'experience' });
  const skills = useFieldArray({ control, name: 'skills' });
  const projects = useFieldArray({ control, name: 'projects' });

  const onGenerateCV = async (data: CvForm) => {
    const res = await fetch('/api/ai/generate-cv', { method: 'POST', body: JSON.stringify(data) });
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
    const res = await fetch('/api/ai/generate-cv', { method: 'POST', body: JSON.stringify({ ...data, jobDescription }) });
    const json = await res.json();
    setPreview(json.markdown ?? '');
  };

  const onSave = async () => {
    const payload = JSON.stringify(watch());
    if (docId) {
      await fetch(`/api/documents/${docId}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: watch().personal.fullName || 'CV', content: payload, templateKey: 'minimal', language: 'en' }) });
    } else {
      const res = await fetch('/api/documents', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: watch().personal.fullName || 'CV', content: payload }) });
      const j = await res.json();
      setDocId(j.id);
    }
    alert('Saved');
  };

  const exportUrl = (fmt: 'pdf' | 'docx' | 'txt') => (docId ? `/api/export/${fmt}/${docId}` : '#');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-2 gap-6">
      <div className="grid gap-4">
        <div className="flex items-center gap-2 text-sm">
          {steps.map((label, i) => (
            <button key={i} onClick={() => setStep(i)} className={clsx('px-3 py-1 rounded border', i === step && 'bg-brand text-white border-brand')}>
              {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <Section title="Personal Information" action={<button className="text-sm text-brand" onClick={onSuggestSummary}>Suggest summary</button>}>
            <div>
              <Label htmlFor="personal.fullName">Full Name</Label>
              <Input id="personal.fullName" {...register('personal.fullName')} placeholder="John Doe" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="personal.title">Title</Label>
                <Input id="personal.title" {...register('personal.title')} placeholder="Software Engineer" />
              </div>
              <div>
                <Label htmlFor="personal.email">Email</Label>
                <Input id="personal.email" {...register('personal.email')} placeholder="john@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="personal.phone">Phone</Label>
                <Input id="personal.phone" {...register('personal.phone')} placeholder="+1 555 123" />
              </div>
              <div>
                <Label htmlFor="personal.address">Address</Label>
                <Input id="personal.address" {...register('personal.address')} placeholder="City, Country" />
              </div>
            </div>
            <div>
              <Label htmlFor="personal.summary">Summary</Label>
              <Textarea id="personal.summary" {...register('personal.summary')} rows={4} placeholder="Brief professional summary" />
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
            <button className="text-sm text-brand" onClick={() => education.append({} as any)}>+ Add education</button>
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
            <button className="text-sm text-brand" onClick={() => experience.append({} as any)}>+ Add experience</button>
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
            <button className="text-sm text-brand" onClick={() => skills.append({ category: '', items: '' })}>+ Add skills</button>
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
            <button className="text-sm text-brand" onClick={() => projects.append({ name: '' })}>+ Add project</button>
          </Section>
        )}

        {step === 5 && (
          <Section title="Review & Generate">
            <p className="text-sm text-gray-600">Review your inputs and generate your AI-optimized CV. You can also export later.</p>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="job">Job description (optional)</Label>
                <Textarea id="job" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={4} placeholder="Paste a job description to tailor your CV" />
              </div>
              <div className="flex gap-3 flex-wrap">
                <button className="px-4 py-2 rounded-md bg-brand text-white" onClick={handleSubmit(onGenerateCV)}>Generate CV</button>
                <button className="px-4 py-2 rounded-md border" onClick={onTailorToJob}>Tailor to Job</button>
                <button className="px-4 py-2 rounded-md border" onClick={onSave}>Save</button>
                {docId && (
                  <>
                    <a className="px-4 py-2 rounded-md border" href={exportUrl('pdf')}>Export PDF</a>
                    <a className="px-4 py-2 rounded-md border" href={exportUrl('docx')}>Export DOCX</a>
                    <a className="px-4 py-2 rounded-md border" href={exportUrl('txt')}>Export TXT</a>
                  </>
                )}
              </div>
            </div>
          </Section>
        )}
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Live Preview</h3>
          <div className="text-sm text-gray-500">Template: Minimal</div>
        </div>
        <div className="prose max-w-none mt-4 whitespace-pre-wrap text-sm">
          {preview || 'Your generated CV will appear here.'}
        </div>
      </div>
    </div>
  );
}