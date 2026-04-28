import { prisma } from '@/lib/prisma';
import TodoManager from '@/components/todos/TodoManager';

export default async function TodosPage() {
  const todos = await prisma.todo.findMany({
    include: { company: true },
    orderBy: [
      { completed: 'asc' }, // 未完了が先
      { priority: 'asc' },  // 優先度順
      { dueDate: 'asc' }    // 期限が近い順
    ]
  });

  const serializedTodos = todos.map(t => ({
    ...t,
    dueDate: t.dueDate?.toISOString() || null,
  }));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Todoリスト</h1>
        <button className="btn btn-primary">+ タスクを追加</button>
      </div>

      <TodoManager initialTodos={serializedTodos as any} />
    </div>
  );
}
