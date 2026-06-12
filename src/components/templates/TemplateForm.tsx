'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INDUSTRIES, ES_TEMPLATE_TYPES } from '@/lib/constants';

interface TemplateFormProps {
  initialData?: {
    id: string;
    industry: string;
    type: string;
    title: string;
    wordCount: number;
    content: string;
  };
}

export default function TemplateForm({ initialData }: TemplateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      industry: formData.get('industry'),
      type: formData.get('type'),
      title: formData.get('title'),
      wordCount: formData.get('wordCount'),
      content: formData.get('content'),
    };

    try {
      const url = isEditing ? `/api/templates/${initialData.id}` : '/api/templates';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to save');

      router.push('/templates');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditing || !confirm('本当に削除しますか？')) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/templates/${initialData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      router.push('/templates');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('削除に失敗しました');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label className="form-label">タイトル</label>
        <input
          type="text"
          name="title"
          className="form-input"
          required
          defaultValue={initialData?.title}
          placeholder="例: IT業界向け ガクチカ"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">業界</label>
          <select name="industry" className="form-select" defaultValue={initialData?.industry || '全業界'}>
            <option value="全業界">全業界 (共通)</option>
            {INDUSTRIES.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">種類</label>
          <select name="type" className="form-select" defaultValue={initialData?.type || 'MOTIVATION'}>
            {ES_TEMPLATE_TYPES.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">文字数 (目安)</label>
          <select name="wordCount" className="form-select" defaultValue={initialData?.wordCount || 400}>
            <option value="200">200字</option>
            <option value="300">300字</option>
            <option value="400">400字</option>
            <option value="600">600字</option>
            <option value="800">800字</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">本文</label>
        <textarea
          name="content"
          className="form-input"
          rows={10}
          required
          defaultValue={initialData?.content}
          placeholder="ESの本文を入力してください..."
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '保存中...' : (isEditing ? '更新する' : '登録する')}
        </button>
        {isEditing && (
          <button type="button" onClick={handleDelete} className="btn btn-danger" disabled={loading}>
            削除する
          </button>
        )}
      </div>
    </form>
  );
}
