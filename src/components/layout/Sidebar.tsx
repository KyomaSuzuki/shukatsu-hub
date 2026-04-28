'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'ダッシュボード', icon: '📊' },
    { href: '/companies', label: '企業・選考管理', icon: '🏢' },
    { href: '/calendar', label: 'カレンダー', icon: '📅' },
    { href: '/todos', label: 'Todoリスト', icon: '✅' },
    { href: '/templates', label: 'ESテンプレート', icon: '📝' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🎯</span>
        <h1>ShuKATSU Hub</h1>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className={isActive ? 'active' : ''}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
