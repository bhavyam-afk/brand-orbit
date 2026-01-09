"use client";

import React from "react";

const dealTabs = [
  { key: "ACTIVE", label: "Active Deals", icon: "🔷" },
  { key: "PENDING", label: "Requests", icon: "🟧" },
  { key: "COMPLETED", label: "Completed Deals", icon: "🏁" },
] as const;

type DealStatus = "ACTIVE" | "PENDING" | "COMPLETED";

interface Deal {
  id: string;
  brandName: string;
  brandLogo?: string;
  campaignName?: string;
  packageTitle: string;
  status: DealStatus;
  package: {
    price: number;
  }
  reach?: number;
  engagement?: number;
  postLinks?: Record<string, string>;
  packageCollaborations?: Array<{
    id: string;
    status: string;
    contentDraft?: {
      fileUrls?: string[];
    };
    draftSubmittedAt?: string;
  }>;
}

const Deals: React.FC<Deal> = () => {
  const [dealTab, setDealTab] = React.useState<DealStatus>("ACTIVE");
  const [selectedDeal, setSelectedDeal] = React.useState<Deal | null>(null);
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [acceptingIds, setAcceptingIds] = React.useState<string[]>([]);
  const [submittingId, setSubmittingId] = React.useState<string | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = React.useState(false);
  const [submissionForm, setSubmissionForm] = React.useState<{ description: string; files: File[] }>({ description: '', files: [] });

  React.useEffect(() => {
    const username = window.location.pathname.split("/")[2];
    if (!username) return;

    async function fetchcalls() {
      try {
        const res = await fetch(`/api/influencer/${username}/collaborations`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        console.log('Deals data:', data);
        const collabs = Array.isArray(data?.collaborations) ? data.collaborations : [];
        setDeals(collabs);
      } catch (err) {
        console.error('Failed to fetch deals:', err);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    }

    fetchcalls();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

  const filteredDeals = deals.filter(d => d.status === dealTab);
  return (
    <div className="bg-[#232946] w-[75vw] text-center mx-auto mt-5 rounded-2xl shadow-lg p-8 flex flex-col gap-8">

      <h2 className="text-2xl text-white font-bold flex items-center gap-2">
        <span>📣</span> Deals
      </h2>

      {/* Tabs */}
      <div className="flex gap-4">
        {dealTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setDealTab(tab.key)}
            className={`px-4 py-2 rounded-lg font-semibold border transition ${dealTab === tab.key ? "bg-[#7b52d3] text-white" : "bg-[#181c2f] text-[#7b52d3] border-[#7b52d3]"}`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDeals.length === 0 && (
          <div className="text-gray-400">No deals found.</div>
        )}

        {deals.map(deal => (dealTab === deal.status &&
          <div
            key={deal.id}
            className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              {deal.brandLogo && (
                <img
                  src={deal.brandLogo}
                  alt={deal.brandName}
                  className="w-10 h-10 rounded-full border-2 border-[#7b52d3] object-cover"
                />
              )}
              <span className="font-bold text-lg">{deal.brandName}</span>
            </div>

            <div className="font-semibold text-[#7b52d3]">
              {deal.packageTitle}
            </div>

            <div className="text-sm text-gray-400">
              Status: <span className="text-white font-bold">{deal.status}</span>
            </div>

            <div className="text-sm text-gray-400">
              Cost: <span className="text-white font-bold">₹{Number(deal.package.price ?? 0).toLocaleString()}</span>
            </div>

            {deal.reach && (
              <div className="text-sm text-gray-400">
                Reach: <span className="text-white">{deal.reach.toLocaleString()}</span>
              </div>
            )}

            {deal.engagement && (
              <div className="text-sm text-gray-400">
                Engagement: <span className="text-white">{deal.engagement}%</span>
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSelectedDeal(deal)}
                className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold hover:bg-[#5a3ca0]"
              >
                View Details
              </button>

              {deal.status === 'PENDING' && (
                <button
                  onClick={async () => {
                    const username = window.location.pathname.split('/')[2];
                    if (!username) return;
                    setAcceptingIds(prev => [...prev, deal.id]);
                    try {
                      const res = await fetch(`/api/influencer/${encodeURIComponent(username)}/collaborations/${deal.id}/accept`, { method: 'POST' });
                      if (!res.ok) {
                        const d = await res.json();
                        throw new Error(d?.error || res.statusText || 'Accept failed');
                      }
                      const data = await res.json();
                      const updated = data.collaboration ?? data;
                      setDeals(prev => prev.map(p => p.id === deal.id ? { ...p, status: updated?.status ?? 'ACTIVE' } : p));
                      // why this ? 
                      setDealTab('ACTIVE');
                    } catch (err) {
                      console.error('Accept error', err);
                    } finally {
                      setAcceptingIds(prev => prev.filter(id => id !== deal.id));
                    }
                  }}
                  disabled={acceptingIds.includes(deal.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"
                >
                  {acceptingIds.includes(deal.id) ? 'Accepting…' : 'Accept'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#232946] rounded-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={() => { setSelectedDeal(null); setShowSubmissionForm(false); setSubmissionForm({ description: '', files: [] }); }}
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {selectedDeal.brandName}
            </h3>

            <div className="text-[#7b52d3] font-semibold text-lg mb-2">
              {selectedDeal.packageTitle}
            </div>

            <div className="text-sm text-gray-400">
              Status: <span className="text-white">{selectedDeal.status}</span>
            </div>

            <div className="text-sm text-gray-400">
              Cost: <span className="text-white font-bold">₹{Number(selectedDeal.package.price ?? 0).toLocaleString()}</span>
            </div>

            {selectedDeal.packageCollaborations?.[0]?.contentDraft?.fileUrls && (
              <div className="mt-6 p-4 bg-[#181c2f] rounded-lg border border-[#7b52d3]">
                <h5 className="text-sm font-semibold text-[#7b52d3] mb-3">✅ Draft Submitted</h5>
                <div className="space-y-2">
                  {selectedDeal.packageCollaborations[0].contentDraft.fileUrls.map((url, idx) => (
                    <div key={idx} className="text-sm text-gray-300 flex items-center justify-between">
                      <span>📎 Uploaded File {idx + 1}</span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7b52d3] hover:text-[#a78bfa] text-xs font-bold"
                      >
                        View
                      </a>
                    </div>
                  ))}
                  {selectedDeal.packageCollaborations[0].draftSubmittedAt && (
                    <div className="text-xs text-gray-400 mt-3">
                      Submitted: {new Date(selectedDeal.packageCollaborations[0].draftSubmittedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )}
            {selectedDeal.status === "ACTIVE" && showSubmissionForm ? (
              // Submission form
              <div className="mt-6 space-y-4">
                <h4 className="text-lg font-bold text-white">Submit Your Work</h4>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Description / Notes</label>
                  <textarea
                    value={submissionForm.description}
                    onChange={(e) => setSubmissionForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#181c2f] text-white rounded-lg p-3 border border-[#7b52d3] focus:outline-none"
                    rows={4}
                    placeholder="Describe your work, deliverables, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Uploaded Files</label>
                  {submissionForm.files.length > 0 ? (
                    <div className="mt-2 space-y-2 bg-[#181c2f] rounded-lg p-4 border border-[#7b52d3]">
                      <div className="text-sm font-semibold text-[#7b52d3] flex items-center gap-2">
                        <span>✨</span>
                        <span className="bg-gradient-to-r from-[#7b52d3] to-[#a78bfa] bg-clip-text text-transparent font-bold">
                          Draft Uploaded
                        </span>
                        <span>✨</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {submissionForm.files.map((file, idx) => (
                          <div key={idx} className="text-sm text-gray-300 flex items-center justify-between">
                            <span>📎 {file.name}</span>
                            <button
                              onClick={() => setSubmissionForm(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }))}
                              className="text-red-500 hover:text-red-400 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-400 italic">No files uploaded yet</div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <input
                    type="file"
                    id={`file-input-${selectedDeal.id}`}
                    multiple
                    onChange={(e) => setSubmissionForm(prev => ({ ...prev, files: [...prev.files, ...Array.from(e.target.files || [])] }))}
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                  <button
                    onClick={() => document.getElementById(`file-input-${selectedDeal.id}`)?.click()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500"
                  >
                    📁 Upload File
                  </button>

                  <button
                    onClick={async () => {
                      if (!selectedDeal) return;
                      const username = window.location.pathname.split('/')[2];
                      if (!username) return;

                      setSubmittingId(selectedDeal.id);
                      try {
                        const uploadedFileUrls: string[] = [];

                        // Step 1: Upload each file directly to backend (which uploads to S3)
                        for (const file of submissionForm.files) {
                          try {
                            const uploadFormData = new FormData();
                            uploadFormData.append('collabId', selectedDeal.id);
                            uploadFormData.append('file', file);

                            const uploadRes = await fetch('/api/uploads/creatordraft', {
                              method: 'POST',
                              body: uploadFormData,
                            });

                            if (!uploadRes.ok) {
                              const errorData = await uploadRes.json();
                              console.error("Upload error response:", errorData);
                              throw new Error(`File upload failed: ${errorData.error || uploadRes.statusText}`);
                            }

                            const { fileUrl } = await uploadRes.json();
                            uploadedFileUrls.push(fileUrl);
                          } catch (fileErr) {
                            console.error(`Error uploading file ${file.name}:`, fileErr);
                            throw fileErr;
                          }
                        }

                        // Step 2: Submit collaboration with uploaded file URLs
                        const submissionData = {
                          description: submissionForm.description,
                          fileUrls: uploadedFileUrls,
                        };

                        const res = await fetch(`/api/influencer/${encodeURIComponent(username)}/collaborations/${selectedDeal.id}/submit`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(submissionData),
                        });

                        if (!res.ok) {
                          const d = await res.json();
                          throw new Error(d?.error || res.statusText || 'Submission failed');
                        }

                        const data = await res.json();
                        console.log('Submission successful:', data);
                        setSelectedDeal(null);
                        setShowSubmissionForm(false);
                        setSubmissionForm({ description: '', files: [] });
                        
                        // Refresh deals list
                        const collabRes = await fetch(`/api/influencer/${encodeURIComponent(username)}/collaborations`);
                        if (collabRes.ok) {
                          const collabData = await collabRes.json();
                          const collabs = Array.isArray(collabData?.collaborations) ? collabData.collaborations : [];
                          setDeals(collabs);
                        }
                      } catch (err) {
                        console.error('Submit error', err);
                        alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
                      } finally {
                        setSubmittingId(null);
                      }
                    }}
                    disabled={submittingId === selectedDeal?.id || !submissionForm.description.trim() || submissionForm.files.length === 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 disabled:opacity-50"
                  >
                    {submittingId === selectedDeal?.id ? 'Submitting…' : 'Submit Work'}
                  </button>

                  <button
                    onClick={() => { setShowSubmissionForm(false); setSubmissionForm({ description: '', files: [] }); }}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              selectedDeal.status === "ACTIVE" && (
                <button
                  onClick={() => setShowSubmissionForm(true)}
                  className="mt-6 px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold hover:bg-[#5a3ca0]"
                >
                  Submit Work
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
