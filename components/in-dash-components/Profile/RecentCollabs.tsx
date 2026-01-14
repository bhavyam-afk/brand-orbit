export default function RecentCollabs({ data, collaborations }: any) {
  const username = data?.username ?? "—";
  const collabs = Array.isArray(collaborations) ? collaborations : [];

  return (
    <div className="w-full sm:min-w-[320px] sm:max-w-[400px] bg-cyan-500 rounded-2xl p-6 sm:p-8">
      <div className="text-2xl font-bold">@{username}</div>

      <div className="mt-6">
        <div className="font-semibold mb-2">Last {collabs.length} Collaboration(s)</div>

        <div className="flex flex-wrap gap-3">
          {collabs.length === 0 && <div className="text-white/80">No collaborations yet</div>}
          {collabs.map((c: any) => (
            <div key={c.id} className="bg-white/90 rounded-xl p-3 w-28 text-center shadow-sm">
              <div className="text-sm font-bold">@{c?.brand?.username ?? c?.creatorName ?? '—'}</div>
              <div className="text-xs text-gray-600">
                {c?.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
