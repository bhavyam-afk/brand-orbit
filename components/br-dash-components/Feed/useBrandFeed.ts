// components/brand/Feed/useBrandFeed.ts

"use client";

import { useEffect, useState } from "react";
import { Creator, DraftInfo } from "./types";

export function useBrandFeed() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const [creatorPackages, setCreatorPackages] = useState<any[]>([]);
  const [pkgsLoading, setPkgsLoading] = useState(false);

  const [requestingPackageId, setRequestingPackageId] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestedPackageIds, setRequestedPackageIds] = useState<string[]>([]);
  const [activePackageIds] = useState<string[]>([]);
  const [draftedPackageIds] = useState<string[]>([]);
  const [draftedFilesMap] = useState<Record<string, DraftInfo>>({});
  const [selectedDraft, setSelectedDraft] = useState<DraftInfo | null>(null);

  const getBrandUsername = (): string | null => {
    if (typeof window === "undefined") return null;
    const parts = window.location.pathname.split("/").filter(Boolean);
    const brandIndex = parts.indexOf("brand");
    if (brandIndex !== -1 && parts[brandIndex + 1]) return parts[brandIndex + 1];
    if (parts.length >= 2) return parts[1];
    return null;
  };

  useEffect(() => {
    const username = getBrandUsername();
    if (!username) {
      setError("No brand username found in URL");
      setLoading(false);
      return;
    }

    fetch(`/api/brand2/${encodeURIComponent(username)}/feed`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch feed");
        return res.json();
      })
      .then((data) => {
        setCreators(Array.isArray(data?.creators) ? data.creators : []);
        setError(null);
      })
      .catch((err) => {
        setError(String(err.message || err));
        setCreators([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const openPackages = async (creator: Creator) => {
    setSelectedCreator(creator);
    setModalOpen(true);
    setPkgsLoading(true);

    try {
      const brandUsername = getBrandUsername();
      const res = await fetch(
        `/api/brand2/${brandUsername}/feed/package?creatorId=${creator.id}`
      );
      const data = await res.json().catch(() => ({}));
      setCreatorPackages(Array.isArray(data?.packages) ? data.packages : []);
    } catch {
      setCreatorPackages([]);
    } finally {
      setPkgsLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCreator(null);
    setCreatorPackages([]);
    setRequestedPackageIds([]);
    setSelectedDraft(null);
  };

  const requestPackage = async (pkg: any) => {
    if (!selectedCreator) return;
    setRequestError(null);
    setRequestingPackageId(pkg.id);

    try {
      const brandUsername = getBrandUsername();
      const res = await fetch(
        `/api/brand2/${encodeURIComponent(
          brandUsername!
        )}/collaborations/request-to-creator/package`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creatorUsername: selectedCreator.username,
            packageId: pkg.id,
          }),
        }
      );

      if (!res.ok) throw new Error("Request failed");
      setRequestedPackageIds((prev) => [...prev, String(pkg.id)]);
    } catch (err: any) {
      setRequestError(err.message || "Request failed");
    } finally {
      setRequestingPackageId(null);
    }
  };

  return {
    creators,
    loading,
    error,

    modalOpen,
    selectedCreator,
    creatorPackages,
    pkgsLoading,

    requestingPackageId,
    requestError,
    requestedPackageIds,
    activePackageIds,
    draftedPackageIds,
    draftedFilesMap,
    selectedDraft,

    openPackages,
    closeModal,
    requestPackage,
    setSelectedDraft,
  };
}
