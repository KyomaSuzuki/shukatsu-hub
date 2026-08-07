// ===== APIリクエストのバリデーションスキーマ =====
// zod を使って各APIエンドポイントの入力値を検証する

import { z } from 'zod';

// --- 共通 ---
const industryEnum = z.enum([
  '玩具エンタメ', 'IT', 'SIer', 'シンクタンク', '電機精密',
  '自動車', '素材化学', '重工インフラ', '半導体電子部品', '通信インフラ', 'その他',
]);

const companyStatusEnum = z.enum([
  'INTERESTED', 'APPLIED', 'IN_PROGRESS', 'OFFERED', 'REJECTED', 'WITHDRAWN',
]);

const selectionStatusEnum = z.enum([
  'PENDING', 'SCHEDULED', 'PASSED', 'FAILED',
]);

const todoPriorityEnum = z.enum(['HIGH', 'MEDIUM', 'LOW']);

const esTemplateTypeEnum = z.enum([
  'MOTIVATION', 'SELF_PR', 'GAKUCHIKA', 'RESEARCH', 'OTHER',
]);

// --- 企業 ---
export const companyCreateSchema = z.object({
  name: z.string().min(1, '企業名は必須です').max(100),
  industry: industryEnum,
  category: z.string().max(100).optional().nullable(),
  website: z.string().url('URLの形式が正しくありません').optional().nullable().or(z.literal('')),
  difficulty: z.number().int().min(1).max(3).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  status: companyStatusEnum.default('INTERESTED'),
});

export const companyUpdateSchema = companyCreateSchema;

// --- 選考ステップ ---
export const selectionUpdateSchema = z.object({
  status: selectionStatusEnum,
  date: z.string().datetime({ offset: true }).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

// --- Todo ---
export const todoUpdateSchema = z.object({
  completed: z.boolean(),
});

// --- ESテンプレート ---
export const esTemplateSchema = z.object({
  industry: industryEnum,
  type: esTemplateTypeEnum,
  title: z.string().min(1, 'タイトルは必須です').max(200),
  wordCount: z.number().int().min(50).max(2000),
  content: z.string().min(1, '本文は必須です').max(10000),
});
