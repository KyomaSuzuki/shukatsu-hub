import { prisma } from '@/lib/prisma';
import SelectionPipeline from '@/components/companies/SelectionPipeline';
import CompanyActions from '@/components/companies/CompanyActions';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIndustryColor, getStatusInfo } from '@/lib/constants';

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      selections: true,
      events: { orderBy: { date: 'asc' } },
      todos: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!company) {
    notFound();
  }

  const statusInfo = getStatusInfo(company.status);
  const stars = Array(company.difficulty || 1).fill('⭐').join('');

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/companies" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          ← 企業一覧に戻る
        </Link>
      </div>

      <div className="glass-card section" style={{ '--card-accent': getIndustryColor(company.industry) } as any}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>{company.name}</h1>
            <div style={{ color: 'var(--color-text-secondary)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span>{company.industry} {company.category ? `/ ${company.category}` : ''}</span>
              <span>{stars}</span>
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer">🌐 サイトを見る</a>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            <span className="badge" style={{ background: `${statusInfo.color}20`, color: statusInfo.color, fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              {statusInfo.icon} {statusInfo.label}
            </span>
            <CompanyActions companyId={company.id} companyName={company.name} />
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 className="section-title">🚀 選考フロー</h3>
          <SelectionPipeline selections={company.selections as any} />
          {/* 将来的にはこのフローをクリックしてステータス更新や面接日程追加ができるようにする */}
        </div>
      </div>

      <div className="form-row">
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="section-title" style={{ margin: 0 }}>📅 関連イベント</h3>
            <button className="btn btn-secondary btn-sm">+ 予定追加</button>
          </div>
          {company.events.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>予定はありません</p>
          ) : (
            <div className="event-list">
              {company.events.map(event => (
                <div key={event.id} className="event-item" style={{ padding: '0.5rem' }}>
                  <div style={{ flex: 1, fontSize: '0.85rem' }}>{event.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="section-title" style={{ margin: 0 }}>✅ Todo</h3>
            <button className="btn btn-secondary btn-sm">+ タスク追加</button>
          </div>
          {company.todos.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>タスクはありません</p>
          ) : (
            <div className="todo-list">
              {company.todos.map(todo => (
                <div key={todo.id} className="todo-item" style={{ padding: '0.5rem', opacity: todo.completed ? 0.5 : 1 }}>
                  <div className="todo-content">
                    <div className="todo-title" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                      {todo.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {company.notes && (
        <div className="glass-card section" style={{ marginTop: '1.5rem' }}>
          <h3 className="section-title">📝 メモ・備考</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            {company.notes}
          </p>
        </div>
      )}
    </div>
  );
}
