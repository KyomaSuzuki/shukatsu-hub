import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.company.update({
      where: { id },
      data: {
        name: body.name,
        industry: body.industry,
        category: body.category ?? null,
        website: body.website ?? null,
        difficulty: body.difficulty,
        notes: body.notes ?? null,
        status: body.status,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update company:', error);
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }
  try {
    const { id } = await params;

    await prisma.company.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete company:', error);
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 });
  }
}
