"use client";

import React, { useEffect, useState } from "react";
import type { Deal } from "./types";
import type { ContentDraft } from "@/types/contentDraft";

type Props = {
  deal: Deal;
  onClose: () => void;
  refreshDeals: () => void;
};

export function DealModal({ deal, onClose, refreshDeals }: Props) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [submissionForm, setSubmissionForm] = useState<{ description: string; files: File[] }>({
    description: "",
    files: [],
  });
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [publishedInput, setPublishedInput] = useState("");
  const [publishingUrlForId, setPublishingUrlForId] = useState<string | null>(null);

  const activePackageCollab = deal.packageCollaborations?.[0] ?? null;
  const contentDraft = activePackageCollab?.contentDraft
    ? (activePackageCollab.contentDraft as ContentDraft)
    : null;

  const draftFileUrls = contentDraft?.fileUrls ?? [];

  const isContentApproved =
    activePackageCollab?.contentStatus === "APPROVED" ||
    !!activePackageCollab?.draftapprovalAt;

  // Prefill published URL
  useEffect(() => {
    const topPublished = activePackageCollab?.publishedContentUrl;
    const cdUrl = (contentDraft as any)?.publishedUrl;
    setPublishedInput(topPublished || cdUrl || "");
  }, [deal.id]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#232946] rounded-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-white text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Header */}
        <h3 className="text-2xl font-bold mb-2 text-white">
          {deal.brand.username}
        </h3>

        <div className="text-[#7b52d3] font-semibold text-lg mb-1">
          {deal.package.title}
        </div>

        <div className="text-sm text-gray-400">
          Status: <span className="text-white">{deal.collabstatus}</span>
        </div>

        <div className="text-sm text-gray-400">
          Cost:{" "}
          <span className="text-white font-bold">
            ₹{Number(deal.package.price ?? 0).toLocaleString()}
          </span>
        </div>

        {/* Approved Badge */}
        {isContentApproved && (
          <div className="mt-4 p-2 bg-green-900/40 border border-green-500 rounded text-green-300 text-sm font-bold">
            ✨ Content Approved
          </div>
        )}

        {/* Drafts */}
        {draftFileUrls.length > 0 && (
          <div className="mt-6 p-4 bg-[#181c2f] rounded-lg border border-[#7b52d3]">
            <h5 className="text-sm font-semibold text-[#7b52d3] mb-3">
              ✅ Draft Submitted
            </h5>

            {draftFileUrls.map((url, idx) => (
              <div
                key={idx}
                className="text-sm text-gray-300 flex justify-between"
              >
                <span>📎 Uploaded File {idx + 1}</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7b52d3] text-xs font-bold"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        )}

        {/* ===================== */}
        {/* PUBLISH FLOW */}
        {/* ===================== */}
        {isContentApproved ? (
          <div className="mt-6">
            <h4 className="text-lg font-bold text-white mb-2">
              Submit Published Link
            </h4>

            <input
              value={publishedInput}
              onChange={(e) => setPublishedInput(e.target.value)}
              placeholder="Paste published URL"
              className="w-full p-2 rounded bg-[#181c2f] text-white border border-[#7b52d3]"
            />

            <button
              disabled={publishingUrlForId === deal.id}
              onClick={async () => {
                const username = window.location.pathname.split("/")[2];
                if (!username || !publishedInput.trim()) return;

                setPublishingUrlForId(deal.id);
                try {
                  await fetch(
                    `/api/influencer/${username}/collaborations/${deal.id}/publish`,
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ publishedUrl: publishedInput }),
                    }
                  );
                  refreshDeals();
                } finally {
                  setPublishingUrlForId(null);
                }
              }}
              className="mt-3 px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold"
            >
              {publishingUrlForId === deal.id ? "Saving…" : "Save Link"}
            </button>
          </div>
        ) : (
          /* ===================== */
          /* SUBMISSION FLOW */
          /* ===================== */
          deal.collabstatus === "ACTIVE" && (
            <div className="mt-6 space-y-4">
              <textarea
                value={submissionForm.description}
                onChange={(e) =>
                  setSubmissionForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-[#181c2f] text-white rounded-lg p-3 border border-[#7b52d3]"
                placeholder="Describe your work"
              />

              <input
                type="file"
                multiple
                onChange={(e) =>
                  setSubmissionForm((p) => ({
                    ...p,
                    files: [...p.files, ...Array.from(e.target.files || [])],
                  }))
                }
                className="text-white"
              />

              <button
                disabled={
                  submittingId === deal.id ||
                  !submissionForm.description.trim() ||
                  submissionForm.files.length === 0
                }
                onClick={async () => {
                  const username = window.location.pathname.split("/")[2];
                  if (!username) return;

                  setSubmittingId(deal.id);
                  try {
                    const uploadedUrls: string[] = [];

                    for (const file of submissionForm.files) {
                      const fd = new FormData();
                      fd.append("collabId", deal.id);
                      fd.append("file", file);

                      const r = await fetch("/api/uploads/creatordraft", {
                        method: "POST",
                        body: fd,
                      });
                      const { fileUrl } = await r.json();
                      uploadedUrls.push(fileUrl);
                    }

                    await fetch(
                      `/api/influencer/${username}/collaborations/${deal.id}/submit`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          fileUrls: uploadedUrls,
                          description: submissionForm.description,
                        }),
                      }
                    );

                    refreshDeals();
                    onClose();
                  } finally {
                    setSubmittingId(null);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold"
              >
                {submittingId === deal.id ? "Submitting…" : "Submit Work"}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
