"use client";

import { ContentDraft } from "@/types/contentDraft";

type Props = {
  collab: any;
  onViewDraft: () => void;
  onPay?: () => void;
  paying?: boolean;
};

export default function DealCard({ collab, onViewDraft, onPay, paying }: Props) {
  const pkgCollab = collab.packageCollaborations?.[0];
  const hasDraft =
    pkgCollab?.contentDraft &&
    ((pkgCollab.contentDraft as ContentDraft)?.fileUrls?.length ||
      pkgCollab?.draftSubmittedAt);

  return (
    <li className="p-3 border rounded mb-2">
      <div className="font-semibold">
        {collab.package?.title ?? "Untitled Package"}
      </div>

      <div className="text-sm text-gray-600">
        Creator: {collab.creator?.username ?? "—"}
      </div>

      {hasDraft && (
        <button
          onClick={onViewDraft}
          className="mt-2 px-2 py-1 text-xs bg-[#7b52d3] text-white rounded"
        >
          View Draft
        </button>
      )}

      {collab.collabstatus === "ACTIVE" && onPay && (
        <div className="mt-2">
          <button
            onClick={onPay}
            disabled={paying}
            className="px-3 py-1 bg-cyan-500 text-white rounded text-sm"
          >
            {paying ? "Processing…" : "PAY"}
          </button>
        </div>
      )}
    </li>
  );
}
