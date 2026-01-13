"use client";

import { BrandProfile, CampaignCollaboration, PackageCollaboration } from "@prisma/client";
import type { ContentDraft } from "@/types/contentDraft";
import React from "react";

const dealTabs = [
  { key: "ACTIVE", label: "Active Deals", icon: "🔷" },
  { key: "PENDING", label: "Requests", icon: "🟧" },
  { key: "COMPLETED", label: "Completed Deals", icon: "🏁" },
] as const;

type DealStatus = "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED";

interface Deal {
  id: string;
  creatorId: string;
  brandId: string;
  packageId: string;
  campaignId?: string;
  collabType: string;
  collabstatus: DealStatus;
  createdAt: string;
  updatedAt: string;
  packageCollaborations?: PackageCollaboration[];
  campaignCollaborations?: CampaignCollaboration[];
  brand: BrandProfile;
  package: {
    price: number;
    title: string;
  }
}

const Deals = () => {
  const [deals, setDeals] = React.useState<Deal[]>([]);
  const [dealTab, setDealTab] = React.useState<DealStatus>("ACTIVE");
  const [selectedDeal, setSelectedDeal] = React.useState<Deal | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [acceptingIds, setAcceptingIds] = React.useState<string[]>([]);
  const [submittingId, setSubmittingId] = React.useState<string | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = React.useState(false);
  const [submissionForm, setSubmissionForm] = React.useState<{ description: string; files: File[] }>({ description: '', files: [] });
  const [publishedInput, setPublishedInput] = React.useState<string>('');
  const [publishingUrlForId, setPublishingUrlForId] = React.useState<string | null>(null);

  // Prefill published input when a deal is selected
  React.useEffect(() => {
    if (!selectedDeal) {
      setPublishedInput('');
      return;
    }
    const topPublished = selectedDeal.packageCollaborations?.[0]?.publishedContentUrl;
    const cd = selectedDeal.packageCollaborations?.[0]?.contentDraft as any;
    const publishedUrl = topPublished || cd?.publishedUrl || '';
    setPublishedInput(publishedUrl ?? '');
  }, [selectedDeal]);

  React.useEffect(() => {
    const username = window.location.pathname.split("/")[2];
    if (!username) return;

    let mounted = true
    async function fetchcalls() {
      try {
        const res = await fetch(`/api/influencer/${username}/collaborations`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        const collabs = Array.isArray(data?.collaborations) ? data.collaborations : [];
        setDeals(collabs);
      } catch (err) {
        console.error('Failed to fetch deals:', err);
        if (mounted) setDeals([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchcalls();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading campaigns...</div>;
  }

  const filteredDeals = deals.filter(d => d.collabstatus === dealTab);
  const activePackageCollab = selectedDeal?.packageCollaborations?.[0] ?? null;
  const contentDraft = activePackageCollab?.contentDraft ? (activePackageCollab.contentDraft as ContentDraft) : null;
  const draftFileUrls = contentDraft?.fileUrls ?? [];
  
  // Check if content is approved
  const isContentApproved = activePackageCollab?.contentStatus === 'APPROVED' || !!activePackageCollab?.draftapprovalAt;

  return (
    <div className="bg-[#232946] w-[75vw] text-center mx-auto mt-5 rounded-2xl shadow-lg p-8 flex flex-col gap-8">

      <h2 className="text-2xl text-white font-bold flex items-center gap-2">
        Deals
      </h2>

      {/* Tabs */}
      <div className="flex gap-4">
        {dealTabs.map(tab => (
          <button key={tab.key} onClick={() => setDealTab(tab.key)} className={`px-4 py-2 rounded-lg font-semibold border transition ${dealTab === tab.key ? "bg-[#7b52d3] text-white" : "bg-[#181c2f] text-[#7b52d3] border-[#7b52d3]"}`} >
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

        {deals.map(deal => (dealTab === deal.collabstatus &&
          <div key={deal.id} className="bg-[#181c2f] rounded-xl p-6 shadow border border-[#7b52d3] flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {deal.brand.logoUrl && (
                <img src={deal.brand.logoUrl} alt={deal.brand.username} className="w-10 h-10 rounded-full border-2 border-[#7b52d3] object-cover" />
              )}
              <span className="font-bold text-lg">{deal.brand.username}</span>
            </div>

            <div className="font-semibold text-[#7b52d3]">
              {deal.package.title}
            </div>

            <div className="text-sm text-gray-400">
              Status: <span className="text-white font-bold">{deal.collabstatus}</span>
            </div>

            <div className="text-sm text-gray-400">
              Cost: <span className="text-white font-bold">₹{Number(deal.package.price ?? 0).toLocaleString()}</span>
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={() => { setSelectedDeal(deal); setShowSubmissionForm(true); }} className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold hover:bg-[#5a3ca0]">
                View Details
              </button>

              {deal.collabstatus === 'PENDING' && (
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
                      setDeals(prev => prev.map(p => p.id === deal.id ? { ...p, collabstatus: updated?.collabstatus ?? 'ACTIVE' } : p));
                      setSelectedDeal(prev => prev && prev.id === deal.id ? { ...prev, collabstatus: updated?.collabstatus ?? 'ACTIVE' } : prev);
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
            <button className="absolute top-4 right-4 text-white text-xl"
              onClick={() => { setSelectedDeal(null); setShowSubmissionForm(false); setSubmissionForm({ description: '', files: [] }); }}
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {selectedDeal.brand.username}
            </h3>

            <div className="text-[#7b52d3] font-semibold text-lg mb-2">
              {selectedDeal.package.title}
            </div>

            <div className="text-sm text-gray-400">
              Status: <span className="text-white">{selectedDeal.collabstatus}</span>
            </div>

            <div className="text-sm text-gray-400">
              Cost: <span className="text-white font-bold">₹{Number(selectedDeal.package.price ?? 0).toLocaleString()}</span>
            </div>
            
            {/* Status Badge inside Modal */}
             {isContentApproved && (
                <div className="mt-4 p-2 bg-green-900/40 border border-green-500 rounded text-green-300 text-sm font-bold">
                    ✨ Content Approved
                </div>
             )}

            {/* Previous Drafts Section */}
            {draftFileUrls.length > 0 && (
              <div className="mt-6 p-4 bg-[#181c2f] rounded-lg border border-[#7b52d3]">
                <h5 className="text-sm font-semibold text-[#7b52d3] mb-3">
                  ✅ Draft Submitted
                </h5>

                <div className="space-y-2">
                  {draftFileUrls.map((url, idx) => (
                    <div key={idx} className="text-sm text-gray-300 flex items-center justify-between" >
                      <span>📎 Uploaded File {idx + 1}</span>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#7b52d3] hover:text-[#a78bfa] text-xs font-bold" >
                        View
                      </a>
                    </div>
                  ))}

                  {activePackageCollab?.draftSubmittedAt && (
                    <div className="text-xs text-gray-400 mt-3">
                      Submitted:{" "}
                      {new Date(activePackageCollab.draftSubmittedAt).toLocaleDateString()}
                    </div>
                  )}

                  {activePackageCollab?.brandFeedback && (
                    <div className="mt-3 text-sm font-semibold text-yellow-300">
                      Brand: {activePackageCollab.brandFeedback}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONDITIONAL: Show Publish Link Input IF Approved, ELSE Show Submission Form */}
            {isContentApproved ? (
               // --- PUBLISH LINK INPUT SECTION ---
               <div className="mt-6">
                 <h4 className="text-lg font-bold text-white mb-2">Submit Published Link</h4>
                 <p className="text-xs text-gray-400 mb-3">The brand has approved your draft. Please paste the live link below.</p>
                 
                 {/* Existing Published Link View */}
                 {(activePackageCollab?.publishedContentUrl || (activePackageCollab?.contentDraft as any)?.publishedUrl) && (
                   <div className="mb-3">
                     <a 
                       href={activePackageCollab?.publishedContentUrl || (activePackageCollab?.contentDraft as any)?.publishedUrl} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500"
                     >
                       View Live Post
                     </a>
                   </div>
                 )}

                 <div className="flex flex-col gap-2">
                   <input
                     value={publishedInput}
                     onChange={(e) => setPublishedInput(e.target.value)}
                     placeholder="Paste published URL (e.g. Instagram/TikTok link)"
                     className="w-full p-2 rounded bg-[#181c2f] text-white border border-[#7b52d3] focus:outline-none focus:ring-1 focus:ring-[#7b52d3]"
                   />
                   <button
                     onClick={async () => {
                       if (!selectedDeal) return;
                       const username = window.location.pathname.split('/')[2];
                       if (!username) return alert('Username not found');
                       if (!publishedInput.trim()) return alert('Please enter a URL');
                       setPublishingUrlForId(selectedDeal.id);
                       try {
                         const res = await fetch(`/api/influencer/${encodeURIComponent(username)}/collaborations/${encodeURIComponent(selectedDeal.id)}/publish`, {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({ publishedUrl: publishedInput.trim() }),
                         });
                         if (!res.ok) {
                           const d = await res.json().catch(() => ({}));
                           throw new Error(d?.error || res.statusText || 'Publish failed');
                         }
                         const data = await res.json();
                         const updated = data?.collaboration ?? data;
                         if (updated && updated.id) {
                           const usernameForFetch = encodeURIComponent(username);
                           const collabRes = await fetch(`/api/influencer/${usernameForFetch}/collaborations`, { cache: 'no-store' });
                           if (collabRes.ok) {
                             const collabData = await collabRes.json();
                             const collabs = Array.isArray(collabData?.collaborations) ? collabData.collaborations : [];
                             setDeals(collabs);
                             // update selectedDeal with fresh data if possible
                             const newSel = collabs.find((c: any) => c.id === selectedDeal.id) ?? null;
                             setSelectedDeal(newSel);
                           }
                         }
                       } catch (err) {
                         console.error('Publish URL error', err);
                         alert(String((err as any)?.message || err));
                       } finally {
                         setPublishingUrlForId(null);
                       }
                     }}
                     disabled={publishingUrlForId === selectedDeal?.id}
                     className="px-4 py-2 bg-[#7b52d3] text-white rounded-lg font-bold hover:bg-[#5a3ca0] disabled:opacity-50"
                   >
                     {publishingUrlForId === selectedDeal?.id ? 'Saving…' : 'Save Link'}
                   </button>
                 </div>
               </div>
            ) : (
                // --- SUBMISSION FORM SECTION ---
                selectedDeal.collabstatus === "ACTIVE" && showSubmissionForm ? (
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
                                <button onClick={() => setSubmissionForm(prev => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }))} className="text-red-500 hover:text-red-400 text-xs"
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
                      <input type="file" id={`file-input-${selectedDeal.id}`} multiple onChange={(e) => setSubmissionForm(prev => ({ ...prev, files: [...prev.files, ...Array.from(e.target.files || [])] }))}
                        className="hidden"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                      />
                      <button onClick={() => document.getElementById(`file-input-${selectedDeal.id}`)?.click()} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500">
                        📁 Upload File
                      </button>
    
                      <button onClick={async () => {
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
                            fileUrls: uploadedFileUrls,
                            description: submissionForm.description,
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
    
                      <button onClick={() => { setShowSubmissionForm(false); setSubmissionForm({ description: '', files: [] }); }} className="px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-500">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;