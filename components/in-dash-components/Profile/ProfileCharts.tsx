import { Bar } from "react-chartjs-2";
import ProfileHeader from "./RecentCollabs";
import { useProfileData } from "./useProfileData";

type Props = {
    months: string[];
    earnings: number[];
    followers: number[];
    titles?: [string, string];
};

export default function ProfileCharts({ months, earnings, followers, titles = ["Earnings Growth", "Followers Growth"] }: Props) {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
    };
    const { data, collaborations } = useProfileData();

    // Two square chart boxes with headings inside each box (top-left)
    return (
        <div className="flex flex-row gap-6">
            <div className="w-[350px] bg-gray-900 rounded-2xl p-4 aspect-square overflow-hidden relative">
                <h4 className="absolute top-3 left-3 text-sm font-semibold text-gray-200">{titles[0]}</h4>
                <div className="h-full w-full pt-8">
                    <Bar
                        data={{ labels: months, datasets: [{ data: earnings, backgroundColor: "#22d3ee" }] }}
                        options={chartOptions}
                    />
                </div>
            </div>

            <div className="w-[350px] bg-gray-900 rounded-2xl p-4 aspect-square overflow-hidden relative">
                <h4 className="absolute top-3 left-3 text-sm font-semibold text-gray-200">{titles[1]}</h4>
                <div className="h-full w-full pt-8">
                    <Bar
                        data={{ labels: months, datasets: [{ data: followers, backgroundColor: "#6366f1" }] }}
                        options={chartOptions}
                    />
                </div>
            </div>
        </div>
    );
}
