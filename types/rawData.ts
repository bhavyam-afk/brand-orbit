// types/rawData.ts

/* -----------------------------
   PROFILE
------------------------------ */
export interface InstagramProfileRaw {
  id: string
  username: string
  media_count: number
  followers_count: number
}

/* -----------------------------
   DAILY INSIGHTS (period=day)
------------------------------ */
export interface InstagramDailyInsightValue {
  value: number
  end_time: string
}

export interface InstagramDailyInsightMetric {
  id: string
  name: "reach" | "follower_count"
  title: string
  period: "day"
  values: InstagramDailyInsightValue[]
  description?: string
}

export interface InstagramDailyInsightsRaw {
  data: InstagramDailyInsightMetric[]
  paging?: {
    next?: string
    previous?: string
  }
}

/* -----------------------------
   TOTAL INSIGHTS (metric_type=total_value)
------------------------------ */
export interface InstagramTotalInsightMetric {
  id: string
  name:
    | "accounts_engaged"
    | "profile_views"
    | "total_interactions"
    | "likes"
    | "comments"
    | "shares"
    | "saves"
    | "replies"
  title: string
  period: "day"
  description?: string
  total_value: {
    value: number
  }
}

export interface InstagramTotalInsightsRaw {
  data: InstagramTotalInsightMetric[]
  paging?: {
    next?: string
    previous?: string
  }
}

/* -----------------------------
   RAW SNAPSHOT DATA (DB COLUMN)
------------------------------ */
export interface InstagramRawData {
  profile: InstagramProfileRaw
  insights: {
    daily: InstagramDailyInsightsRaw
    total: InstagramTotalInsightsRaw
  }
}
