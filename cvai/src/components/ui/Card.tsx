import { ReactNode } from 'react';
import { clsx } from 'clsx';

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-xl border bg-white shadow-sm', className)}>
      {children}
    </div>
  );
}