import React from "react";

type Plan = {
  id: string;
  name: string; // package display name
  price: string; // price string (currency included)
  billing?: string; // billing period or one-off
  features: string[]; // package-focused features
  popular?: boolean;
};

// Package-centric offerings for MVP: features focus on creator allowances, posts, onboarding
const plans: Plan[] = [
  {
    id: "basic",
    name: "BASIC PACKAGE",
    price: "₹0",
    billing: "Forever free",
    features: ["1 creator seat", "Up to 5 posts / month", "Basic analytics", "Community support"],
  },
  {
    id: "pro",
    name: "PRO PACKAGE",
    price: "₹1,999",
    billing: "per month",
    features: ["Up to 5 creator seats", "Up to 50 posts / month", "Advanced analytics", "Priority email support", "Onboarding call"],
    popular: true,
  },
  {
    id: "premium",
    name: "PREMIUM PACKAGE",
    price: "₹4,999",
    billing: "per month",
    features: ["Unlimited creator seats", "Unlimited posts", "Full reporting + CSV export", "Dedicated account manager", "Campaign strategy support"],
  },
];

export default function Plans() {
  return (
    <section className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-extrabold text-[#2b2b3a] mb-4">Choose a Package</h2>
      <p className="text-gray-600 mb-8">Package-centric pricing focused on creators and campaign limits — MVP offerings.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative bg-white rounded-xl p-6 shadow-md flex flex-col justify-between border ${p.popular ? "border-indigo-500" : "border-transparent"}`}
          >
            {p.popular && (
              <div className="absolute -top-3 right-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</div>
            )}

            <div>
              <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
              <div className="mt-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-gray-900">{p.price}</span>
                  {p.billing && <span className="text-sm text-gray-500">{p.billing}</span>}
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-gray-600">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 5 11.586a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l9-9a1 1 0 00-1.414-1.414L8.414 17.586 6.414 15.586 16.707 5.293z" clipRule="evenodd" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <button
                className={`w-full py-3 rounded-md font-semibold ${p.popular ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-[#f1f1f6] text-gray-800 hover:bg-gray-200"}`}
                aria-label={`Select ${p.name}`}
              >
                Select Package
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
