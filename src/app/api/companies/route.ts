import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { SELECTION_STAGES } from '@/lib/constants';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }
  try {
    const companies = await prisma.company.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        selections: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }
  try {
    const body = await request.json();
    
    // 企業を作成
    const company = await prisma.company.create({
      data: {
        name: body.name,
        industry: body.industry,
        category: body.category,
        website: body.website,
        difficulty: body.difficulty,
        notes: body.notes,
        status: body.status,
      },
    });

    // 初期化時に基本の選考パイプラインを一括作成
    const selectionsData = SELECTION_STAGES.map(stage => ({
      companyId: company.id,
      stage: stage.value,
      status: 'PENDING',
    }));

    await prisma.selection.createMany({
      data: selectionsData,
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Failed to create company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
