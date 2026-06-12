import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { fetchRecentUnprocessedEmails, markEmailAsProcessed } from '@/lib/gmail';
import { extractInfoFromEmail } from '@/lib/aiExtractor';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Gmailから未処理の就活メールを取得
    const emails = await fetchRecentUnprocessedEmails(userId, 5); // 1回につき最大5件まで処理
    
    if (emails.length === 0) {
      return NextResponse.json({ message: '新しい就活メールはありませんでした', processedCount: 0 });
    }

    let processedCount = 0;
    const extractedResults = [];

    // 2. 各メールをAIで解析してDBに保存
    for (const email of emails) {
      const extracted = await extractInfoFromEmail(email.subject, email.from, email.body, email.date);
      
      if (extracted && extracted.companyName) {
        // 既存の企業を探す（名前の部分一致などで簡易検索）
        let company = await prisma.company.findFirst({
          where: {
            name: { contains: extracted.companyName }
          }
        });

        // 企業がなければ新規作成
        if (!company) {
          company = await prisma.company.create({
            data: {
              name: extracted.companyName,
              industry: 'その他',
              status: extracted.selectionStatus ?? 'INTERESTED',
              website: extracted.mypageUrl ?? undefined
            }
          });
        } else {
          // 既存企業の場合、URLやステータスを更新
          await prisma.company.update({
            where: { id: company.id },
            data: {
              status: extracted.selectionStatus ? extracted.selectionStatus : undefined,
              website: extracted.mypageUrl ? extracted.mypageUrl : undefined
            }
          });
        }

        // イベントの追加
        for (const ev of extracted.events) {
          if (ev.date) {
            await prisma.event.create({
              data: {
                title: ev.title,
                date: new Date(ev.date),
                type: ev.type,
                companyId: company.id
              }
            });
          }
        }

        // Todoの追加
        for (const todo of extracted.todos) {
          await prisma.todo.create({
            data: {
              title: todo.title,
              priority: todo.priority || 'MEDIUM',
              dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
              companyId: company.id
            }
          });
        }
        
        extractedResults.push({
          companyName: company.name,
          events: extracted.events.length,
          todos: extracted.todos.length
        });
      }

      // 処理済みとしてマーク
      await markEmailAsProcessed(userId, email.messageId);
      processedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `${processedCount}件のメールを処理しました`,
      results: extractedResults
    });

  } catch (error: any) {
    console.error('Failed to sync Gmail:', error);
    return NextResponse.json({ error: error.message || 'Gmailの同期に失敗しました' }, { status: 500 });
  }
}
