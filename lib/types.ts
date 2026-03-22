// ============================================================
// Types for Charoku app
// ============================================================

export interface ZenPhrase {
  name: string;
  reading: string;
  month: number; // 0-11 for months, 12 for 通年
  type: "禅語" | "銘" | "前後(禅語)" | "その他";
  meaning: string;
  custom?: boolean;
  id?: number;
  source?: string;
  learnedAt?: string;
  usedDates?: UsageRecord[];
  createdAt?: string;
}

export interface UsageRecord {
  date: string;
  note: string;
}

export interface VideoBookmark {
  id: number;
  url: string;
  title: string;
  category: string;
  memo: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
}

export interface AiExplanation {
  interpretation?: string;
  history?: string;
  tea_connection?: string;
  season_relation?: string;
  error?: string;
}

export type TabId = "home" | "video" | "zen" | "fav";
export type ZenTypeFilter = "all" | "禅語" | "銘";
export type ZenSourceFilter = "all" | "builtin" | "custom";
export type VideoCategoryFilter = "all" | string;
