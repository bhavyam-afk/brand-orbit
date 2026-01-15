"use client";

import DealCard from "./DealCard";

type Props = {
  title: string;
  deals: any[];
  onSelectDraft: (c: any) => void;
  onPay?: (c: any) => void;
  payingIds?: string[];
};

export default function DealsList({
  title,
  deals,
  onSelectDraft,
  onPay,
  payingIds = [],
}: Props) {
  return (
    <>
      <h4 className="mt-4 mb-2 font-semibold">{title}</h4>

      {deals.length === 0 && (
        <div className="text-gray-500 text-sm">No deals</div>
      )}

      <ul>
        {deals.map(c => (
          <DealCard
            key={c.id}
            collab={c}
            onViewDraft={() => onSelectDraft(c)}
            onPay={onPay ? () => onPay(c) : undefined}
            paying={payingIds.includes(c.id)}
          />
        ))}
      </ul>
    </>
  );
}
