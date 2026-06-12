import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ExtractedEmailData {
  companyName: string | null;
  mypageUrl: string | null;
  selectionStatus: string | null; // PASSED, FAILED, SCHEDULED
  events: Array<{
    title: string;
    date: string; // ISO 8601 string
    type: string; // INTERVIEW, SEMINAR, DEADLINE, OTHER
  }>;
  todos: Array<{
    title: string;
    dueDate: string | null; // ISO 8601 string
    priority: string; // HIGH, MEDIUM, LOW
  }>;
}

export async function extractInfoFromEmail(
  subject: string,
  from: string,
  body: string,
  emailDate: string
): Promise<ExtractedEmailData | null> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', generationConfig: { responseMimeType: "application/json" } });

  const prompt = `
あなたは就活生をサポートする優秀なAIアシスタントです。
以下の受信メールの内容から、就活に関する重要な情報を抽出し、指定されたJSON形式で出力してください。
メールが就職活動に関係ない場合、または抽出できる情報が何もない場合は、全てのフィールドをnullや空配列にして返してください。

【メール情報】
送信日時: ${emailDate}
送信者: ${from}
件名: ${subject}

【本文】
${body}

【抽出条件と出力JSONスキーマ】
以下の構造のJSONを出力してください。
{
  "companyName": "企業名（株式会社などは省略してよい。不明な場合はnull）",
  "mypageUrl": "マイページのURLやログインURLがあれば抽出（不明な場合はnull）",
  "selectionStatus": "選考の合否や結果が記載されていれば抽出。合格/通過なら'PASSED'、不合格/お祈りなら'FAILED'、次回選考の案内なら'SCHEDULED'、不明ならnull",
  "events": [
    {
      "title": "イベント名（例: 一次面接、会社説明会）",
      "date": "イベントの開催日時（ISO 8601形式の文字列 例: 2026-06-20T14:00:00+09:00）。必ず送信日時(${emailDate})以降の適切な年を推測すること。",
      "type": "イベントの種類 ('INTERVIEW', 'SEMINAR', 'DEADLINE', 'OTHER' のいずれか)"
    }
  ],
  "todos": [
    {
      "title": "やるべきこと（例: エントリーシート提出、適性検査受験、面接日程の予約）",
      "dueDate": "締め切り日時（ISO 8601形式の文字列、不明ならnull）",
      "priority": "優先度 ('HIGH', 'MEDIUM', 'LOW' のいずれか)"
    }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed: ExtractedEmailData = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error('Failed to extract info from email via Gemini:', error);
    return null;
  }
}
