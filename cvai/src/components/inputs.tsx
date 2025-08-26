import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export const Label = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
);

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props }, ref
) {
  return (
    <input ref={ref} className={clsx('w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40', className)} {...props} />
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props }, ref
) {
  return (
    <textarea ref={ref} className={clsx('w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40', className)} {...props} />
  );
});

export const Section = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <section className="border rounded-lg p-4 bg-white">
    <div className="flex items-center justify-between">
      <h3 className="font-medium">{title}</h3>
      {action}
    </div>
    <div className="mt-3 grid gap-3">
      {children}
    </div>
  </section>
);