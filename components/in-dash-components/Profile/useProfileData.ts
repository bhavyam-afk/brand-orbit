"use client";
import { useEffect, useState } from "react";
import ProfileData from "@/types/ProfileData";
import { normalizeCollaborations, buildLastFiveMonths, normalizeTransactions } from "./profile.utils";

export function useProfileData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ProfileData | null>(null);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [earningsMonths, setEarningsMonths] = useState<string[]>([]);
  const [earningsTotals, setEarningsTotals] = useState<number[]>([]);
  const [followersTotals, setFollowersTotals] = useState<number[]>([]);

  useEffect(() => {
    const username = window.location.pathname.split("/")[2];
    if (!username) return;

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/influencer/${username}/profile`);
        const profileData = await res.json();
        setData(profileData);

        // collaborations
        const normalized = normalizeCollaborations(profileData.collaborations);
        setCollaborations(normalized);

        // months
        const months = buildLastFiveMonths();
        setEarningsMonths(months);

        // earnings
        const txs = normalizeTransactions(profileData.incomingTransactions);
        const earnings = months.map((m: any) =>
          txs.reduce((sum: Number, tx: any) => {
            if (tx.type === "PAYOUT" && tx.status === "COMPLETED" && tx.month === m) {
              return sum + tx.amount;
            }
            return sum;
          }, 0)
        );
        setEarningsTotals(earnings as number[]);

        // followers
        const snapRes = await fetch(`/api/influencer/${username}/followers`);
        const snapJson = await snapRes.json();
        const snapshots = snapJson.snapshots || [];

        const followerTotals = months.map((m) =>
          snapshots.reduce((sum: number, s: any) => {
            const sm = new Date(s.recordedAt).toLocaleString("default", { month: "short" });
            return sm === m ? sum + Number(s.followers_increased || 0) : sum;
          }, 0)
        );
        setFollowersTotals(followerTotals);
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return { loading, data, collaborations, earningsMonths, earningsTotals, followersTotals };
}
