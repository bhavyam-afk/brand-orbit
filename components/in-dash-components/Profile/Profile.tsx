"use client";

import { useProfileData } from "./useProfileData";
import RecentCollabs from "./RecentCollabs";
import ProfileCard from "./ProfileCard";
import ProfileCharts from "./ProfileCharts";

export default function Profile() {
  const { loading, data, collaborations, earningsMonths, earningsTotals, followersTotals } = useProfileData();
  if (loading) {
    return <div className="text-center py-8">Loading profile...</div>;
  }
  if (!data) {
    return <div className="text-center py-8">No profile data available</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">

      <div className="profilecard mx-4 h-full">
        <ProfileCard data={data} />
      </div>

      <div className="collab flex flex-col gap-6">
        <RecentCollabs data={data} collaborations={collaborations} />
        <ProfileCharts months={earningsMonths} earnings={earningsTotals} followers={followersTotals} />
      </div>

    </div>
  );
}
