// components/brand/Profile/useBrandProfile.ts

"use client";

import { useEffect, useState } from "react";
import { BrandProfile } from "./types";

export function useBrandProfile() {
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsernameFromPath = (): string | null => {
      if (typeof window === "undefined") return null;
      const parts = window.location.pathname.split("/").filter(Boolean);
      const brandIndex = parts.indexOf("brand");
      if (brandIndex !== -1 && parts[brandIndex + 1]) {
        return decodeURIComponent(parts[brandIndex + 1]);
      }
      return null;
    };

    const username = getUsernameFromPath();

    if (!username) {
      setError("No username provided for brand profile");
      setLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await fetch(`/api/brand2/${username}/profile`);
        if (!res.ok) throw new Error("Failed to fetch brand profile");

        const data = await res.json();
        setProfile(data);
        setCollaborations(data?.collaborations ?? []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return {
    profile,
    collaborations,
    loading,
    error,
  };
}
