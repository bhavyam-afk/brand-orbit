"use client";

// price was x when brand booked but the creator went and increased it to y handle this logic as we are adding to collab from package table only. 
import React, { useEffect, useState } from "react";
import { AvailabilityCalendar } from "./Calendar";
import { PackageStatus } from "@prisma/client";

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
  owner?: string;
};

const ListPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ title: string; description: string; price: string; deliveryTimeDays: string; thumbnailUrl: string; mediaType: string; deliverables: string }>(
    { title: '', description: '', price: '', deliveryTimeDays: '', thumbnailUrl: '', mediaType: '', deliverables: '' }
  );


  useEffect(() => {
    const username = window.location.pathname.split("/")[2];
    if (!username) return;

    async function fetchcalls() {
      try {
        // Fetch packages
        const res = await fetch(`/api/influencer/${username}/packages`);
        const json = await res.json();
        const pkgs = Array.isArray(json?.packages) ? json.packages : [];
        setPackages(pkgs);
      } catch (err) {
        console.error('Failed to fetch packages', err);
      } finally {
        setLoading(false);
      }
    }
    fetchcalls();
  }, []);


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

        try {
        // decide whether new package should be ACTIVE or DRAFT based on current active packages
        let first2: string = 'ACTIVE';
        const activeCount = packages.filter(p => (p.status || '').toUpperCase() === 'ACTIVE').length;
        if (activeCount >= 2) {
          first2 = 'DRAFT';
        }
        const res = await fetch(`/api/influencer/${username}/packages`, {
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
            packagestatus: first2,
          }),
        });
        if (!res.ok) throw new Error('Failed to create package');
        const json = await res.json();
        const created = json.package;

        // normalize created package so frontend filters/rendering work even if backend shape changed
        const normalized = {
          id: created?.id ?? String(Math.random()),
          title: created?.title ?? created?.name ?? form.title, 
          description: created?.description ?? created?.desc ?? form.description,
          price: created?.price ?? created?.amount ?? form.price,
          deliveryTimeDays: created?.deliveryTimeDays || 0,
          thumbnailUrl: created?.thumbnailUrl ?? created?.thumbnail ?? created?.thumb ?? form.thumbnailUrl ?? null,
          mediaType: created?.mediaType ?? created?.type ?? form.mediaType ?? null,
          deliverables: created?.deliverables ?? created?.deliverables_list ?? (form.deliverables ? form.deliverables.split(',').map(s => s.trim()) : []),
          status: (created?.status ?? created?.packagestatus ?? created?.packageStatus ?? first2 ?? 'DRAFT') as string,
          owner: created?.owner ?? created?.user ?? username,
          ...created,
        } as Package;

        setPackages(prev => [...prev, normalized]);
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


  async function updatePackageStatus(pkgId: string, newStatus: string) {
    const prev = packages;
    setPackages(prev.map(p => p.id === pkgId ? { ...p, status: newStatus } : p));
    try {
      const username = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : '';
      const res = await fetch(`/api/influencer/${username}/packages/${pkgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update package');
    } catch (err) {
      console.error('update package status failed', err);
      setPackages(prev); // revert
      alert('Failed to update package status');
    }
  }

  function canActivateDraft() {
    return packages.filter(p => (p.status || '').toUpperCase() === 'ACTIVE').length < 2;
  }


  return (
    <>
      <div className="flex flex-row gap-6 justify-center p-8">

        <div className="w-full h-full flex flex-col items-center justify-center p-8">
          <div className="mx-auto align-middle">
            {loading && <div className="mb-4 text-sm text-gray-500">Loading packages…</div>}

            <div className="mb-4 flex justify-end">
              <button onClick={handleAddClick} className="px-4 py-2 bg-[#7b52d3] text-white rounded-xl">Add package</button>
            </div>


            <div className="w-full h-full flex flex-col gap-6">

              {showForm && (
                <div className="package_form fixed inset-0 z-50 flex items-center justify-center" style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} >
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
                </div>
              )}

              <div className="flex flex-row gap-6">
                <>
                  {packages.filter(p => (p.status || '').toUpperCase() === 'ACTIVE').slice(0, 2).map((pkg) => (
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
                          <button onClick={() => updatePackageStatus(pkg.id, 'DRAFT')} className="px-3 py-1 rounded-md bg-yellow-100 text-sm">Set Draft</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col w-80">
                    <div className="text-lg font-semibold mb-2">Draft Packages</div>
                    {packages.filter(p => (p.status || '').toUpperCase() === 'DRAFT').length === 0 && (
                      <div className="p-4 bg-white rounded shadow text-sm text-gray-500">No drafts</div>
                    )}
                    {packages.filter(p => (p.status || '').toUpperCase() === 'DRAFT').map((draft) => (
                      <div key={draft.id} className="bg-white rounded p-3 mb-2 shadow flex items-center justify-between">
                        <div>
                          <div className="font-medium">{draft.title}</div>
                          <div className="text-xs text-gray-500">{draft.mediaType ?? ''}</div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              if (!canActivateDraft()) {
                                alert('There are already 2 active packages. Please set one active package to draft first.');
                                return;
                              }
                              updatePackageStatus(draft.id, 'ACTIVE');
                            }}
                            className="px-3 py-1 rounded-md bg-green-600 text-white text-sm"
                          >
                            Activate
                          </button>
                          <button onClick={() => updatePackageStatus(draft.id, 'DELETED')} className="px-3 py-1 rounded-md bg-red-100 text-sm">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              </div>

              <div className="flex flex-row gap-6 mt-2 w-full justify-center items-center">
                <div className="flex-1 min-h-[180px] bg-[#232946] rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center max-w-[520px]">
                  <div className="text-lg font-semibold text-white mb-4 text-center">Availability Calendar</div>
                  <AvailabilityCalendar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListPackages;

