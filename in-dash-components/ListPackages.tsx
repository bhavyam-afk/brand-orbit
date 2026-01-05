"use client";

import React, { useEffect, useState } from "react";
type Package = {
  id: string;
  title: string;
  description?: string | null;
  price: string | number; // Prisma Decimal becomes a string when serialized
  deliveryTimeDays?: number;
  thumbnailUrl?: string | null;
  mediaType?: string | null;
  deliverables?: string[] | null;
  status?: string;
};

interface ListPackagesProps {
  // If packages are provided by the parent, use them; otherwise this component will
  // try to fetch packages from /api/packages (best-effort).
  packages?: Package[];
  fetchUrl?: string;
}


const ListPackages: React.FC<ListPackagesProps> = ({ packages: initialPackages = [], fetchUrl = '/api/influencer2/:username/packages' }) => {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ title: string; description: string; price: string; deliveryTimeDays: string; thumbnailUrl: string; mediaType: string; deliverables: string }>(
    { title: '', description: '', price: '', deliveryTimeDays: '', thumbnailUrl: '', mediaType: '', deliverables: '' }
  );

  useEffect(() => {
    // If parent gave packages, don't fetch. Otherwise try to fetch from API.
    if (initialPackages && initialPackages.length > 0) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(fetchUrl);
        if (!res.ok) return;
        const data = await res.json();
        // Expect data.packages or data
        const pkgs = data.packages ?? data;
        if (mounted && Array.isArray(pkgs)) setPackages(pkgs);
      } catch {
        // ignore - we keep the empty defaults
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [initialPackages, fetchUrl]);

  // load incoming package requests (for the creator) to show in right panel
  useEffect(() => {
    let mounted = true;
    const loadRequests = async () => {
      setRequestsLoading(true);
      try {
        const username = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';
        if (!username) return;
        // endpoint expected: /api/influencer2/:username/requests
        const res = await fetch(`/api/influencer2/${username}/requests`);
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data.requests) ? data.requests : (Array.isArray(data) ? data : []);
        if (mounted) setRequests(list);
      } catch (err) {
        // ignore
      } finally {
        if (mounted) setRequestsLoading(false);
      }
    };
    loadRequests();
    return () => { mounted = false; };
  }, []);

  const handleRequestAction = async (id: string, action: 'accept' | 'reject') => {
    // optimistic update
    setRequests(prev => prev.map(r => r.id === id ? { ...r, _processing: true } : r));
    try {
      const username = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';
      if (!username) throw new Error('Missing username');
      const res = await fetch(`/api/influencer2/${username}/requests/${id}/${action}`, { method: 'POST' });
      if (!res.ok) throw new Error('Request failed');
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('request action failed', err);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, _processing: false } : r));
    }
  };
  // Use packages array; page supports zero packages initially
  const displayPackages = packages && packages.length > 0 ? packages : [];
  const pkg1: Package | null = displayPackages[0] ?? null;
  const pkg2: Package | null = displayPackages[1] ?? null;

  // Right-side requests panel state (incoming brand requests to this creator)
  const [requests, setRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const formatPrice = (p: string | number) => {
    const num = typeof p === 'string' ? Number(p) : p;
    if (Number.isNaN(num)) return `₹${p}`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target as HTMLInputElement;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm({ title: '', description: '', price: '', deliveryTimeDays: '', thumbnailUrl: '', mediaType: '', deliverables: '' });
  }

  function handleAddClick() {
    setShowForm(true);
  }

  function handleCancel() {
    resetForm();
    setShowForm(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    (async () => {
      const username = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';
      if (!username) {
        // fallback to local behavior
        const id = `pkg_${Date.now()}`;
        const newPkg: Package = {
          id,
          title: form.title || 'Untitled Package',
          description: form.description || '',
          price: form.price || '0',
          deliveryTimeDays: form.deliveryTimeDays ? Number(form.deliveryTimeDays) : 0,
          thumbnailUrl: form.thumbnailUrl || null,
          mediaType: form.mediaType || 'Other',
          deliverables: form.deliverables ? form.deliverables.split(',').map(s => s.trim()) : [],
          status: 'DRAFT',
        };
        setPackages(prev => [newPkg, ...prev]);
        resetForm();
        setShowForm(false);
        return;
      }

      try {
        const res = await fetch(`/api/influencer2/${username}/packages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            price: form.price,
            deliveryTimeDays: form.deliveryTimeDays ? Number(form.deliveryTimeDays) : 0,
            thumbnailUrl: form.thumbnailUrl,
            mediaType: form.mediaType,
            deliverables: form.deliverables ? form.deliverables.split(',').map(s => s.trim()) : [],
            status: 'DRAFT',
          }),
        });
        if (!res.ok) throw new Error('Failed to create package');
        const json = await res.json();
        const created = json.package;
        setPackages(prev => [...prev, created]);
      } catch (err) {
        console.error('create package failed', err);
      } finally {
        resetForm();
        setShowForm(false);
      }
    })();
  }
  function handleEdit() {
    alert('Edit package - to be implemented');
  }
  function handleDuplicate() {
    alert('Duplicate package - to be implemented');
  }
  function handleHide() {
    alert('Hide package - to be implemented');
  }


  return (
    <>
      <div className="flex flex-row gap-6 justify-center p-8">

        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          <div className="mx-auto align-middle">
            {loading && <div className="mb-4 text-sm text-gray-500">Loading packages…</div>}


            <div className="w-full h-full flex flex-col gap-6">

              {showForm && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Package title" className="flex-1 px-3 py-2 border rounded" />
                    <input name="mediaType" value={form.mediaType} onChange={handleChange} placeholder="Media type (e.g. Instagram Post)" className="flex-1 px-3 py-2 border rounded" />
                  </div>
                  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description" className="w-full mt-3 px-3 py-2 border rounded" />
                  <div className="flex gap-2 mt-3">
                    <input name="price" value={form.price} onChange={handleChange} placeholder="Price (INR)" className="px-3 py-2 border rounded w-32" />
                    <input name="deliveryTimeDays" value={form.deliveryTimeDays} onChange={handleChange} placeholder="Delivery days" className="px-3 py-2 border rounded w-32" />
                    <input name="thumbnailUrl" value={form.thumbnailUrl} onChange={handleChange} placeholder="Thumbnail URL" className="flex-1 px-3 py-2 border rounded" />
                  </div>
                  <input name="deliverables" value={form.deliverables} onChange={handleChange} placeholder="Deliverables (comma separated)" className="w-full mt-3 px-3 py-2 border rounded" />
                  <div className="flex gap-2 mt-3">
                    <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-[#7b52d3] text-white rounded">Save package</button>
                    <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded">Cancel</button>
                  </div>
                </form>
              )}


              <div className="flex flex-row gap-6">
                {displayPackages.length === 0 ? (
                  <div className="flex-1 bg-white rounded-2xl shadow p-8 flex flex-col items-center justify-center min-h-[180px]">
                    <div className="text-lg font-semibold mb-2">No packages to display</div>
                    {packages.length < 2 && (
                      <button onClick={handleAddClick} className="mt-3 px-4 py-2 bg-[#7b52d3] text-white rounded-xl">Add package</button>
                    )}
                  </div>
                ) : (

                  <>
                    {displayPackages.slice(0, 2).map((pkg) => (
                      <div key={pkg.id} className="flex-1 min-w-[320px] max-w-[420px] bg-white rounded-2xl shadow p-6 flex flex-row gap-4 items-start">
                        <img src={pkg.thumbnailUrl ?? '/placeholder1.jpg'} alt={pkg.title} className="h-20 w-20 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="text-lg font-semibold mb-1 text-gray-900">{pkg.title}</div>
                          <div className="text-sm text-gray-600 mb-2">{pkg.description}</div>
                          <div className="text-sm text-gray-500 mb-2">{pkg.mediaType ?? (pkg.deliverables ? pkg.deliverables.join(', ') : '')}</div>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-[#7b52d3]">{formatPrice(pkg.price ?? '')}</div>
                            <div className="text-xs text-gray-500">{pkg.deliveryTimeDays ? `${pkg.deliveryTimeDays} days` : '—'}</div>
                          </div>
                          <div className="mt-3 flex gap-2">
                            <button onClick={handleEdit} className="px-3 py-1 rounded-md bg-gray-100 text-sm">Edit</button>
                            <button onClick={handleDuplicate} className="px-3 py-1 rounded-md bg-gray-100 text-sm">Duplicate</button>
                            <button onClick={handleHide} className="px-3 py-1 rounded-md bg-gray-100 text-sm">Hide</button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {packages.length < 2 && (
                      <div className="flex flex-col justify-start items-center min-w-[180px]">
                        <button onClick={handleAddClick} className="w-full px-4 py-3 bg-transparent border-2 border-[#7b52d3] text-[#7b52d3] rounded-xl font-semibold shadow hover:bg-[#7b52d3] hover:text-white transition mb-2">Add package</button>
                      </div>
                    )}
                  </>

                )}
              </div>

              <div className="flex flex-row gap-6 mt-2 w-full">
                <div className="flex-1 min-h-[180px] bg-[#232946] rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center max-w-[420px]">
                  <div className="text-lg font-semibold text-white mb-2 text-center">Most Requested Package</div>
                  <div className="text-base text-[#7b52d3] font-bold mb-1">{pkg1?.title ?? '—'}</div>
                  <div className="text-sm text-gray-300 mb-2">{pkg1?.description ?? ''}</div>
                  <div className="text-xs text-gray-400 mb-2">Type: {pkg1?.mediaType ?? (pkg1?.deliverables ? pkg1.deliverables!.join(', ') : '—')}</div>
                  <div className="text-xs text-gray-400 mb-2">Rebooking Rate: <span className="text-green-400 font-bold">—</span></div>
                </div>

                <div className="flex-1 min-h-[180px] bg-[#232946] rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center max-w-[520px]">
                  <div className="text-lg font-semibold text-white mb-4 text-center">Availability Calendar</div>
                  <AvailabilityCalendar />
                </div>
              </div>
            </div>
          </div>
        </div>
          {/* Right-side vertical requests panel */}
              <aside className="p-8" style={{ width: 320, marginTop: 16 }}>
                <div className="bg-white/5 rounded-2xl p-4 shadow border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-white">Package Requests</div>
                    <div className="text-xs text-gray-400">{requests.length}</div>
                  </div>

                  {requestsLoading && <div className="text-sm text-gray-400">Loading requests…</div>}
                  {!requestsLoading && requests.length === 0 && <div className="text-sm text-gray-400">No requests yet</div>}

                  <div className="space-y-3">
                    {requests.map((r) => (
                      <div key={r.id} className="bg-[#0b1220] p-3 rounded-lg border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-white">{r.brandName ?? r.brand?.username ?? 'Brand'}</div>
                            <div className="text-xs text-gray-400">{r.message ?? r.note ?? r.packageTitle ?? 'Request for package'}</div>
                          </div>
                          <div className="text-sm font-bold text-[#7b52d3]">{r.amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(r.amount)) : ''}</div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button disabled={r._processing} onClick={() => handleRequestAction(r.id, 'accept')} className="px-3 py-1 rounded bg-green-500 text-white text-sm">Accept</button>
                          <button disabled={r._processing} onClick={() => handleRequestAction(r.id, 'reject')} className="px-3 py-1 rounded bg-red-500 text-white text-sm">Reject</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
      </div>
    </>
  );
};

export default ListPackages;

// --- Availability Calendar component (local to this file) ---
function AvailabilityCalendar() {
  const [current, setCurrent] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, string>>({});
  const [pendingMap, setPendingMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const addDays = (d: Date, n: number) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + n);
    return nd;
  };

  // calculate month range: start = first day of month, end = first day of next month
  const fetchForMonth = async (monthStart: Date) => {
    setLoading(true);
    try {
      const start = new Date(monthStart);
      const end = new Date(monthStart);
      end.setMonth(end.getMonth() + 1);

      const username = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';
      if (!username) return;

      const res = await fetch(`/api/influencer2/${username}/availability?start=${iso(start)}&end=${iso(end)}`);
      if (!res.ok) return;
      const json = await res.json();
      const map: Record<string, string> = {};
      (json.availability || []).forEach((a: any) => {
        // a.date may be ISO string
        const d = new Date(a.date);
        map[iso(d)] = a.status;
      });
      setAvailabilityMap(map);
    } catch (err) {
      console.error('fetch availability failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForMonth(current);
  }, [current]);

  // generate a 7x6 grid starting from the sunday on/ before month start
  const generateGrid = (monthStart: Date) => {
    const start = new Date(monthStart);
    const weekday = start.getDay();
    const gridStart = addDays(start, -weekday);
    const cells: Date[] = [];
    for (let i = 0; i < 42; i++) cells.push(addDays(gridStart, i));
    return cells;
  };

  const cells = generateGrid(current);

  const onDateClick = async (d: Date) => {
    const username = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';
    if (!username) return;
    const id = iso(d);
    // Toggle sequence: UNAVAILABLE -> TENTATIVE -> AVAILABLE -> UNAVAILABLE
    const current = availabilityMap[id] || 'AVAILABLE';
    const next = current === 'UNAVAILABLE' ? 'TENTATIVE' : current === 'TENTATIVE' ? 'AVAILABLE' : 'UNAVAILABLE';

    // prevent double clicks
    setPendingMap(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`/api/influencer2/${username}/availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: id, status: next, reason: 'Manual toggle' }),
      });
      if (!res.ok) throw new Error('Failed to update availability');
      const json = await res.json();
      const avail = json.availability;
      if (avail) {
        const dStr = iso(new Date(avail.date));
        setAvailabilityMap(prev => ({ ...prev, [dStr]: avail.status }));
      } else {
        setAvailabilityMap(prev => ({ ...prev, [id]: next }));
      }
    } catch (err) {
      console.error('upsert failed', err);
    } finally {
      setPendingMap(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const prevMonth = () => setCurrent(d => { const nd = new Date(d); nd.setMonth(nd.getMonth() - 1); return nd; });
  const nextMonth = () => setCurrent(d => { const nd = new Date(d); nd.setMonth(nd.getMonth() + 1); return nd; });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-200">{current.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="px-2 py-1 bg-white/10 rounded">◀</button>
          <button onClick={nextMonth} className="px-2 py-1 bg-white/10 rounded">▶</button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-300 mb-2">Loading availability…</div>}

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-xs text-center text-gray-400 py-1">{d}</div>
        ))}

        {cells.map((c, i) => {
          const isCurrentMonth = c.getMonth() === current.getMonth();
          const id = iso(c);
          const status = availabilityMap[id] || 'AVAILABLE';
          let bg = 'bg-green-200';
          if (status === 'UNAVAILABLE') bg = 'bg-red-400 text-white';
          if (status === 'TENTATIVE') bg = 'bg-yellow-300';
          return (
            <button
              key={i}
              onClick={() => onDateClick(c)}
              disabled={!!pendingMap[id]}
              className={`h-10 flex items-center justify-center text-sm rounded ${isCurrentMonth ? '' : 'opacity-40'} ${bg} ${pendingMap[id] ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {c.getDate()}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2 mt-2 text-xs text-gray-300">
        <div className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-green-200 rounded" /> Available</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-red-400 rounded" /> Busy</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 inline-block bg-yellow-300 rounded" /> Tentative</div>
      </div>
    </div>
  );
}
