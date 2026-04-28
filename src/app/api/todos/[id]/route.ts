import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data: {
        completed: body.completed,
      },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error('Failed to update todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}
