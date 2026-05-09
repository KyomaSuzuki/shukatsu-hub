# 就活管理Webアプリ「ShuKATSU Hub」 実装計画

## 概要

就活の全プロセスを一元管理するWebアプリケーション。企業管理・選考トラッカー・カレンダー・Todoリスト・ESテンプレ提案を核とし、将来的にGmail/Googleカレンダーと連携する。

学習目的も兼ねるため、モダンなフルスタック技術を段階的に習得できる構成とする。

---

## 技術スタック（学べること）

| 技術 | 役割 | 学べること |
|------|------|-----------|
| **Next.js 14 (App Router)** | フルスタックフレームワーク | React, SSR/CSR, ルーティング, API設計 |
| **TypeScript** | 型安全な開発 | 静的型付け, インターフェース設計 |
| **Prisma** | ORM (DB操作) | データモデリング, マイグレーション, CRUD |
| **SQLite** | データベース | RDB基礎, SQL, リレーション |
| **Vanilla CSS** | スタイリング | CSS Grid/Flexbox, アニメーション, レスポンシブ |
| **NextAuth.js** (Phase 2) | 認証 | OAuth2.0, セッション管理 |
| **Gmail API** (Phase 2) | メール連携 | REST API, Google Cloud Platform |
| **Google Calendar API** (Phase 2) | カレンダー連携 | OAuth認可フロー, Webhook |

---

## フェーズ分割

### Phase 1: MVP（今回実装） — ローカルで動く最小限の就活管理ツール

1. **ダッシュボード** — 全体サマリー（選考中企業数、直近の締切、Todoの進捗）
2. **企業管理** — 企業の登録/編集/削除、業界カテゴリ、選考ステータス管理
3. **選考トラッカー** — 企業ごとの選考フロー可視化（未応募→ES→面接→内定etc）
4. **カレンダービュー** — 締切・面接日程をカレンダー上に表示、アラーム設定
5. **Todoリスト** — 企業紐付け可能なタスク管理
6. **ESテンプレ提案** — 業界カテゴリに応じたテンプレート表示

### Phase 2: 外部連携（将来）
- Google OAuth認証
- Gmail API連携（メール読み取り → ラベル付け → 自動Todo/締切作成）
- Google Calendar API連携（双方向同期）
- プッシュ通知 / リマインダー

### Phase 3: 発展（将来）
- AI によるES添削・フィードバック
- 面接質問のフラッシュカード機能
- 就活仲間との共有機能

---

## Phase 1 詳細設計

### データモデル（Prisma Schema）

