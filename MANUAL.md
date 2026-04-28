# ShuKATSU Hub — 学習マニュアル

このマニュアルでは、このプロジェクトで使われている技術・概念を一つずつ解説します。
コードを読みながらこのマニュアルを参照することで、各技術の理解が深まります。

---

## 目次

1. [プロジェクト構成の全体像](#1-プロジェクト構成の全体像)
2. [TypeScript 基礎](#2-typescript-基礎)
3. [React 基礎](#3-react-基礎)
4. [Next.js App Router](#4-nextjs-app-router)
5. [CSS設計 — デザインシステム](#5-css設計--デザインシステム)
6. [Prisma & データベース](#6-prisma--データベース)
7. [API設計 (REST)](#7-api設計-rest)
8. [状態管理とデータフェッチ](#8-状態管理とデータフェッチ)
9. [セットアップ手順](#9-セットアップ手順)

---

## 1. プロジェクト構成の全体像

```
shukatsu-hub/
├── src/
│   ├── app/                  # ページとAPIルート (Next.js App Router)
│   │   ├── layout.tsx        # 全ページ共通のレイアウト (Sidebar等)
│   │   ├── page.tsx          # / (ダッシュボード)
│   │   ├── globals.css       # デザインシステム (CSS変数)
│   │   ├── companies/        # /companies ページ群
│   │   ├── calendar/         # /calendar ページ
│   │   ├── todos/            # /todos ページ
│   │   ├── templates/        # /templates ページ
│   │   └── api/              # バックエンドAPI (サーバーサイド)
│   ├── components/           # 再利用可能なUIコンポーネント
│   └── lib/                  # ユーティリティ・定数・DB接続
├── prisma/
│   ├── schema.prisma         # データベースの設計図
│   └── seed.ts               # 初期データ投入スクリプト
├── package.json              # プロジェクトの依存関係
└── tsconfig.json             # TypeScript設定
```

### なぜこの構成?

- **関心の分離 (Separation of Concerns)**: UI(components) / ページ(app) / ロジック(lib) / データ(prisma) を分ける
- **コロケーション**: 関連するファイルを近くに配置 (例: companiesページとcompanies API)
- **スケーラビリティ**: 機能が増えてもディレクトリを追加するだけで拡張可能

---

## 2. TypeScript 基礎

### なぜ TypeScript?

JavaScriptに「型」を追加した言語。バグを事前に防げる。

```typescript
// JavaScript — 実行するまでエラーがわからない
function greet(name) {
  return name.toUpperCase(); // nameが数値だったら? → 実行時エラー
}

// TypeScript — 書いた瞬間にエラーがわかる
function greet(name: string): string {
  return name.toUpperCase(); // nameは必ずstring → 安全
}
```

### このプロジェクトで使う主な型機能

```typescript
// 1. インターフェース — データの形を定義
interface Company {
  id: string;
  name: string;
  industry: string;
  status: "INTERESTED" | "APPLIED" | "IN_PROGRESS"; // ユニオン型 = 許可される値を限定
}

// 2. ジェネリクス — 型を引数のように渡す
// useState<Company[]> は「Companyの配列を状態として持つ」という意味
const [companies, setCompanies] = useState<Company[]>([]);

// 3. 型エイリアス — よく使う型に名前をつける
type SelectionStage = "ES" | "WEBTEST" | "GD" | "INTERVIEW_1" | "FINAL";
```

---

## 3. React 基礎

### コンポーネント = 再利用可能なUIの部品

```tsx
// 関数コンポーネント: JSX(HTMLっぽい構文)を返す関数
function StatsCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="stats-card">
      <span className="stats-icon">{icon}</span>
      <h3>{title}</h3>
      <p className="stats-value">{value}</p>
    </div>
  );
}

// 使い方
<StatsCard title="選考中" value={5} icon="📋" />
```

### useState — 状態管理

```tsx
// 状態(state) = 変わりうるデータ。変更するとUIが自動で再描画される
const [count, setCount] = useState(0);

// NG: 直接変更してもUIは更新されない
count = 5;

// OK: setterを使うとReactがUIを更新してくれる
setCount(5);
```

### useEffect — 副作用 (データ取得など)

```tsx
// コンポーネントが画面に表示された時にAPIからデータを取得
useEffect(() => {
  fetch('/api/companies')
    .then(res => res.json())
    .then(data => setCompanies(data));
}, []); // [] = マウント時に1回だけ実行
```

### Props vs State

- **Props**: 親コンポーネントから渡されるデータ (読み取り専用)
- **State**: コンポーネント自身が管理するデータ (変更可能)

---

## 4. Next.js App Router

### ファイルベースルーティング

ファイルの配置場所がそのままURLになる:

```
src/app/page.tsx              → /
src/app/companies/page.tsx    → /companies
src/app/companies/[id]/page.tsx → /companies/abc123  (動的ルート)
src/app/api/companies/route.ts → /api/companies      (APIエンドポイント)
```

### Server Components vs Client Components

Next.js 14の最も重要な概念:

```tsx
// Server Component (デフォルト) — サーバーで実行される
// メリット: DBに直接アクセス可能、初期表示が速い
// 制限: useState, onClickなどブラウザ機能は使えない
export default async function CompaniesPage() {
  const companies = await prisma.company.findMany(); // サーバーでDB直接アクセス!
  return <CompanyList companies={companies} />;
}

// Client Component — ブラウザで実行される
// 先頭に 'use client' を書く
'use client';
export default function CompanyForm() {
  const [name, setName] = useState(''); // ブラウザの機能(state)を使える
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
```

### いつどちらを使う?

| 場面 | 種類 | 理由 |
|------|------|------|
| データ表示するだけ | Server | DBに直接アクセスできて速い |
| フォーム・入力がある | Client | ユーザー入力にはstateが必要 |
| クリックイベント | Client | onClick等はブラウザの機能 |
| API呼び出し不要 | Server | サーバーで完結できる |

### layout.tsx — 共通レイアウト

```tsx
// src/app/layout.tsx
// 全ページで共通のサイドバー・ヘッダーを定義
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Sidebar />
        <main>{children}</main>  {/* ← ここに各ページの中身が入る */}
      </body>
    </html>
  );
}
```

### API Routes (Route Handlers)

```typescript
// src/app/api/companies/route.ts
import { NextResponse } from 'next/server';

// GET /api/companies — 企業一覧を返す
export async function GET() {
  const companies = await prisma.company.findMany();
  return NextResponse.json(companies);
}

// POST /api/companies — 新規企業を作成
export async function POST(request: Request) {
  const body = await request.json();
  const company = await prisma.company.create({ data: body });
  return NextResponse.json(company, { status: 201 });
}
```

---

## 5. CSS設計 — デザインシステム

### CSS変数 (Custom Properties)

色やサイズを変数として定義し、一箇所で管理する:

```css
:root {
  /* 変更はここだけ → 全体に反映 */
  --color-primary: #06b6d4;
  --color-bg: #0f172a;
  --radius-md: 12px;
}

.card {
  background: var(--color-bg);      /* 変数を参照 */
  border-radius: var(--radius-md);
}
```

### グラスモーフィズム

ガラスのような透明感のあるデザイン:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);  /* 半透明の背景 */
  backdrop-filter: blur(10px);              /* 背後をぼかす */
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### CSS Grid vs Flexbox

```css
/* Grid = 2次元レイアウト (行と列) */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Flexbox = 1次元レイアウト (横並びor縦並び) */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

---

## 6. Prisma & データベース

### Prisma とは?

データベースを TypeScript のコードで操作できるツール (ORM):

```
[あなたのコード] → [Prisma] → [SQLに変換] → [SQLiteデータベース]
```

### スキーマ定義 (schema.prisma)

```prisma
// データベースのテーブル設計 = modelで定義
model Company {
  id        String   @id @default(cuid())  // 主キー (自動生成)
  name      String                          // 企業名
  industry  String                          // 業界
  status    String   @default("INTERESTED") // デフォルト値あり

  events    Event[]  // 1対多のリレーション (1企業 → 複数イベント)
  todos     Todo[]
}

model Event {
  id        String   @id @default(cuid())
  title     String
  companyId String?                         // 外部キー (nullable)
  company   Company? @relation(...)         // リレーション定義
}
```

### CRUD操作

```typescript
// Create (作成)
const company = await prisma.company.create({
  data: { name: 'バンダイ', industry: '玩具エンタメ' }
});

// Read (読み取り) — 全件
const companies = await prisma.company.findMany();

// Read — 条件付き
const toyCompanies = await prisma.company.findMany({
  where: { industry: '玩具エンタメ' }
});

// Read — リレーション含む
const companyWithEvents = await prisma.company.findUnique({
  where: { id: 'xxx' },
  include: { events: true, todos: true }  // 関連データも一緒に取得
});

// Update (更新)
await prisma.company.update({
  where: { id: 'xxx' },
  data: { status: 'APPLIED' }
});

// Delete (削除)
await prisma.company.delete({ where: { id: 'xxx' } });
```

### マイグレーション

スキーマを変更したらマイグレーションを実行:

```bash
npx prisma migrate dev --name init   # スキーマ変更をDBに反映
npx prisma generate                   # TypeScript型を再生成
npx prisma studio                     # ブラウザでDBを閲覧 (便利!)
```

---

## 7. API設計 (REST)

### RESTとは?

URLでリソース(企業、Todo等)を表し、HTTPメソッドで操作を分ける:

| メソッド | URL | 操作 | 例 |
|----------|-----|------|-----|
| GET | /api/companies | 一覧取得 | 全企業を取得 |
| POST | /api/companies | 新規作成 | 企業を登録 |
| GET | /api/companies/[id] | 個別取得 | 特定の企業を取得 |
| PUT | /api/companies/[id] | 更新 | 企業情報を更新 |
| DELETE | /api/companies/[id] | 削除 | 企業を削除 |

### HTTPステータスコード

| コード | 意味 | 使う場面 |
|--------|------|---------|
| 200 | OK | 成功 (GET, PUT) |
| 201 | Created | 新規作成成功 (POST) |
| 400 | Bad Request | リクエストが不正 |
| 404 | Not Found | リソースが見つからない |
| 500 | Internal Server Error | サーバーエラー |

---

## 8. 状態管理とデータフェッチ

### フェッチのパターン

```tsx
'use client';

function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/companies');
        const data = await res.json();
        setCompanies(data);
      } catch (error) {
        console.error('取得に失敗:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div>
      {companies.map(c => (
        <CompanyCard key={c.id} company={c} />
      ))}
    </div>
  );
}
```

### データの流れ

```
[ユーザー操作]
    ↓
[Client Component] → fetch('/api/companies', { method: 'POST', body: ... })
    ↓
[API Route (route.ts)] → prisma.company.create(...)
    ↓
[SQLite Database]
    ↓ (レスポンス)
[Client Component] → setState → UIが再描画
```

---

## 9. セットアップ手順

以下のコマンドを順に実行してください:

```bash
# 1. shukatsu-hubディレクトリに移動
cd /Users/kyoma/就活/shukatsu-hub

# 2. Prismaインストール (未実行の場合)
npm install prisma @prisma/client

# 3. Prisma初期化
npx prisma init --datasource-provider sqlite

# 4. スキーマ反映 & マイグレーション
npx prisma migrate dev --name init

# 5. 初期データ投入
npx prisma db seed

# 6. 開発サーバー起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
```

### 便利なコマンド

```bash
npx prisma studio        # DBをブラウザで閲覧・編集
npx prisma migrate reset  # DBをリセット (全データ削除)
npm run build             # 本番ビルド (エラーチェック)
```

---

## 発展的な学習リソース

| トピック | リソース |
|----------|---------|
| TypeScript | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) |
| React | [React公式チュートリアル](https://react.dev/learn) |
| Next.js | [Next.js Learn](https://nextjs.org/learn) |
| Prisma | [Prisma Docs](https://www.prisma.io/docs) |
| CSS | [MDN CSS](https://developer.mozilla.org/ja/docs/Web/CSS) |
| REST API | [RESTful API設計ガイド](https://restfulapi.net/) |
