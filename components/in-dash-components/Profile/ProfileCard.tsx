import React from 'react'
import ProfileData from '../../../types/ProfileData';

function ProfileCard({data}: {data: ProfileData}) {
  const username = data?.username ?? '—';
  const logo = data?.profilePicUrl ?? null;
  const bio = data?.bio ?? '';
  const tags: string[] = Array.isArray(data?.nicheTags) ? data.nicheTags : [];
  const location = data?.location ?? data?.platformLinks?.find?.((s: any) => s.platform === 'location')?.url;
  const website = data?.platformLinks?.find?.((s: any) => s.platform === 'website')?.url;

  return (
    <div className="bg-[#0b1220] rounded-2xl p-6 shadow w-full">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-yellow-300 bg-gray-800 flex-shrink-0">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-yellow-300">🏷️</div>
          )}
        </div>

        <div className="flex-1">
          <div className="text-xl font-bold text-yellow-300">@{username}</div>
          {bio && <div className="text-sm text-gray-300 mt-1">{bio}</div>}

          <div className="mt-2 flex flex-wrap gap-3 items-center text-sm">
            {location && (
              <div className="text-gray-400 flex items-center gap-1">📍 <span className="text-yellow-300">{location}</span></div>
            )}
            {website && (
              <a href={website} target="_blank" rel="noreferrer" className="text-xs text-blue-300 underline">Website</a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm font-semibold text-gray-300 mb-2">Niche Tags</div>
        <div className="flex flex-wrap gap-2">
          {tags.length > 0 ? (
            tags.map((t) => (
              <span key={t} className="text-xs bg-yellow-300/10 text-yellow-300 px-2 py-1 rounded">{t}</span>
            ))
          ) : (
            <span className="text-xs text-gray-500">No tags</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
