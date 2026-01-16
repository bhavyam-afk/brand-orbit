import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { InstagramRawData } from "@/types/rawData";

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

// normalize date → midnight UTC
function normalizeDate(d = new Date()) {
  const n = new Date(d);
  n.setUTCHours(0, 0, 0, 0);
  return n;
}

function getDailyMetric(
  data: InstagramRawData["insights"]["daily"]["data"],
  name: "reach" | "follower_count"
): number {
  const metric = data.find(m => m.name === name);
  if (!metric || !metric.values?.length) return 0;
  return Number(metric.values[0].value ?? 0);
}

function getTotalMetric(
  data: InstagramRawData["insights"]["total"]["data"],
  name:
    | "accounts_engaged"
    | "profile_views"
    | "likes"
    | "comments"
    | "shares"
    | "saves"
    | "replies"
): number {
  const metric = data.find(m => m.name === name);
  return Number(metric?.total_value?.value ?? 0);
}

/* --------------------------------------------------
   CRON ROUTE
-------------------------------------------------- */

export async function POST(req: Request) {
  // 🔐 Protect cron
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = normalizeDate();

  // 1️⃣ Fetch ONLY snapshots created today
  const start = today;
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() + 1);

  const snapshots = await prisma.creatorSocialRawSnapshot.findMany({
    where: {
      platform: "INSTAGRAM",
      fetchedAt: {
        gte: start,
        lt: end,
      },
    },
    orderBy: {
      fetchedAt: "desc",
    },
  });

  // 2️⃣ Deduplicate → latest snapshot per creator
  const latestByCreator = new Map<string, typeof snapshots[number]>();

  for (const snap of snapshots) {
    if (!latestByCreator.has(snap.creatorId)) {
      latestByCreator.set(snap.creatorId, snap);
    }
  }

  let success = 0;
  let failed = 0;

  // 3️⃣ Aggregate
  for (const [creatorId, snapshot] of latestByCreator.entries()) {
    try {
      const raw = snapshot.rawData as unknown as InstagramRawData;

      if (!raw?.profile || !raw?.insights) {
        throw new Error("Invalid rawData shape");
      }

      /* -----------------------------
         EXTRACT METRICS
      ------------------------------ */

      const followers = Number(raw.profile.followers_count ?? 0);

      const reach = getDailyMetric(
        raw.insights.daily.data,
        "reach"
      );

      const engagements = getTotalMetric(
        raw.insights.total.data,
        "accounts_engaged"
      );

      const profileViews = getTotalMetric(
        raw.insights.total.data,
        "profile_views"
      );

      const likes = getTotalMetric(raw.insights.total.data, "likes");
      const comments = getTotalMetric(raw.insights.total.data, "comments");
      const shares = getTotalMetric(raw.insights.total.data, "shares");
      const saves = getTotalMetric(raw.insights.total.data, "saves");
      const replies = getTotalMetric(raw.insights.total.data, "replies");

      /* -----------------------------
         UPSERT DAILY ANALYTICS
      ------------------------------ */

      await prisma.creatorDailyAnalytics.upsert({
        where: {
          creatorId_date: {
            creatorId,
            date: today,
          },
        },
        update: {
          followers,
          reach,
          impressions: 0, // 🔒 locked until Meta approval
          engagements,
          likes,
          comments,
          shares,
          saves,
          replies,
          profileViews,
        },
        create: {
          creatorId,
          date: today,
          followers,
          reach,
          impressions: 0,
          engagements,
          likes,
          comments,
          shares,
          saves,
          replies,
          profileViews,
        },
      });

      success++;
    } catch (err: any) {
      failed++;

      console.error("❌ Daily analytics aggregation failed", {
        creatorId,
        snapshotId: snapshot.id,
        fetchedAt: snapshot.fetchedAt,
        error: err?.message,
      });
    }
  }

  return NextResponse.json({
    date: today.toISOString(),
    processedCreators: latestByCreator.size,
    success,
    failed,
  });
}
