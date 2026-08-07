import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const template = await prisma.esTemplate.create({
      data: {
        industry: body.industry,
        type: body.type,
        title: body.title,
        wordCount: parseInt(body.wordCount, 10),
        content: body.content,
      },
    });
    return NextResponse.json(template);
  } catch (error) {
    console.error('Failed to create template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
