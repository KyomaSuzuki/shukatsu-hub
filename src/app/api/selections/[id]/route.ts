import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.selection.update({
      where: { id },
      data: {
        status: body.status,
        date: body.date ? new Date(body.date) : null,
        notes: body.notes ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update selection:', error);
    return NextResponse.json({ error: 'Failed to update selection' }, { status: 500 });
  }
}
