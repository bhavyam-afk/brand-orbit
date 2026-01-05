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
        const list = Array.isArray(data) ? data : (data.collabs ?? data)
        if (mounted) setCollabs(list)
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
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Deals
