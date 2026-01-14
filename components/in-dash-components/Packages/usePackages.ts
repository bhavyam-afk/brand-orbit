"use client";

import { useEffect, useState } from "react";
import { Package } from "@/types/Package";

export function usePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const username = typeof window !== "undefined" ? window.location.pathname.split("/")[2] : "";

  useEffect(() => {
    if (!username) return;

    fetch(`/api/influencer/${username}/packages`)
      .then(res => res.json())
      .then(json => setPackages(json.packages ?? []))
      .finally(() => setLoading(false));
  }, [username]);

  function openForm() {
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
  }

  async function createPackage(data: Omit<Package, "id" | "status">) {
    const activeCount = packages.filter(p => p.status === "ACTIVE").length;
    const status = activeCount >= 2 ? "DRAFT" : "ACTIVE";

    const res = await fetch(`/api/influencer/${username}/packages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, packagestatus: status }),
    });
    const json = await res.json();
    const raw = json.package ?? {};
    const normalized: Package = {
      id: raw.id,
      title: raw.title,
      description: raw.description ?? null,
      price: raw.price ?? '',
      deliveryTimeDays: raw.deliveryTimeDays ?? 0,
      thumbnailUrl: raw.thumbnailUrl ?? null,
      mediaType: raw.mediaType ?? null,
      deliverables: raw.deliverables ?? [],
      status: (raw.status ?? raw.packagestatus ?? status).toUpperCase(),
    } as Package;

    setPackages(prev => [...prev, normalized]);
    setShowForm(false);
  }

  async function updateStatus(id: string, status: Package['status']) {
    setPackages(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
    await fetch(`/api/influencer/${username}/packages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  function canActivateDraft() {
    return packages.filter(p => p.status === "ACTIVE").length < 2;
  }

  return { packages, loading, showForm, openForm, closeForm, createPackage, updateStatus, canActivateDraft };
}
