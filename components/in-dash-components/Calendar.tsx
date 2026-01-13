"use client";

import { useEffect, useState } from "react";

export function AvailabilityCalendar() {
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

      const res = await fetch(`/api/influencer/${username}/availability?start=${iso(start)}&end=${iso(end)}`);
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
      const res = await fetch(`/api/influencer/${username}/availability`, {
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