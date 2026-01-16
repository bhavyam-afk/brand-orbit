"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useBrandDeals } from "./useBrandDeals";
import DealsFilterTabs from "./DealsFilterTabs";
import DealsList from "./DealsList";
import BrandDraftModal from "./BrandDraftModal";
import { openRazorpayCheckout } from "@/components/Razorpay/OpenRazorPayCheckOut";

export default function BrandDeals() {
    const { username } = useParams<{ username: string }>();
    const { collabs, active, pending, completed, custom } = useBrandDeals(username);

    const [filter, setFilter] = useState<"all" | "active" | "pending" | "completed">("all");
    const [selectedDraft, setSelectedDraft] = useState<any | null>(null);
    const [improviseMessage, setImproviseMessage] = useState("");
    const [payingIds, setPayingIds] = useState<string[]>([]);

    return (
        <div>
            <DealsFilterTabs filter={filter} setFilter={setFilter}
                counts={{
                    all: collabs.length,
                    active: active.length,
                    pending: pending.length,
                    completed: completed.length,
                }}
            />

            {(filter === "all" || filter === "active") && (
                <DealsList title="Active" deals={active} onSelectDraft={setSelectedDraft} payingIds={payingIds}
                    onPay={async (c) => {
                        try {
                            setPayingIds(p => [...p, c.id]);
                            const orderRes = await fetch(
                                `/api/brand2/${username}/collaborations/${c.id}/paycreator`,
                                { method: "POST" }
                            );
                            if (!orderRes.ok) {
                                const error = await orderRes.json();
                                alert(`Failed to create payment order: ${error.error}`);
                                return;
                            }
                            const orderData = await orderRes.json();
                            await openRazorpayCheckout({
                                orderId: orderData.orderId,
                                amount: orderData.amount,
                                currency: orderData.currency,
                                collabId: c.id,
                            });
                        } catch (error) {
                            console.error("Payment error:", error);
                            alert("Payment failed. Please try again.");
                        } finally {
                            setPayingIds(p => p.filter(x => x !== c.id));
                        }
                    }}
                />
            )}

            {(filter === "all" || filter === "pending") && (
                <>
                <DealsList title="Pending" deals={pending} onSelectDraft={setSelectedDraft} />
                {custom.length > 0 && (
                    <>
                        <h2 className="mt-8 mb-4 text-2xl text-white font-semibold">Custom Package Requests</h2>
                        <div className="customs">
                            {custom.map((req) => {
                                return (<div key={req.id} className="bg-[#111827] rounded-lg p-4 mb-4">
                                    <div className="font-semibold text-lg text-yellow-300 mb-2">
                                        {req.title}
                                    </div>
                                    <div className="text-gray-300 mb-2">
                                        {req.description}
                                    </div>
                                    <div className="text-gray-400 mb-2">
                                        <strong>Deliverables:</strong> {req.deliverables.join(", ")}
                                    </div>
                                    <div className="text-gray-400 mb-2">
                                        <strong>Budget:</strong> ₹{Number(req.price).toFixed(2)}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </>
                )}
                </>
            )}

            {(filter === "all" || filter === "completed") && (
                <DealsList title="Completed" deals={completed} onSelectDraft={setSelectedDraft} />
            )}

            {selectedDraft && (<BrandDraftModal open={true} onClose={() => { setSelectedDraft(null); setImproviseMessage(""); }} collabId={selectedDraft.id} brandUsername={username} 
                creatorUsername={selectedDraft.creator?.username}
                packageTitle={selectedDraft.package?.title}
                packageCollab={selectedDraft.packageCollaborations[0]}
                improviseMessage={improviseMessage}
                setImproviseMessage={setImproviseMessage}
                onApprove={async () => {
                    await fetch(
                        `/api/brand2/${username}/collaborations/${selectedDraft.id}/approve`,
                        { method: "POST" }
                    );
                    setSelectedDraft(null);
                }}
                onRequestImprovements={async () => {
                    await fetch(
                        `/api/brand2/${username}/collaborations/${selectedDraft.id}/request-improvements`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ message: improviseMessage }),
                        }
                    );
                    setSelectedDraft(null);
                }}
            />
            )}
        </div>
    );
}
