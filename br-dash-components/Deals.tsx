"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BrandProfile,
  Campaign,
  CampaignCollaboration,
  CollabStatus,
  CollabType,
  CreatorProfile,
  Package,
  PackageCollaboration,
} from "@prisma/client";
import { ContentDraft } from "@/types/contentDraft";

type Collab = {
  id: string;
  brandId: string;
  collabType: CollabType;
  collabstatus: CollabStatus;
  createdAt: string;
  updatedAt?: string;
  creatorId: string;
  packageId?: string;
  campaignId?: string;
  brand?: BrandProfile;
  creator?: CreatorProfile;
  campaignCollaborations?: CampaignCollaboration[];
  packageCollaborations?: PackageCollaboration[];
  package?: Package;
  campaign?: Campaign;
};

const Deals = () => {
  const params = useParams() as { username?: string };
  const username = params?.username;
  const [collabs, setCollabs] = useState<Collab[]>([]);
  const [filter, setFilter] = useState<
    "all" | "active" | "pending" | "completed"
  >("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDraftDeal, setSelectedDraftDeal] = useState<Collab | null>(
    null
  );
  const [approvingIds, setApprovingIds] = useState<string[]>([]);
  const [improviseMessage, setImproviseMessage] = useState<string>("");
  const [improviseSubmittingId, setImproviseSubmittingId] = useState<
    string | null
  >(null);
  const [payingIds, setPayingIds] = useState<string[]>([]);

  useEffect(() => {
    if (!username) return;

    const fetchCollabs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/brand2/${username}/collaborations`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
        const data = await res.json();
        const list = Array.isArray(data)
          ? data
          : data.collaborations ?? data.collabs ?? data;
        setCollabs(Array.isArray(list) ? list : []);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load collaborations");
      } finally {
        setLoading(false);
      }
    };

    fetchCollabs();
  }, []);

  const setFilterTo = (status: "all" | "active" | "pending" | "completed") =>
    setFilter(status);
  const byStatus = (s: string) =>
    collabs.filter(
      (c) => String(c.collabstatus ?? "").toLowerCase() === s.toLowerCase()
    );
  const activeCollabs = byStatus("active");
  const pendingCollabs = byStatus("pending");
  const completedCollabs = byStatus("completed");

  const filtered =
    filter === "all"
      ? collabs
      : filter === "active"
        ? activeCollabs
        : filter === "pending"
          ? pendingCollabs
          : completedCollabs;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setFilterTo("all")}
          style={{
            background: filter === "all" ? "#94a3b8" : "#e5e7eb",
            padding: "6px 12px",
            borderRadius: 6,
          }}
        >
          All ({collabs.length})
        </button>
        <button
          onClick={() => setFilterTo("active")}
          style={{
            background: filter === "active" ? "#0ea5e9" : "#e5e7eb",
            padding: "6px 12px",
            borderRadius: 6,
          }}
        >
          Active ({activeCollabs.length})
        </button>
        <button
          onClick={() => setFilterTo("pending")}
          style={{
            background: filter === "pending" ? "#f59e0b" : "#e5e7eb",
            padding: "6px 12px",
            borderRadius: 6,
          }}
        >
          Pending ({pendingCollabs.length})
        </button>
        <button
          onClick={() => setFilterTo("completed")}
          style={{
            background: filter === "completed" ? "#10b981" : "#e5e7eb",
            padding: "6px 12px",
            borderRadius: 6,
          }}
        >
          Completed ({completedCollabs.length})
        </button>
      </div>

      {loading && <div>Loading collaborations…</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div>No collaborations found.</div>
      )}

      {filter === "all" ? (
        <div>
          <h4 style={{ marginTop: 8 }}>Active</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {activeCollabs.length !== 0 ? (activeCollabs.map((c) => (
              <li
                key={c.id ?? JSON.stringify(c)}
                style={{
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {c.package?.title ?? "Untitled Package"}
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  Status: {String(c.collabstatus)}
                </div>
                {c.creator?.username && (
                  <div style={{ fontSize: 13, color: "#555" }}>
                    Creator: {c.creator.username}
                  </div>
                )}
                {c.packageCollaborations?.[0]?.brandFeedback && (
                  <div
                    style={{
                      fontSize: 13,
                      color:
                        c.collabstatus === "PENDING" ? "#b7791f" : "#10b981",
                      fontWeight: 600,
                    }}
                  >
                    {c.collabstatus === "PENDING" ? `Improvements: ${c.packageCollaborations[0].brandFeedback}` : `Brand: ${c.packageCollaborations[0].brandFeedback}`}
                  </div>
                )}
                {/* show if creator has uploaded a draft for this collaboration */}
                {c.packageCollaborations?.[0]?.contentDraft &&
                  ((c.packageCollaborations[0].contentDraft as ContentDraft)
                    ?.fileUrls?.length ||
                    c.packageCollaborations[0]?.draftSubmittedAt) && (
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: "#b7791f",
                          fontWeight: 600,
                        }}
                      >
                        Draft uploaded
                      </div>
                      <button
                        onClick={() => setSelectedDraftDeal(c)}
                        className="px-2 py-1 rounded bg-[#7b52d3] text-white text-xs"
                      >
                        View Draft
                      </button>
                    </div>
                  )}
                {/* show published url if creator saved it */}
                {c.packageCollaborations?.[0]?.publishedContentUrl && (
                  <div style={{ marginTop: 6 }}>
                    <a
                      href={c.packageCollaborations[0].publishedContentUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#7b52d3", fontWeight: 600 }}
                    >
                      Published:{" "}
                      {String(
                        c.packageCollaborations[0].publishedContentUrl
                      ).slice(0, 40)}
                      {String(c.packageCollaborations[0].publishedContentUrl)
                        .length > 40
                        ? "…"
                        : ""}
                    </a>
                  </div>
                )}

                {/* PAY button for active collabs (placeholder for Razorpay integration) */}
                {String(c.collabstatus).toLowerCase() === "active" && (
                  <div style={{ marginTop: 8 }}>
                    <button
                      onClick={async () => {
                        const id = c.id ?? "";
                        if (!id) return alert("Invalid collaboration id");
                        if (!username) return alert("Brand username not found");
                        setPayingIds((prev) => [...prev, id]);
                        try {
                          // Placeholder: call backend to create payment / initiate Razorpay flow
                          const res = await fetch(
                            `/api/brand2/${encodeURIComponent(username)}/collaborations/${encodeURIComponent(id)}/paycreator`,
                            { method: "POST" }
                          );
                          if (!res.ok) {
                            const d = await res.json().catch(() => ({}));
                            throw new Error(
                              d?.error || res.statusText || "Pay request failed"
                            );
                          }
                          const data = await res.json().catch(() => ({}));
                          // downstream: user will implement Razorpay flow using response
                          alert(
                            data?.message ??
                            "Payment initiation request sent — implement Razorpay flow"
                          );
                        } catch (err) {
                          console.error("Pay error", err);
                          alert(String((err as any)?.message || err));
                        } finally {
                          setPayingIds((prev) => prev.filter((x) => x !== id));
                        }
                      }}
                      disabled={payingIds.includes(String(c.id ?? ""))}
                      className="px-3 py-1 rounded bg-[#06b6d4] text-white text-sm"
                    >
                      {payingIds.includes(String(c.id ?? ""))
                        ? "Processing…"
                        : "PAY"}
                    </button>
                  </div>
                )}
              </li>
            ))) : <div style={{ padding: 12, color: "#555" }}>No active collaborations.</div>}
          </ul>

          <h4 style={{ marginTop: 12 }}>Pending</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {pendingCollabs.length !== 0 ? (pendingCollabs.map((c) => (
              <li
                key={c.id ?? JSON.stringify(c)}
                style={{
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {c.package?.title ?? "Untitled Collaboration"}
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  Status: {String(c.collabstatus)}
                </div>
                {c.creator?.username && (
                  <div style={{ fontSize: 13, color: "#555" }}>
                    Creator: {c.creator.username}
                  </div>
                )}
                {c.packageCollaborations?.[0]?.brandFeedback && (
                  <div
                    style={{
                      fontSize: 13,
                      color:
                        c.collabstatus === "PENDING" ? "#b7791f" : "#10b981",
                      fontWeight: 600,
                    }}
                  >
                    {c.collabstatus === "PENDING"
                      ? `Improvements: ${c.packageCollaborations[0].brandFeedback}`
                      : `Brand: ${c.packageCollaborations[0].brandFeedback}`}
                  </div>
                )}
              </li>
            ))) : <div style={{ padding: 12, color: "#555" }}>No pending collaborations.</div>}
          </ul>

          <h4 style={{ marginTop: 12 }}>Completed</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {completedCollabs.length !==0 ? (completedCollabs.map((c) => (
              <li
                key={c.id ?? JSON.stringify(c)}
                style={{
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 6,
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {c.package?.title ?? "Untitled Collaboration"}
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  Status: {String(c.collabstatus)}
                </div>
                {c.creator?.username && (
                  <div style={{ fontSize: 13, color: "#555" }}>
                    Creator: {c.creator.username}
                  </div>
                )}
                {c.packageCollaborations?.[0]?.brandFeedback && (
                  <div
                    style={{
                      fontSize: 13,
                      color:
                        c.collabstatus === "PENDING" ? "#b7791f" : "#10b981",
                      fontWeight: 600,
                    }}
                  >
                    {c.collabstatus === "PENDING"
                      ? `Improvements: ${c.packageCollaborations[0].brandFeedback}`
                      : `Brand: ${c.packageCollaborations[0].brandFeedback}`}
                  </div>
                )}
              </li>
            ))) : <div style={{ padding: 12, color: "#555" }}>No completed collaborations.</div>}
          </ul>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filtered.map((c) => (
            <li key={c.id ?? JSON.stringify(c)} style={{ padding: 12, border: "1px solid #eee", borderRadius: 6, marginBottom: 8, }}>
              <div style={{ fontWeight: 600 }}>
                {c.package?.title ?? "Untitled Collaboration"}
              </div>
              <div style={{ fontSize: 13, color: "#555" }}>
                Status: {String(c.collabstatus)}
              </div>
              {c.creator?.username && (
                <div style={{ fontSize: 13, color: "#555" }}>
                  Creator: {c.creator.username}
                </div>
              )}
              {c.packageCollaborations?.[0]?.brandFeedback && (
                <div
                  style={{
                    fontSize: 13,
                    color: c.collabstatus === "PENDING" ? "#b7791f" : "#10b981",
                    fontWeight: 600,
                  }}
                >
                  {c.collabstatus === "PENDING"
                    ? `Improvements: ${c.packageCollaborations[0].brandFeedback}`
                    : `Brand: ${c.packageCollaborations[0].brandFeedback}`}
                </div>
              )}
              {c.packageCollaborations?.[0]?.contentDraft &&
                ((c.packageCollaborations[0].contentDraft as ContentDraft)
                  ?.fileUrls?.length ||
                  c.packageCollaborations[0]?.draftSubmittedAt) && (
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color: "#b7791f",
                        fontWeight: 600,
                      }}
                    >
                      Draft uploaded
                    </div>
                    <button
                      onClick={() => setSelectedDraftDeal(c)}
                      className="px-2 py-1 rounded bg-[#7b52d3] text-white text-xs"
                    >
                      View Draft
                    </button>
                  </div>
                )}
            </li>
          ))}
        </ul>
      )}

      {/* Draft viewer modal for brands */}
      {selectedDraftDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setSelectedDraftDeal(null);
              setImproviseMessage("");
            }}
          />
          <div className="relative bg-[#232946] rounded-2xl p-6 w-[min(720px,96%)] max-h-[85vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-white"
              onClick={() => {
                setSelectedDraftDeal(null);
                setImproviseMessage("");
              }}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-white mb-2">
              Draft —{" "}
              {selectedDraftDeal.brand?.username ??
                selectedDraftDeal.package?.title ??
                selectedDraftDeal.package?.title}
            </h3>
            <div className="text-sm text-gray-300 mb-4">
              Creator:{" "}
              {selectedDraftDeal.creator?.username ??
                selectedDraftDeal.creator?.username ??
                ""}
            </div>
            <div className="space-y-3">
              {(() => {
                const contentDraft = selectedDraftDeal
                  ?.packageCollaborations?.[0]?.contentDraft
                  ? (selectedDraftDeal.packageCollaborations[0]
                    .contentDraft as ContentDraft)
                  : null;

                if (
                  !contentDraft?.fileUrls ||
                  contentDraft.fileUrls.length === 0
                ) {
                  return (
                    <div className="text-gray-400">No files available</div>
                  );
                }

                return contentDraft.fileUrls.map((url: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-[#1b2330] p-3 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-sm">
                        {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "🖼️" : "📎"}
                      </div>
                      <div className="text-sm text-gray-200">
                        File {idx + 1}
                      </div>
                    </div>

                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#7b52d3] font-semibold"
                    >
                      Open
                    </a>
                  </div>
                ));
              })()}
            </div>

            <div className="mt-6">
              {/* hide actions if draft already approved */}
              {(() => {
                const pkgCollab = selectedDraftDeal?.packageCollaborations?.[0];
                if (!pkgCollab) return null;

                const contentDraft = pkgCollab.contentDraft
                  ? (pkgCollab.contentDraft as ContentDraft)
                  : null;

                const isApproved = pkgCollab.contentStatus === "APPROVED";

                return (
                  <div className="mt-6">
                    {/* FILES */}
                    <div className="space-y-3">
                      {contentDraft?.fileUrls &&
                        contentDraft.fileUrls.length > 0 ? (
                        contentDraft.fileUrls.map(
                          (url: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-[#1b2330] p-3 rounded"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-sm">
                                  {url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                                    ? "🖼️"
                                    : "📎"}
                                </div>
                                <div className="text-sm text-gray-200">
                                  File {idx + 1}
                                </div>
                              </div>

                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#7b52d3] font-semibold"
                              >
                                Open
                              </a>
                            </div>
                          )
                        )
                      ) : (
                        <div className="text-gray-400">No files available</div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6">
                      {!isApproved ? (
                        <div className="flex gap-3">
                          <button
                            onClick={async () => {
                              if (!selectedDraftDeal) return;
                              const brandUsername =
                                window.location.pathname.split("/")[2];

                              const res = await fetch(
                                `/api/brand2/${encodeURIComponent(
                                  brandUsername
                                )}/collaborations/${encodeURIComponent(
                                  selectedDraftDeal.id
                                )}/approve`,
                                { method: "POST" }
                              );

                              if (!res.ok) {
                                alert("Approve failed");
                                return;
                              }

                              setSelectedDraftDeal(null);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded"
                          >
                            Approve
                          </button>

                          <div className="flex-1">
                            <textarea
                              value={improviseMessage}
                              onChange={(e) =>
                                setImproviseMessage(e.target.value)
                              }
                              placeholder="Request improvements"
                              className="w-full p-2 rounded bg-[#111827] text-white"
                              rows={3}
                            />

                            <button disabled={!improviseMessage.trim()} onClick={async () => {
                                if (!selectedDraftDeal) return;
                                const brandUsername =
                                  window.location.pathname.split("/")[2];

                                const res = await fetch(
                                  `/api/brand2/${encodeURIComponent(
                                    brandUsername
                                  )}/collaborations/${encodeURIComponent(
                                    selectedDraftDeal.id
                                  )}/request-improvements`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      message: improviseMessage,
                                    }),
                                  }
                                );

                                if (!res.ok) {
                                  alert("Request failed");
                                  return;
                                }

                                setSelectedDraftDeal(null);
                                setImproviseMessage("");
                              }}
                              className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded"
                            >
                              Request Improvements
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-2 bg-green-600 text-white rounded font-semibold">
                          Approved
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
