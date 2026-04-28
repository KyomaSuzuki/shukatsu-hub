'use client';

import { useState } from 'react';
import { TODO_PRIORITIES } from '@/lib/constants';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
  dueDate: string | null;
  company?: { name: string } | null;
}

export default function TodoManager({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, COMPLETED

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    // 楽観的UI更新
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      
      if (!res.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error(error);
      // エラー時は元に戻す
      setTodos(todos.map(t => t.id === id ? { ...t, completed: currentStatus } : t));
    }
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'PENDING') return !t.completed;
    if (filter === 'COMPLETED') return t.completed;
    return true;
  });

  return (
    <div className="glass-card section">
      <div className="filter-bar">
        <button 
          className={`chip ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >全て ({todos.length})</button>
        <button 
          className={`chip ${filter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setFilter('PENDING')}
        >未完了 ({todos.filter(t => !t.completed).length})</button>
        <button 
          className={`chip ${filter === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setFilter('COMPLETED')}
        >完了済 ({todos.filter(t => t.completed).length})</button>
      </div>

      <div className="todo-list">
        {filteredTodos.map(todo => {
          const priorityInfo = TODO_PRIORITIES.find(p => p.value === todo.priority);
          
          return (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div 
                className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                onClick={() => toggleTodo(todo.id, todo.completed)}
              >
                {todo.completed && '✓'}
              </div>
              <div className="todo-content">
                <div className="todo-title">{todo.title}</div>
                <div className="todo-meta">
                  {todo.company && <span>🏢 {todo.company.name}</span>}
                  {todo.dueDate && <span>📅 {new Date(todo.dueDate).toLocaleDateString()}</span>}
                  {priorityInfo && (
                    <span style={{ color: priorityInfo.color }}>
                      {priorityInfo.icon} {priorityInfo.label}優先
                    </span>
                  )}
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                編集
              </button>
            </div>
          );
        })}

        {filteredTodos.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <p>タスクはありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
