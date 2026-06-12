'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SyncCalendarButtonProps {
  eventId: string;
  googleEventId: string | null;
}

export default function SyncCalendarButton({ eventId, googleEventId }: SyncCalendarButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [synced, setSynced] = useState(!!googleEventId);

  if (!session) {
    return (
      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        ※ カレンダー同期にはGoogleログインが必要
      </span>
    );
  }

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/sync-calendar`, {
        method: synced ? 'DELETE' : 'POST',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      setSynced(!synced);
      router.refresh();
    } catch (error: any) {
      alert(error.message ?? 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={loading}
      className="btn btn-sm"
      style={{
        background: synced ? 'rgba(52,211,153,0.15)' : 'rgba(96,165,250,0.15)',
        color: synced ? '#34d399' : '#60a5fa',
        border: `1px solid ${synced ? 'rgba(52,211,153,0.4)' : 'rgba(96,165,250,0.4)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.8rem',
      }}
    >
      {loading ? (
        '⌛ 処理中...'
      ) : synced ? (
        '✅ カレンダー同期済み（解除）'
      ) : (
        '📅 Googleカレンダーに追加'
      )}
    </button>
  );
}
