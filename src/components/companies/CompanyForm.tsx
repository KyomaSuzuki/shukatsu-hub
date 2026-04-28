'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INDUSTRIES, COMPANY_STATUSES } from '@/lib/constants';

export default function CompanyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: INDUSTRIES[0].value,
    status: 'INTERESTED',
    difficulty: '2',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          difficulty: parseInt(formData.difficulty),
        }),
      });

      if (!res.ok) throw new Error('Failed to create company');
      
      const newCompany = await res.json();
      router.push(`/companies/${newCompany.id}`);
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
          {loading ? '登録中...' : '企業を登録する'}
        </button>
      </div>
    </form>
  );
}
