// components/brand/Feed/DraftViewerModal.tsx

"use client";

import React from "react";
import { DraftInfo } from "./types";

interface DraftViewerModalProps {
  draft: DraftInfo;
  onClose: () => void;
}

export default function DraftViewerModal({
  draft,
  onClose,
}: DraftViewerModalProps) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative bg-[#0b1220] rounded-2xl p-6 w-[min(700px,92%)] max-h-[80vh] overflow-y-auto border border-yellow-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-bold text-yellow-300">
              Draft files
            </div>
            <div className="text-sm text-gray-300">
              Package: {draft.packageId}
            </div>
            {draft.submittedAt && (
              <div className="text-xs text-gray-400">
                Submitted: {new Date(draft.submittedAt).toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-700 rounded text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {draft.fileUrls.length === 0 && (
            <div className="text-gray-400">No files available</div>
          )}

          {draft.fileUrls.map((url, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#111827] p-3 rounded"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-sm">
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
                className="text-yellow-300 font-semibold"
              >
                Open
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
