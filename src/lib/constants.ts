// ===== 業界カテゴリ =====
export const INDUSTRIES = [
  { value: '玩具エンタメ', label: '🎮 玩具・エンタメ', color: '#f472b6' },
  { value: 'IT', label: '🖥️ IT・メガベンチャー', color: '#60a5fa' },
  { value: 'SIer', label: '🏢 SIer', color: '#34d399' },
  { value: 'シンクタンク', label: '🔬 シンクタンク', color: '#a78bfa' },
  { value: '電機精密', label: '⚡ 電機・精密機器', color: '#fbbf24' },
  { value: '自動車', label: '🚗 自動車・輸送機器', color: '#f87171' },
  { value: '素材化学', label: '🧪 素材・化学', color: '#2dd4bf' },
  { value: '重工インフラ', label: '🏭 重工・インフラ', color: '#fb923c' },
  { value: '半導体電子部品', label: '🔌 半導体・電子部品', color: '#818cf8' },
  { value: '通信インフラ', label: '📡 通信・インフラ', color: '#4ade80' },
] as const;

// ===== 企業ステータス =====
export const COMPANY_STATUSES = [
  { value: 'INTERESTED', label: '興味あり', color: '#94a3b8', icon: '👀' },
  { value: 'APPLIED', label: '応募済み', color: '#60a5fa', icon: '📝' },
  { value: 'IN_PROGRESS', label: '選考中', color: '#a78bfa', icon: '🔄' },
  { value: 'OFFERED', label: '内定', color: '#fbbf24', icon: '🎉' },
  { value: 'REJECTED', label: '不合格', color: '#f87171', icon: '❌' },
  { value: 'WITHDRAWN', label: '辞退', color: '#6b7280', icon: '🚪' },
] as const;

// ===== 選考ステージ =====
export const SELECTION_STAGES = [
  { value: 'ES', label: 'ES提出', order: 1 },
  { value: 'WEBTEST', label: 'Webテスト', order: 2 },
  { value: 'GD', label: 'GD', order: 3 },
  { value: 'INTERVIEW_1', label: '一次面接', order: 4 },
  { value: 'INTERVIEW_2', label: '二次面接', order: 5 },
  { value: 'FINAL', label: '最終面接', order: 6 },
  { value: 'OFFER', label: '内定', order: 7 },
] as const;

// ===== 選考ステータス =====
export const SELECTION_STATUSES = [
  { value: 'PENDING', label: '未実施', color: '#94a3b8' },
  { value: 'SCHEDULED', label: '予定あり', color: '#60a5fa' },
  { value: 'PASSED', label: '通過', color: '#34d399' },
  { value: 'FAILED', label: '不通過', color: '#f87171' },
] as const;

// ===== イベントタイプ =====
export const EVENT_TYPES = [
  { value: 'DEADLINE', label: '締切', color: '#f87171', icon: '⏰' },
  { value: 'INTERVIEW', label: '面接', color: '#a78bfa', icon: '🎤' },
  { value: 'SEMINAR', label: '説明会', color: '#60a5fa', icon: '📢' },
  { value: 'OTHER', label: 'その他', color: '#94a3b8', icon: '📌' },
] as const;

// ===== Todo優先度 =====
export const TODO_PRIORITIES = [
  { value: 'HIGH', label: '高', color: '#f87171', icon: '🔴' },
  { value: 'MEDIUM', label: '中', color: '#fbbf24', icon: '🟡' },
  { value: 'LOW', label: '低', color: '#34d399', icon: '🟢' },
] as const;

// ===== ESテンプレタイプ =====
export const ES_TEMPLATE_TYPES = [
  { value: 'MOTIVATION', label: '志望動機' },
  { value: 'SELF_PR', label: '自己PR' },
  { value: 'GAKUCHIKA', label: 'ガクチカ' },
  { value: 'RESEARCH', label: '研究内容' },
  { value: 'OTHER', label: 'その他' },
] as const;

// ヘルパー関数
export function getIndustryColor(industry: string): string {
  return INDUSTRIES.find(i => i.value === industry)?.color ?? '#94a3b8';
}

export function getStatusInfo(status: string) {
  return COMPANY_STATUSES.find(s => s.value === status) ?? COMPANY_STATUSES[0];
}
