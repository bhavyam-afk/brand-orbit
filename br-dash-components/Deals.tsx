"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Collab = {
  id?: string
  _id?: string
  title?: string
  name?: string
  status?: string
  influencer?: string
  [key: string]: any
}

const Deals = () => {
  const params = useParams() as { username?: string }
  const username = params?.username
  const [collabs, setCollabs] = useState<Collab[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDraftDeal, setSelectedDraftDeal] = useState<Collab | null>(null)
  const [approvingIds, setApprovingIds] = useState<string[]>([])
  const [improviseMessage, setImproviseMessage] = useState<string>('')
  const [improviseSubmittingId, setImproviseSubmittingId] = useState<string | null>(null)
  const [payingIds, setPayingIds] = useState<string[]>([])

  useEffect(() => {
    if (!username) return
    let mounted = true

    const fetchCollabs = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/brand2/${username}/collaborations`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`Failed to fetch (${res.status})`)
        const data = await res.json()
        const list = Array.isArray(data) ? data : (data.collaborations ?? data.collabs ?? data)
        if (mounted) setCollabs(Array.isArray(list) ? list : [])
      } catch (err: any) {
        if (mounted) setError(err?.message ?? 'Failed to load collaborations')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchCollabs()

    // Poll for updates so brand sees changes when creator accepts
    const interval = setInterval(() => {
      fetchCollabs()
    }, 8000)

    // Refresh on tab focus to surface updates quickly
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchCollabs()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      mounted = false
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [username])

  console.log('Collabs:', collabs)
  const setFilterTo = (status: 'all' | 'active' | 'pending' | 'completed') => setFilter(status)

  const byStatus = (s: string) => collabs.filter(c => String(c.status ?? '').toLowerCase() === s.toLowerCase())
  const activeCollabs = byStatus('active')
  const pendingCollabs = byStatus('pending')
  const completedCollabs = byStatus('completed')

  const filtered =
    filter === 'all'
      ? collabs
      : filter === 'active'
      ? activeCollabs
      : filter === 'pending'
      ? pendingCollabs
      : completedCollabs

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setFilterTo('all')} style={{ background: filter === 'all' ? '#94a3b8' : '#e5e7eb', padding: '6px 12px', borderRadius: 6 }}>
          All ({collabs.length})
        </button>
        <button onClick={() => setFilterTo('active')} style={{ background: filter === 'active' ? '#0ea5e9' : '#e5e7eb', padding: '6px 12px', borderRadius: 6 }}>
          Active ({activeCollabs.length})
        </button>
        <button onClick={() => setFilterTo('pending')} style={{ background: filter === 'pending' ? '#f59e0b' : '#e5e7eb', padding: '6px 12px', borderRadius: 6 }}>
          Pending ({pendingCollabs.length})
        </button>
        <button onClick={() => setFilterTo('completed')} style={{ background: filter === 'completed' ? '#10b981' : '#e5e7eb', padding: '6px 12px', borderRadius: 6 }}>
          Completed ({completedCollabs.length})
        </button>
      </div>

      {loading && <div>Loading collaborations…</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!loading && !error && filtered.length === 0 && <div>No collaborations found.</div>}

      {filter === 'all' ? (
        <div>
          <h4 style={{ marginTop: 8 }}>Active</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {activeCollabs.map((c) => (
              <li key={c.id ?? c._id ?? JSON.stringify(c)} style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{c.title ?? c.name ?? 'Untitled Collaboration'}</div>
                <div style={{ fontSize: 13, color: '#555' }}>Status: {String(c.status)}</div>
                    {c.creator?.username && <div style={{ fontSize: 13, color: '#555' }}>Creator: {c.creator.username}</div>}
                {c.packageCollaborations?.[0]?.brandFeedback && (
                  <div style={{ fontSize: 13, color: c.status === 'PENDING' ? '#b7791f' : '#10b981', fontWeight: 600 }}>
                    {c.status === 'PENDING' ? `Improvements: ${c.packageCollaborations[0].brandFeedback}` : `Brand: ${c.packageCollaborations[0].brandFeedback}`}
                  </div>
                )}
                    {/* show if creator has uploaded a draft for this collaboration */}
                    {(c.packageCollaborations && (Array.isArray(c.packageCollaborations) && (c.packageCollaborations[0]?.contentDraft?.fileUrls?.length || c.packageCollaborations[0]?.draftSubmittedAt))) && (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ fontSize: 13, color: '#b7791f', fontWeight: 600 }}>Draft uploaded</div>
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
                        <a href={c.packageCollaborations[0].publishedContentUrl} target="_blank" rel="noreferrer" style={{ color: '#7b52d3', fontWeight: 600 }}>Published: {String(c.packageCollaborations[0].publishedContentUrl).slice(0, 40)}{String(c.packageCollaborations[0].publishedContentUrl).length > 40 ? '…' : ''}</a>
                      </div>
                    )}

                    {/* PAY button for active collabs (placeholder for Razorpay integration) */}
                    {String(c.status).toLowerCase() === 'active' && (
                      <div style={{ marginTop: 8 }}>
                        <button
                          onClick={async () => {
                            const id = c.id ?? c._id ?? '';
                            if (!id) return alert('Invalid collaboration id');
                            if (!username) return alert('Brand username not found');
                            setPayingIds(prev => [...prev, id]);
                            try {
                              // Placeholder: call backend to create payment / initiate Razorpay flow
                              const res = await fetch(`/api/brand2/${encodeURIComponent(username)}/collaborations/${encodeURIComponent(id)}/paycreator`, { method: 'POST' });
                              if (!res.ok) {
                                const d = await res.json().catch(() => ({}));
                                throw new Error(d?.error || res.statusText || 'Pay request failed');
                              }
                              const data = await res.json().catch(() => ({}));
                              // downstream: user will implement Razorpay flow using response
                              alert(data?.message ?? 'Payment initiation request sent — implement Razorpay flow');
                            } catch (err) {
                              console.error('Pay error', err);
                              alert(String((err as any)?.message || err));
                            } finally {
                              setPayingIds(prev => prev.filter(x => x !== id));
                            }
                          }}
                          disabled={payingIds.includes(String(c.id ?? c._id ?? ''))}
                          className="px-3 py-1 rounded bg-[#06b6d4] text-white text-sm"
                        >
                          {payingIds.includes(String(c.id ?? c._id ?? '')) ? 'Processing…' : 'PAY'}
                        </button>
                      </div>
                    )}
              </li>
            ))}
          </ul>

          <h4 style={{ marginTop: 12 }}>Pending</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {pendingCollabs.map((c) => (
              <li key={c.id ?? c._id ?? JSON.stringify(c)} style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{c.title ?? c.name ?? 'Untitled Collaboration'}</div>
                <div style={{ fontSize: 13, color: '#555' }}>Status: {String(c.status)}</div>
                {c.creator?.username && <div style={{ fontSize: 13, color: '#555' }}>Creator: {c.creator.username}</div>}
                {c.packageCollaborations?.[0]?.brandFeedback && (
                  <div style={{ fontSize: 13, color: c.status === 'PENDING' ? '#b7791f' : '#10b981', fontWeight: 600 }}>
                    {c.status === 'PENDING' ? `Improvements: ${c.packageCollaborations[0].brandFeedback}` : `Brand: ${c.packageCollaborations[0].brandFeedback}`}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <h4 style={{ marginTop: 12 }}>Completed</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {completedCollabs.map((c) => (
              <li key={c.id ?? c._id ?? JSON.stringify(c)} style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, marginBottom: 8 }}>
                <div style={{ fontWeight: 600 }}>{c.title ?? c.name ?? 'Untitled Collaboration'}</div>
                <div style={{ fontSize: 13, color: '#555' }}>Status: {String(c.status)}</div>
                {c.creator?.username && <div style={{ fontSize: 13, color: '#555' }}>Creator: {c.creator.username}</div>}
                {c.packageCollaborations?.[0]?.brandFeedback && (
                  <div style={{ fontSize: 13, color: c.status === 'PENDING' ? '#b7791f' : '#10b981', fontWeight: 600 }}>
                    {c.status === 'PENDING' ? `Improvements: ${c.packageCollaborations[0].brandFeedback}` : `Brand: ${c.packageCollaborations[0].brandFeedback}`}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filtered.map((c) => (
            <li key={c.id ?? c._id ?? JSON.stringify(c)} style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, marginBottom: 8 }}>
              <div style={{ fontWeight: 600 }}>{c.title ?? c.name ?? 'Untitled Collaboration'}</div>
              <div style={{ fontSize: 13, color: '#555' }}>Status: {String(c.status)}</div>
              {c.creator?.username && <div style={{ fontSize: 13, color: '#555' }}>Creator: {c.creator.username}</div>}
              {c.packageCollaborations?.[0]?.brandFeedback && (
                <div style={{ fontSize: 13, color: c.status === 'PENDING' ? '#b7791f' : '#10b981', fontWeight: 600 }}>
                  {c.status === 'PENDING' ? `Improvements: ${c.packageCollaborations[0].brandFeedback}` : `Brand: ${c.packageCollaborations[0].brandFeedback}`}
                </div>
              )}
              {(c.packageCollaborations && (Array.isArray(c.packageCollaborations) && (c.packageCollaborations[0]?.contentDraft?.fileUrls?.length || c.packageCollaborations[0]?.draftSubmittedAt))) && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ fontSize: 13, color: '#b7791f', fontWeight: 600 }}>Draft uploaded</div>
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
          <div className="absolute inset-0 bg-black/60" onClick={() => { setSelectedDraftDeal(null); setImproviseMessage(''); }} />
          <div className="relative bg-[#232946] rounded-2xl p-6 w-[min(720px,96%)] max-h-[85vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-white" onClick={() => { setSelectedDraftDeal(null); setImproviseMessage(''); }}>&times;</button>
            <h3 className="text-xl font-bold text-white mb-2">Draft — {selectedDraftDeal.brandName ?? selectedDraftDeal.title ?? selectedDraftDeal.packageTitle}</h3>
            <div className="text-sm text-gray-300 mb-4">Creator: {selectedDraftDeal.creator?.username ?? selectedDraftDeal.creatorUsername ?? ''}</div>
            <div className="space-y-3">
              {selectedDraftDeal.packageCollaborations?.[0]?.contentDraft?.fileUrls && selectedDraftDeal.packageCollaborations[0].contentDraft.fileUrls.length > 0 ? (
                selectedDraftDeal.packageCollaborations[0].contentDraft.fileUrls.map((url: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between bg-[#1b2330] p-3 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-sm">{url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? '🖼️' : '📎'}</div>
                      <div className="text-sm text-gray-200">File {idx + 1}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={url} target="_blank" rel="noreferrer" className="text-[#7b52d3] font-semibold">Open</a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No files available</div>
              )}
            </div>

            <div className="mt-6">
              {/* hide actions if draft already approved */}
              {!(selectedDraftDeal?.packageCollaborations?.[0]?.contentDraft?.approvedAt || selectedDraftDeal?.packageCollaborations?.[0]?.brandFeedback === 'Approved' || selectedDraftDeal?.packageCollaborations?.[0]?.contentStatus === 'APPROVED') ? (
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      if (!selectedDraftDeal) return;
                      const brandParts = window.location.pathname.split('/').filter(Boolean);
                      const brandIndex = brandParts.indexOf('brand');
                      const brandUsername = brandIndex !== -1 && brandParts.length > brandIndex + 1 ? brandParts[brandIndex + 1] : brandParts[1] ?? '';
                      const id = selectedDraftDeal.id ?? selectedDraftDeal._id ?? '';
                      if (!id) return alert('Invalid collaboration id');
                      setApprovingIds(prev => [...prev, id]);
                      try {
                        const res = await fetch(`/api/brand2/${encodeURIComponent(brandUsername)}/collaborations/${encodeURIComponent(id)}/approve`, { method: 'POST' });
                        if (!res.ok) {
                          const d = await res.json().catch(() => ({}));
                          throw new Error(d?.error || res.statusText || 'Approve failed');
                        }
                        const data = await res.json().catch(() => ({}));
                        const updated = data?.collaboration ?? data
                        if (updated && (updated.id || updated._id)) {
                          setCollabs(prev => prev.map(p => (p.id === updated.id || p._id === updated._id) ? updated : p));
                        }
                        setSelectedDraftDeal(null);
                        setImproviseMessage('');
                      } catch (err) {
                        console.error('Approve error', err);
                        alert(String((err as any)?.message || err));
                      } finally {
                        setApprovingIds(prev => prev.filter(x => x !== id));
                      }
                    }}
                    disabled={selectedDraftDeal ? approvingIds.includes(selectedDraftDeal.id ?? selectedDraftDeal._id ?? '') : false}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    {selectedDraftDeal && approvingIds.includes(selectedDraftDeal.id ?? selectedDraftDeal._id ?? '') ? 'Approving…' : 'Approve'}
                  </button>

                  <div className="flex-1">
                    <textarea
                      value={improviseMessage}
                      onChange={(e) => setImproviseMessage(e.target.value)}
                      placeholder="Request improvements / feedback"
                      className="w-full p-2 rounded bg-[#111827] text-white"
                      rows={3}
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={async () => {
                          if (!selectedDraftDeal) return;
                          const id = selectedDraftDeal.id ?? selectedDraftDeal._id ?? '';
                          if (!id) return alert('Invalid collaboration id');
                          const brandParts = window.location.pathname.split('/').filter(Boolean);
                          const brandIndex = brandParts.indexOf('brand');
                          const brandUsername = brandIndex !== -1 && brandParts.length > brandIndex + 1 ? brandParts[brandIndex + 1] : brandParts[1] ?? '';
                          setImproviseSubmittingId(id);
                          try {
                            const res = await fetch(`/api/brand2/${encodeURIComponent(brandUsername)}/collaborations/${encodeURIComponent(id)}/request-improvements`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ message: improviseMessage }),
                            });
                            if (!res.ok) {
                              const d = await res.json().catch(() => ({}));
                              throw new Error(d?.error || res.statusText || 'Request improvements failed');
                            }
                            const data = await res.json().catch(() => ({}));
                            const updated = data?.collaboration ?? data
                            if (updated && (updated.id || updated._id)) {
                              setCollabs(prev => prev.map(p => (p.id === updated.id || p._id === updated._id) ? updated : p));
                            }
                            setSelectedDraftDeal(null);
                            setImproviseMessage('');
                          } catch (err) {
                            console.error('Improvise error', err);
                            alert(String((err as any)?.message || err));
                          } finally {
                            setImproviseSubmittingId(null);
                          }
                        }}
                        disabled={!improviseMessage.trim() || improviseSubmittingId === (selectedDraftDeal?.id ?? selectedDraftDeal?._id)}
                        className="px-4 py-2 bg-yellow-500 text-black rounded"
                      >
                        {improviseSubmittingId === (selectedDraftDeal?.id ?? selectedDraftDeal?._id) ? 'Sending…' : 'Request Improvements'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-green-600 text-white rounded font-semibold">Approved</div>
                  {selectedDraftDeal?.packageCollaborations?.[0]?.contentDraft?.fileUrls?.[0] && (
                    <a href={selectedDraftDeal.packageCollaborations[0].contentDraft.fileUrls[0]} target="_blank" rel="noreferrer" className="text-[#7b52d3] font-semibold">View Published</a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Deals
