'use client';

import { useEffect, useState } from 'react';

export default function Header() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    };
    setDateStr(today.toLocaleDateString('ja-JP', options));
  }, []);

  return (
    <header className="header">
      <div className="header-title">
        {/* 将来的にはここにパンくずリストや動的なページタイトルを表示 */}
        <span>Welcome back!</span>
      </div>
      <div className="header-date">
        {dateStr}
      </div>
    </header>
  );
}
