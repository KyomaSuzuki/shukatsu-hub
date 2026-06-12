import { prisma } from '@/lib/prisma';
import CalendarView from '@/components/calendar/CalendarView';
import SyncCalendarButton from '@/components/calendar/SyncCalendarButton';

export default async function CalendarPage() {
  const events = await prisma.event.findMany({
    include: { company: true },
    orderBy: { date: 'asc' }
  });

  const serializedEvents = events.map(e => ({
    ...e,
    date: e.date.toISOString(),
    endDate: e.endDate?.toISOString() || null,
    googleEventId: e.googleEventId,
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">カレンダー</h1>
        <button className="btn btn-primary">+ 予定を追加</button>
      </div>

      <CalendarView events={serializedEvents as any} />

      {/* イベント一覧とカレンダー同期ボタン */}
      <div className="glass-card section" style={{ marginTop: '1.5rem' }}>
        <div className="section-title">📋 イベント一覧 & カレンダー同期</div>
        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>イベントがありません</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {serializedEvents.map(event => (
              <div
                key={event.id}
                className="event-item"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem' }}
              >
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{event.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {new Date(event.date).toLocaleString('ja-JP', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                    {event.company && ` • ${event.company.name}`}
                  </div>
                </div>
                <SyncCalendarButton
                  eventId={event.id}
                  googleEventId={event.googleEventId}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