```prisma
model Company {
  id          String   @id @default(cuid())
  name        String
  industry    String   // 業界カテゴリ
  category    String?  // サブカテゴリ（ユーザー系SIer等）
  website     String?
  difficulty  Int?     // 難易度 1-3
  notes       String?
  status      String   @default("INTERESTED") // INTERESTED, APPLIED, IN_PROGRESS, OFFERED, REJECTED, WITHDRAWN
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  events      Event[]
  todos       Todo[]
  selections  Selection[]
}

model Selection {
  id          String   @id @default(cuid())
  companyId   String
  company     Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  stage       String   // ES, WEBTEST, GD, INTERVIEW_1, INTERVIEW_2, FINAL, OFFER
  status      String   @default("PENDING") // PENDING, PASSED, FAILED, SCHEDULED
  date        DateTime?
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Event {
  id          String   @id @default(cuid())
  title       String
  description String?
  date        DateTime
  endDate     DateTime?
  type        String   // DEADLINE, INTERVIEW, SEMINAR, OTHER
  companyId   String?
  company     Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)
  reminder    Boolean  @default(false)
  reminderMin Int?     // 何分前にリマインド
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Todo {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  priority    String   @default("MEDIUM") // HIGH, MEDIUM, LOW
  dueDate     DateTime?
  companyId   String?
  company     Company? @relation(fields: [companyId], references: [id], onDelete: SetNull)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model EsTemplate {
  id          String   @id @default(cuid())
  industry    String   // 対応業界
  type        String   // MOTIVATION, SELF_PR, GAKUCHIKA, RESEARCH, OTHER
  wordCount   Int      // 200 or 400
  content     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### ページ構成

```
/                     → ダッシュボード（サマリー）
/companies            → 企業一覧（検索・フィルター・カテゴリ）
/companies/new        → 企業登録
/companies/[id]       → 企業詳細（選考フロー・メモ・紐付きTodo）
/calendar             → カレンダービュー
/todos                → Todoリスト
/templates            → ESテンプレ一覧（業界別フィルター）
/templates/[id]       → テンプレ詳細
```

---

### コンポーネント構成

```
src/
├── app/
│   ├── layout.tsx            # 共通レイアウト（サイドバー + ヘッダー）
│   ├── page.tsx              # ダッシュボード
│   ├── globals.css           # デザインシステム（CSS変数・ユーティリティ）
│   ├── companies/
│   │   ├── page.tsx          # 企業一覧
│   │   ├── new/page.tsx      # 企業登録フォーム
│   │   └── [id]/page.tsx     # 企業詳細 + 選考トラッカー
│   ├── calendar/
│   │   └── page.tsx          # カレンダービュー
│   ├── todos/
│   │   └── page.tsx          # Todoリスト
│   ├── templates/
│   │   ├── page.tsx          # ESテンプレ一覧
│   │   └── [id]/page.tsx     # テンプレ詳細
│   └── api/
│       ├── companies/        # CRUD API
│       ├── events/           # CRUD API
│       ├── todos/            # CRUD API
│       ├── selections/       # CRUD API
│       └── templates/        # Read API + seed
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx       # サイドナビゲーション
│   │   └── Header.tsx        # ヘッダー
│   ├── dashboard/
│   │   ├── StatsCard.tsx     # 統計カード
│   │   ├── UpcomingEvents.tsx # 直近イベント
│   │   └── RecentActivity.tsx # 最近のアクティビティ
│   ├── companies/
│   │   ├── CompanyCard.tsx   # 企業カード
│   │   ├── CompanyForm.tsx   # 登録/編集フォーム
│   │   ├── SelectionPipeline.tsx # 選考フローパイプライン
│   │   └── FilterBar.tsx     # 検索・フィルター
│   ├── calendar/
│   │   └── CalendarView.tsx  # カレンダーコンポーネント
│   ├── todos/
│   │   ├── TodoItem.tsx      # Todoアイテム
│   │   └── TodoForm.tsx      # Todo追加フォーム
│   └── ui/
│       ├── Modal.tsx         # モーダル
│       ├── Badge.tsx         # ステータスバッジ
│       └── Button.tsx        # ボタン
├── lib/
│   ├── prisma.ts             # Prismaクライアント
│   └── constants.ts          # 業界カテゴリ・ステータス定数
└── prisma/
    ├── schema.prisma
    └── seed.ts               # ESテンプレ初期データ
```

---

### UI/UXデザイン方針

- **ダークモード対応**のモダンUI（ダッシュボード風）
- **グラスモーフィズム**を活用した洗練されたカード
- **カラーパレット**: 深い紺（#0f172a） × アクセントのシアン（#06b6d4） × ゴールド（#f59e0b）
- **選考ステータスの色分け**: 未応募(グレー) → ES(青) → 面接(紫) → 内定(ゴールド) → 不合格(赤)
- **マイクロアニメーション**: ホバーエフェクト、トランジション、ステータス変更時のアニメーション
- **レスポンシブ**: モバイルでもTodo・カレンダー確認可能

---

## Open Questions

> [!IMPORTANT]
> ### Q1. プロジェクトの配置場所
> `/Users/kyoma/就活/shukatsu-hub/` にプロジェクトを作成する想定です。別のパスが良ければ教えてください。

> [!IMPORTANT]
> ### Q2. ESテンプレの初期データ
> 既存の `インターン_ES_業界別テンプレ.md` と `面接_ES想定質問_回答集.md` のデータをseedとしてDBに投入しますか? それとも最小限のサンプルデータのみにしますか?

> [!IMPORTANT]
> ### Q3. 認証の有無（Phase 1）
> MVP段階ではログイン不要（ローカル利用前提）で進めて良いですか? Phase 2でGoogle OAuth認証を追加する想定です。

> [!NOTE]
> ### Q4. 企業カテゴリ
> 既存の10カテゴリ（玩具エンタメ / IT / SIer / シンクタンク / 電機精密 / 自動車 / 素材化学 / 重工インフラ / 半導体電子部品 / 通信インフラ）をそのまま使います。追加・変更があれば教えてください。

---

## Verification Plan

### 自動テスト
- `npm run build` でビルドエラーがないことを確認
- API routes の動作確認（curl / ブラウザ）
- Prisma マイグレーションの正常実行

### 手動検証（ブラウザ）
- 各ページの表示・ナビゲーション確認
- 企業の登録→選考ステータス変更→カレンダー反映の一連フロー
- Todo の作成→完了→削除
- ESテンプレの業界フィルター
- レスポンシブ対応（ブラウザリサイズ）
