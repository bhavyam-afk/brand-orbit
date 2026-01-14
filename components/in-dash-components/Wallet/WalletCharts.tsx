"use client";

import { Bar } from "react-chartjs-2";

type Props = {
  months: string[];
  earnings: number[];
};

export function WalletCharts({ months, earnings }: Props) {
  return (
    <div className="p-6 bg-white/5 rounded-xl">
      <h2 className="text-xl font-bold mb-4 text-[#7b52d3]">
        Earnings Overview
      </h2>

      <div style={{ height: 240 }}>
        <Bar
          data={{
            labels: months,
            datasets: [
              {
                label: "Earnings (₹)",
                data: earnings,
                backgroundColor: "rgba(34,211,238,0.9)",
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>
    </div>
  );
}
