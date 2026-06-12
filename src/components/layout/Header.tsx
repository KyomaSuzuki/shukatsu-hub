'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
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
        <span>Welcome back!</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="header-date">{dateStr}</div>

        {/* Google認証ボタン */}
        {status === 'loading' ? (
          <div style={{ width: '32px', height: '32px' }} />
        ) : session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name ?? ''}
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }}
              />
            )}
            <button
              onClick={() => signOut()}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem' }}
            >
              ログアウト
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
          >
            <span>📅</span>
            <span>Googleでログイン</span>
          </button>
        )}
      </div>
    </header>
  );
}
