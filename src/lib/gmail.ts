import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

export async function getGmailClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: 'google' },
  });

  if (!account?.access_token) {
    throw new Error('Google アカウントが連携されていません');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token ?? undefined,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: tokens.access_token,
          expires_at: tokens.expiry_date
            ? Math.floor(tokens.expiry_date / 1000)
            : undefined,
        },
      });
    }
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function fetchRecentUnprocessedEmails(userId: string, maxResults: number = 10) {
  const gmail = await getGmailClient(userId);

  // 既に処理されたメールのIDリストを取得
  const processedEmails = await prisma.processedEmail.findMany({
    where: { userId },
    select: { messageId: true }
  });
  const processedIds = new Set(processedEmails.map(pe => pe.messageId));

  // "面接" または "選考" または "マイページ" などの就活関連キーワードを含むメールを検索
  const query = '面接 OR 選考 OR マイページ OR エントリー OR インターン';

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: 20 // 多めに取得して処理済みをフィルタする
  });

  const messages = res.data.messages || [];
  const emailsToProcess = [];

  for (const message of messages) {
    if (!message.id || processedIds.has(message.id)) continue;

    try {
      const msgRes = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full',
      });

      const payload = msgRes.data.payload;
      const headers = payload?.headers || [];
      const subject = headers.find(h => h.name?.toLowerCase() === 'subject')?.value || 'No Subject';
      const from = headers.find(h => h.name?.toLowerCase() === 'from')?.value || 'Unknown';
      const date = headers.find(h => h.name?.toLowerCase() === 'date')?.value || new Date().toISOString();

      let body = '';
      if (payload?.parts) {
        const textPart = payload.parts.find(part => part.mimeType === 'text/plain');
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        } else if (payload.parts[0]?.body?.data) { // fallback
          body = Buffer.from(payload.parts[0].body.data, 'base64').toString('utf-8');
        }
      } else if (payload?.body?.data) {
        body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
      }

      emailsToProcess.push({
        messageId: message.id,
        subject,
        from,
        date,
        body: body.substring(0, 5000) // 大きすぎる場合は切り詰める
      });

      if (emailsToProcess.length >= maxResults) break;
    } catch (err) {
      console.error(`Error fetching message ${message.id}:`, err);
    }
  }

  return emailsToProcess;
}

export async function markEmailAsProcessed(userId: string, messageId: string) {
  await prisma.processedEmail.create({
    data: { userId, messageId }
  });
}
