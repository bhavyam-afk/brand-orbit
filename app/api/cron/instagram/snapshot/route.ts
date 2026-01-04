import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    // 🔒 Protect cron
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1️⃣ Get all connected Instagram accounts
    const accounts = await prisma.creatorSocialAccount.findMany({
        where: {
            platform: "INSTAGRAM",
            connected: true,
            igAccountId: { not: null },
            accessToken: { not: undefined },
        },
    });

    const results = [];

    for (const account of accounts) {
        try {
            const igId = account.igAccountId!;
            const token = account.accessToken;

            // 2️⃣ Fetch IG profile
            const profileRes = await fetch(
                `https://graph.facebook.com/v19.0/${igId}?fields=username,followers_count,media_count&access_token=${token}`
            );
            const profile = await profileRes.json();

            // 3️⃣ Fetch insights (✅ VALID METRICS ONLY)
            const dailyMetrics = [
                "reach",
                "impressions",
            ].join(",");

            const dailyRes = await fetch(
                `https://graph.facebook.com/v19.0/${igId}/insights` +
                `?metric=${dailyMetrics}` +
                `&period=day` +
                `&access_token=${token}`
            );

            const dailyInsights = await dailyRes.json();

            if (dailyInsights?.error) {
                throw new Error(dailyInsights.error.message);
            }

            const totalMetrics = [
                "accounts_engaged",
                "profile_views",
            ].join(",");

            const totalRes = await fetch(
                `https://graph.facebook.com/v19.0/${igId}/insights` +
                `?metric=${totalMetrics}` +
                `&metric_type=total_value` +
                `&period=day` +
                `&access_token=${token}`
            );

            const totalInsights = await totalRes.json();

            if (totalInsights?.error) {
                throw new Error(
                    `Insights API error: ${totalInsights.error.message}`
                );
            }

            // 4️⃣ Store raw snapshot
            await prisma.creatorSocialRawSnapshot.create({
                data: {
                    creatorId: account.creatorId,
                    platform: "INSTAGRAM",
                    rawData: {
                        profile,
                        insights: {
                            daily: dailyInsights,
                            total: totalInsights,
                        },
                    },
                },
            });


            results.push({ creatorId: account.creatorId, status: "success" });
        } catch (err: any) {
            console.error("❌ Snapshot failed for:", {
                creatorId: account.creatorId,
                igAccountId: account.igAccountId,
                message: err?.message,
                raw: err,
            });

            results.push({ creatorId: account.creatorId, status: "failed" });
        }

    }

    return NextResponse.json({
        processed: accounts.length,
        results,
    });
}
