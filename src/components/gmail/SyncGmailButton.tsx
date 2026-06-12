'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SyncGmailButton() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; data?: any[] } | null>(null);

  if (!session) return null;

  const handleSync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/gmail/sync', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || '同期に失敗しました');
      }

      setResult({
        message: data.message,
        data: data.results,
      });
      
      // ダッシュボードのデータを再取得
      router.refresh();
      
      // 3秒後に結果メッセージを消す
      setTimeout(() => setResult(null), 5000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={handleSync} 
        disabled={loading}
        className="btn"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {loading ? (
          <>
            <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
            <span>AIがメールを解析中...</span>
          </>
        ) : (
          <>
            <span>📩</span>
            <span>Gmailから予定を同期 (AI)</span>
          </>
        )}
      </button>

      {/* 同期結果のポップアップ */}
      {result && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '1rem',
          width: '300px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          zIndex: 100,
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
            {result.message}
          </div>
          {result.data && result.data.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              {result.data.map((r, i) => (
                <li key={i} style={{ marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--color-text)' }}>{r.companyName}</span>
                  {r.events > 0 && ` (+${r.events}イベント)`}
                  {r.todos > 0 && ` (+${r.todos}Todo)`}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
