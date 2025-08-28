"use client";
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [dark]);
  return (
    <button className="text-sm text-gray-600" onClick={() => setDark(v => !v)}>
      {dark ? 'Light' : 'Dark'} mode
    </button>
  );
}