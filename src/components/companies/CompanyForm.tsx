'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INDUSTRIES, COMPANY_STATUSES } from '@/lib/constants';

interface CompanyFormProps {
  defaultValues?: {
    name: string;
    industry: string;
    category?: string | null;
    website?: string | null;
    status: string;
    difficulty: number | null;
    notes?: string | null;
  };
  companyId?: string; // 指定があれば編集モード (PUT)
}

export default function CompanyForm({ defaultValues, companyId }: CompanyFormProps) {
  const router = useRouter();
  const isEditMode = !!companyId;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: defaultValues?.name ?? '',
    industry: defaultValues?.industry ?? INDUSTRIES[0].value,
    category: defaultValues?.category ?? '',
    website: defaultValues?.website ?? '',
    status: defaultValues?.status ?? 'INTERESTED',
    difficulty: String(defaultValues?.difficulty ?? 2),
    notes: defaultValues?.notes ?? '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      difficulty: parseInt(formData.difficulty),
      category: formData.category || null,
      website: formData.website || null,
      notes: formData.notes || null,
    };

    try {
      let res: Response;
      if (isEditMode) {
        res = await fetch(`/api/companies/${companyId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/companies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error('Failed to save company');

      const saved = await res.json();
      router.push(`/companies/${saved.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="form-group">
        <label className="form-label">企業名 <span style={{ color: 'var(--color-danger)' }}>*</span></label>
        <input
          type="text"
          name="name"
          className="form-input"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="例: 株式会社バンダイ"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">業界カテゴリ</label>
          <select name="industry" className="form-select" value={formData.industry} onChange={handleChange}>
            {INDUSTRIES.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">選考ステータス</label>
          <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
            {COMPANY_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">サブカテゴリ</label>
          <input
            type="text"
            name="category"
            className="form-input"
            value={formData.category}
            onChange={handleChange}
            placeholder="例: ユーザー系SIer"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Webサイト</label>
          <input
            type="url"
            name="website"
            className="form-input"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">難易度 (1〜3)</label>
        <select name="difficulty" className="form-select" value={formData.difficulty} onChange={handleChange}>
          <option value="1">⭐ (標準〜やや難)</option>
          <option value="2">⭐⭐ (難関)</option>
          <option value="3">⭐⭐⭐ (最難関)</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">メモ・備考</label>
        <textarea
          name="notes"
          className="form-textarea"
          value={formData.notes}
          onChange={handleChange}
          placeholder="魅力に感じている点や注意点など"
        />
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={() => router.back()} disabled={loading}>
          キャンセル
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '保存中...' : isEditMode ? '変更を保存' : '企業を登録する'}
        </button>
      </div>
    </form>
  );
}
