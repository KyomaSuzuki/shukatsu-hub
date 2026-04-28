'use client';

import { useState } from 'react';
import { EVENT_TYPES } from '@/lib/constants';

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
  company?: { name: string };
}

export default function CalendarView({ events }: { events: Event[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  // 日付枠の生成 (前月のはみ出し分 + 今月分)
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  // 今日の日付を取得 (YYYY-MM-DD形式で比較用)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="glass-card">
      <div className="calendar-nav">
        <button className="btn btn-secondary btn-icon" onClick={prevMonth}>◀</button>
        <h2>{year}年 {month + 1}月</h2>
        <button className="btn btn-secondary btn-icon" onClick={nextMonth}>▶</button>
        <button className="btn btn-secondary btn-sm" onClick={goToday} style={{ marginLeft: 'auto' }}>今日</button>
      </div>

      <div className="calendar-grid">
        {['日', '月', '火', '水', '木', '金', '土'].map(day => (
          <div key={day} className="calendar-header-cell">{day}</div>
        ))}
        
        {days.map((d, index) => {
          if (!d.isCurrentMonth || !d.day) {
            return <div key={`empty-${index}`} className="calendar-cell other-month"></div>;
          }

          // この日のイベントを抽出
          const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
          const isToday = cellDateStr === todayStr;
          
          const dayEvents = events.filter(e => e.date.startsWith(cellDateStr));

          return (
            <div key={d.day} className={`calendar-cell ${isToday ? 'today' : ''}`}>
              <div className={`calendar-date ${isToday ? 'today' : ''}`}>{d.day}</div>
              
              <div className="calendar-events">
                {dayEvents.map(event => {
                  const eventType = EVENT_TYPES.find(t => t.value === event.type);
                  return (
                    <div 
                      key={event.id} 
                      className="calendar-event"
                      style={{ background: `${eventType?.color}30`, color: eventType?.color, border: `1px solid ${eventType?.color}50` }}
                      title={`${event.title} (${event.company?.name || ''})`}
                    >
                      {eventType?.icon} {event.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
