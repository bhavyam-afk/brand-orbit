"use client";

import React from "react";
import { ContentDraft } from "@/types/contentDraft";
import { CollabStatus, PackageCollaboration } from "@prisma/client";

interface BrandDraftModalProps {
  open: boolean;
  onClose: () => void;

  collabId: string;
  brandUsername: string;

  creatorUsername?: string;
  packageTitle?: string;

  packageCollab: PackageCollaboration;

  improviseMessage: string;
  setImproviseMessage: (v: string) => void;

  onApprove: () => Promise<void>;
  onRequestImprovements: () => Promise<void>;
}

export default function BrandDraftModal({
  open,
  onClose,
  collabId,
  brandUsername,
  creatorUsername,
  packageTitle,
  packageCollab,
  improviseMessage,
  setImproviseMessage,
  onApprove,
  onRequestImprovements,
}: BrandDraftModalProps) {
  if (!open) return null;

  const contentDraft = packageCollab.contentDraft
    ? (packageCollab.contentDraft as ContentDraft)
    : null;

  const isApproved = packageCollab.contentStatus === "APPROVED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-[#232946] rounded-2xl p-6 w-[min(720px,96%)] max-h-[85vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-white"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-xl font-bold text-white mb-2">
          Draft — {packageTitle ?? "Package"}
        </h3>

        <div className="text-sm text-gray-300 mb-4">
          Creator: {creatorUsername ?? "—"}
        </div>

        {/* FILES */}
        <div className="space-y-3">
          {!contentDraft?.fileUrls?.length && (
            <div className="text-gray-400">No files available</div>
          )}

          {contentDraft?.fileUrls?.map((url, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#1b2330] p-3 rounded"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
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
          ))}
        </div>

        {/* ACTIONS */}
        <div className="mt-6">
          {!isApproved ? (
            <div className="flex gap-3">
              <button
                onClick={onApprove}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Approve
              </button>

              <div className="flex-1">
                <textarea
                  value={improviseMessage}
                  onChange={(e) => setImproviseMessage(e.target.value)}
                  placeholder="Request improvements"
                  className="w-full p-2 rounded bg-[#111827] text-white"
                  rows={3}
                />

                <button
                  disabled={!improviseMessage.trim()}
                  onClick={onRequestImprovements}
                  className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded disabled:opacity-60"
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
    </div>
  );
}
