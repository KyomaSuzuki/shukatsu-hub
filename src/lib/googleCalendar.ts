import { google, calendar_v3 } from 'googleapis';
import { prisma } from '@/lib/prisma';

/**
 * DBからユーザーのGoogleトークンを取得してCalendarクライアントを返す
 */
export async function getCalendarClient(userId: string) {
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

  // トークンが期限切れの場合は自動リフレッシュ
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

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * アプリのEventをGoogleカレンダーに追加
 * @returns Google Calendar上のイベントID
 */
export async function addEventToCalendar(
  userId: string,
  event: {
    title: string;
    date: Date;
    endDate?: Date | null;
    description?: string | null;
  }
): Promise<string> {
  const calendar = await getCalendarClient(userId);

  const endDateTime = event.endDate
    ? event.endDate
    : new Date(event.date.getTime() + 60 * 60 * 1000); // デフォルト1時間後

  const result = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: `📋 ${event.title}`,
      description: event.description ?? undefined,
      start: { dateTime: event.date.toISOString(), timeZone: 'Asia/Tokyo' },
      end: { dateTime: endDateTime.toISOString(), timeZone: 'Asia/Tokyo' },
    },
  });

  return result.data.id!;
}

/**
 * Googleカレンダーからイベントを削除
 */
export async function removeEventFromCalendar(
  userId: string,
  googleEventId: string
): Promise<void> {
  const calendar = await getCalendarClient(userId);
  await calendar.events.delete({
    calendarId: 'primary',
    eventId: googleEventId,
  });
}
