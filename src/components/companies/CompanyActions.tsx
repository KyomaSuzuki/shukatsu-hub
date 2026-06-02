'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface CompanyActionsProps {
  companyId: string;
  companyName: string;
}

export default function CompanyActions({ companyId, companyName }: CompanyActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`「${companyName}」を削除しますか？\nこの操作は取り消せません。`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/companies/${companyId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/companies');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Link href={`/companies/${companyId}/edit`} className="btn btn-secondary btn-sm">
        ✏️ 編集
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="btn btn-sm"
        style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.3)' }}
      >
        {deleting ? '削除中...' : '🗑️ 削除'}
      </button>
    </div>
  );
}
