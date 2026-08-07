import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { esTemplateSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }
  try {
    const raw = await request.json();
    const parsed = esTemplateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: '入力値が不正です', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const body = parsed.data;

    const template = await prisma.esTemplate.create({
      data: {
        industry: body.industry,
        type: body.type,
        title: body.title,
        wordCount: body.wordCount,
        content: body.content,
      },
    });
    return NextResponse.json(template);
  } catch (error) {
    console.error('Failed to create template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
