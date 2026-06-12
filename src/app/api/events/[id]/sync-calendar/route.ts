import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { addEventToCalendar, removeEventFromCalendar } from '@/lib/googleCalendar';

// POST /api/events/[id]/sync-calendar — Googleカレンダーに追加
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'イベントが見つかりません' }, { status: 404 });
    }

    if (event.googleEventId) {
      return NextResponse.json({ message: 'すでに同期済みです', googleEventId: event.googleEventId });
    }

    const googleEventId = await addEventToCalendar(user.id, {
      title: event.title,
      date: event.date,
      endDate: event.endDate,
      description: event.description,
    });

    await prisma.event.update({
      where: { id },
      data: { googleEventId },
    });

    return NextResponse.json({ success: true, googleEventId });
  } catch (error) {
    console.error('Failed to sync event:', error);
    return NextResponse.json({ error: 'カレンダー同期に失敗しました' }, { status: 500 });
  }
}

// DELETE /api/events/[id]/sync-calendar — Googleカレンダーから削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event?.googleEventId) {
      return NextResponse.json({ error: '同期されていません' }, { status: 400 });
    }

    await removeEventFromCalendar(user.id, event.googleEventId);

    await prisma.event.update({
      where: { id },
      data: { googleEventId: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to unsync event:', error);
    return NextResponse.json({ error: 'カレンダー同期解除に失敗しました' }, { status: 500 });
  }
}
