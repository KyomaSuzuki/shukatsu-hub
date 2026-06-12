import { prisma } from '@/lib/prisma';
import { INDUSTRIES, ES_TEMPLATE_TYPES } from '@/lib/constants';
import Link from 'next/link';

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ industry?: string; type?: string }>
}) {
  const { industry, type } = await searchParams;

  // フィルタリング条件の構築
  const where: any = {};
  if (industry && industry !== 'ALL') where.industry = industry;
  if (type && type !== 'ALL') where.type = type;

  // テンプレ取得
  const templates = await prisma.esTemplate.findMany({
    where,
    orderBy: [{ industry: 'asc' }, { type: 'asc' }, { wordCount: 'asc' }],
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="page-title">ESテンプレート</h1>
        <Link href="/templates/new" className="btn btn-primary">
          + テンプレートを登録
        </Link>
      </div>

      <div className="glass-card section">
        <form className="filter-bar" method="GET">
          <div className="form-group" style={{ marginBottom: 0, minWidth: '200px' }}>
            <select className="form-select" name="industry" defaultValue={industry || 'ALL'}>
              <option value="ALL">すべての業界</option>
              {INDUSTRIES.map(i => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
              <option value="全業界">全業界 (共通)</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: '200px' }}>
            <select className="form-select" name="type" defaultValue={type || 'ALL'}>
              <option value="ALL">すべての種類</option>
              {ES_TEMPLATE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">絞り込み</button>
        </form>
      </div>

      <div className="company-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card" style={{ position: 'relative' }}>
            <Link 
              href={`/templates/${template.id}/edit`}
              style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.2rem', textDecoration: 'none' }}
              title="編集する"
            >
              ✏️
            </Link>
            <div className="template-card-header" style={{ paddingRight: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{template.title}</h3>
              <span className="badge" style={{ background: 'var(--color-bg-secondary)' }}>
                {template.wordCount}字
              </span>
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
              <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-accent)' }}>
                {template.industry}
              </span>
              <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--color-purple)' }}>
                {ES_TEMPLATE_TYPES.find(t => t.value === template.type)?.label || template.type}
              </span>
            </div>
            <div className="template-content">
              {template.content}
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">📝</div>
            <p>条件に一致するテンプレートがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
