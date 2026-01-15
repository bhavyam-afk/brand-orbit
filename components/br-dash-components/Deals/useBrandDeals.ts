"use client";

import { useEffect, useState } from "react";
import { CollabStatus } from "@prisma/client";

export function useBrandDeals(username?: string) {
  const [collabs, setCollabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const fetchCollabs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/brand2/${username}/collaborations`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch collaborations");
        const data = await res.json();
        setCollabs(Array.isArray(data) ? data : data.collaborations ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollabs();
  }, [username]);

  const byStatus = (status: CollabStatus) => collabs.filter(c => c.collabstatus === status);

  return { collabs, loading, error, active: byStatus("ACTIVE"), pending: byStatus("PENDING"), completed: byStatus("COMPLETED"), setCollabs };
}
