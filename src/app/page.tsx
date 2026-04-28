import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// --- Dashboard Server Component ---
export default async function DashboardPage() {
  // データのフェッチ
  // 企業全体のステータス集計
  const companies = await prisma.company.findMany();
  
  const stats = {
    total: companies.length,
    inProgress: companies.filter(c => c.status === 'APPLIED' || c.status === 'IN_PROGRESS').length,
    offered: companies.filter(c => c.status === 'OFFERED').length,
    interested: companies.filter(c => c.status === 'INTERESTED').length,
  };

  // 直近のイベント取得 (今日から30日以内)
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);

  const upcomingEvents = await prisma.event.findMany({
    where: {
      date: {
        gte: today,
        lte: nextMonth,
      },
    },
    orderBy: { date: 'asc' },
    take: 5,
    include: { company: true },
  });

  // 直近のTodo取得 (未完了のもの)
  const pendingTodos = await prisma.todo.findMany({
    where: { completed: false },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { company: true },
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">ダッシュボード</h1>
        <Link href="/companies/new" className="btn btn-primary">
          + 企業を登録
        </Link>
      </div>

      {/* --- 統計カード --- */}
      <div className="stats-grid">
        <div className="stats-card" style={{ '--card-accent': 'var(--color-accent)' } as any}>
          <div className="stats-icon">🏢</div>
          <div className="stats-value">{stats.total}</div>
          <div className="stats-label">登録企業数</div>
        </div>
        <div className="stats-card" style={{ '--card-accent': 'var(--color-purple)' } as any}>
          <div className="stats-icon">🔄</div>
          <div className="stats-value">{stats.inProgress}</div>
          <div className="stats-label">選考中</div>
        </div>
        <div className="stats-card" style={{ '--card-accent': 'var(--color-warning)' } as any}>
          <div className="stats-icon">🎉</div>
          <div className="stats-value">{stats.offered}</div>
          <div className="stats-label">内定</div>
        </div>
        <div className="stats-card" style={{ '--card-accent': 'var(--color-text-muted)' } as any}>
          <div className="stats-icon">👀</div>
          <div className="stats-value">{stats.interested}</div>
          <div className="stats-label">興味あり</div>
        </div>
      </div>

      <div className="form-row">
        {/* --- 直近のイベント --- */}
        <div className="glass-card">
          <div className="section-title">📅 直近のイベント・締切</div>
          {upcomingEvents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>直近の予定はありません</p>
            </div>
          ) : (
            <div className="event-list">
              {upcomingEvents.map(event => {
                const date = new Date(event.date);
                return (
                  <div key={event.id} className="event-item">
                    <div className="event-date-box">
                      <div className="month">{date.getMonth() + 1}月</div>
                      <div className="day">{date.getDate()}</div>
                    </div>
                    <div className="event-info">
                      <div className="event-title">{event.title}</div>
                      <div className="event-company">
                        {event.company?.name || '企業指定なし'} • {event.type}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link href="/calendar" className="btn btn-secondary btn-sm">カレンダーを見る</Link>
          </div>
        </div>

        {/* --- 未完了のTodo --- */}
        <div className="glass-card">
          <div className="section-title">✅ やるべきこと</div>
          {pendingTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <p>すべてのタスクが完了しています</p>
            </div>
          ) : (
            <div className="todo-list">
              {pendingTodos.map(todo => (
                <div key={todo.id} className="todo-item">
                  <div className="todo-checkbox"></div>
                  <div className="todo-content">
                    <div className="todo-title">{todo.title}</div>
                    <div className="todo-meta">
                      {todo.company?.name && <span>🏢 {todo.company.name}</span>}
                      {todo.priority === 'HIGH' && <span style={{ color: 'var(--color-danger)' }}>🔴 高優先</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link href="/todos" className="btn btn-secondary btn-sm">すべてのTodoを見る</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
