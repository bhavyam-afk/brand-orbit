"use client";

import { useEffect, useState } from "react";
import { Deal, DealStatus } from "./types";
import { set } from "mongoose";

export function useDeals() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [acceptingIds, setAcceptingIds] = useState<string[]>([]);

    useEffect(() => {
        const username = window.location.pathname.split("/")[2];
        if (!username) return;

        let mounted = true;

        async function fetchDeals() {
            try {
                const res = await fetch(`/api/influencer/${username}/collaborations`, { cache: "no-store" });
                const data = await res.json();
                if (mounted) setDeals(Array.isArray(data?.collaborations) ? data.collaborations : []);
                setRequests(Array.isArray(data?.requests) ? data.requests : []);
            } catch {
                if (mounted) setDeals([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchDeals();

        return () => {
            mounted = false;
        };
    }, []);

    // allow callers to force a reload from server
    async function reloadDeals() {
        const username = window.location.pathname.split("/")[2];
        if (!username) return;
        try {
            const res = await fetch(`/api/influencer/${username}/collaborations`, { cache: "no-store" });
            const data = await res.json();
            setDeals(Array.isArray(data?.collaborations) ? data.collaborations : []);
        } catch (err) {
            console.error('reloadDeals failed', err);
        }
    }

    async function acceptDeal(dealId: string) {
        const username = window.location.pathname.split("/")[2];
        if (!username) return;

        setAcceptingIds(prev => [...prev, dealId]);

        try {
            const res = await fetch(
                `/api/influencer/${username}/collaborations/${dealId}/accept`,
                { method: "POST" }
            );
            const data = await res.json();
            const updated = data.collaboration ?? data;

            setDeals(prev =>
                prev.map(d =>
                    d.id === dealId ? { ...d, collabstatus: updated.collabstatus } : d
                )
            );
        } finally {
            setAcceptingIds(prev => prev.filter(id => id !== dealId));
        }
    }

    return { deals, setDeals, loading, acceptDeal, acceptingIds, reloadDeals, requests, setRequests };
}
