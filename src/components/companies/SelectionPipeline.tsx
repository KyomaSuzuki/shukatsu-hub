'use client';

import { useState } from 'react';
import { SELECTION_STAGES, SELECTION_STATUSES } from '@/lib/constants';
import { useRouter } from 'next/navigation';

interface Selection {
  id: string;
  stage: string;
  status: string;
  date: string | null;
  notes?: string | null;
}

const STATUS_ICONS: Record<string, string> = {
  PENDING: '⬜',
  SCHEDULED: '🔵',
  PASSED: '✅',
  FAILED: '❌',
};

export default function SelectionPipeline({ selections }: { selections: Selection[] }) {
  const router = useRouter();
  const [localSelections, setLocalSelections] = useState(selections);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  // SELECTION_STAGESの順番に並び替え
  const sortedSelections = [...localSelections].sort((a, b) => {
    const orderA = SELECTION_STAGES.find(s => s.value === a.stage)?.order || 99;
    const orderB = SELECTION_STAGES.find(s => s.value === b.stage)?.order || 99;
    return orderA - orderB;
  });

  const handleStatusChange = async (selectionId: string, newStatus: string) => {
    setSaving(selectionId);
    setActiveId(null);

    try {
      const res = await fetch(`/api/selections/${selectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update');

      // ローカル状態を楽観的更新
      setLocalSelections(prev =>
        prev.map(s => s.id === selectionId ? { ...s, status: newStatus } : s)
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('更新に失敗しました');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
      <div className="pipeline" style={{ minWidth: 'max-content' }}>
        {sortedSelections.map((selection, index) => {
          const stageInfo = SELECTION_STAGES.find(s => s.value === selection.stage);
          if (!stageInfo) return null;

          const statusInfo = SELECTION_STATUSES.find(s => s.value === selection.status);
          const isSaving = saving === selection.id;
          const isActive = activeId === selection.id;

          // ステータスに応じた色
          let stageColor = 'rgba(255,255,255,0.05)';
          let borderColor = 'rgba(255,255,255,0.1)';
          if (selection.status === 'PASSED') { stageColor = 'rgba(52,211,153,0.15)'; borderColor = '#34d399'; }
          if (selection.status === 'FAILED') { stageColor = 'rgba(248,113,113,0.15)'; borderColor = '#f87171'; }
          if (selection.status === 'SCHEDULED') { stageColor = 'rgba(96,165,250,0.15)'; borderColor = '#60a5fa'; }

          return (
            <div key={selection.id} style={{ display: 'flex', alignItems: 'center' }}>
              {/* ステージボタン */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setActiveId(isActive ? null : selection.id)}
                  disabled={isSaving}
                  style={{
                    background: stageColor,
                    border: `2px solid ${borderColor}`,
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    cursor: 'pointer',
                    color: 'var(--color-text)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                    minWidth: '80px',
                    opacity: isSaving ? 0.6 : 1,
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>
                    {isSaving ? '⌛' : STATUS_ICONS[selection.status] ?? '⬜'}
                  </span>
                  <span>{stageInfo.label}</span>
                  {selection.status !== 'PENDING' && (
                    <span style={{ fontSize: '0.65rem', color: statusInfo?.color, fontWeight: 600 }}>
                      {statusInfo?.label}
                    </span>
                  )}
                </button>

                {/* ステータス変更ドロップダウン */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--color-surface)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      padding: '0.4rem',
                      zIndex: 50,
                      minWidth: '130px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', padding: '0.3rem 0.6rem 0.4rem', fontWeight: 600 }}>
                      ステータス変更
                    </div>
                    {SELECTION_STATUSES.map(s => (
                      <button
                        key={s.value}
                        onClick={() => handleStatusChange(selection.id, s.value)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          width: '100%',
                          background: selection.status === s.value ? `${s.color}20` : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.45rem 0.6rem',
                          cursor: 'pointer',
                          color: s.color,
                          fontSize: '0.8rem',
                          fontWeight: selection.status === s.value ? 700 : 400,
                          textAlign: 'left',
                        }}
                      >
                        <span>{STATUS_ICONS[s.value]}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* コネクター */}
              {index < sortedSelections.length - 1 && (
                <div style={{ margin: '0 0.3rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                  ▶
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ドロップダウン外クリックで閉じる */}
      {activeId && (
        <div
          onClick={() => setActiveId(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
        />
      )}
    </div>
  );
}
