import { prisma } from '@/lib/prisma';
import CalendarView from '@/components/calendar/CalendarView';

export default async function CalendarPage() {
  const events = await prisma.event.findMany({
    include: { company: true },
    orderBy: { date: 'asc' }
  });

  // DBのDateTime型を文字列(ISO)に変換してクライアントに渡す
  const serializedEvents = events.map(e => ({
    ...e,
    date: e.date.toISOString(),
    endDate: e.endDate?.toISOString() || null,
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">カレンダー</h1>
        <button className="btn btn-primary">+ 予定を追加</button>
      </div>

      <CalendarView events={serializedEvents as any} />
    </div>
  );
}
