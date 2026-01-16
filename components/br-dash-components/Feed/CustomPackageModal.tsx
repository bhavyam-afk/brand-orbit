"use client";

import React, { useState } from "react";
import { Creator } from "./types";
import { X } from "lucide-react";

type Props = {
  creator: Creator;
  brandUsername: string;
  onClose: () => void;
  onSubmit: (data: CustomPackageRequest) => void | Promise<void>;
};

export interface CustomPackageRequest {
  creatorId: string;
  title: string;
  description: string;
  budget: string;
  deliveryTimeDays: string;
  deliverables: string;
}

type FormState = {
  title: string;
  description: string;
  budget: string;
  deliveryTimeDays: string;
  deliverables: string;
};

const initialForm: FormState = {
  title: "",
  description: "",
  budget: "",
  deliveryTimeDays: "",
  deliverables: "",
};

export default function CustomPackageModal({
  creator,
  brandUsername,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.budget || !form.deliverables) {
      alert("Title, budget, and deliverables are required");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/brand2/collaborations/${brandUsername}/custom-package-req", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandUsername,
          creatorUsername: creator.username,
          title: form.title.trim(),
          description: form.description.trim(),
          budget: parseFloat(form.budget), // Convert to number
          deliveryTimeDays: form.deliveryTimeDays || "0",
          deliverables: form.deliverables.trim(), // Send as string, API will parse
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to send request");
        return;
      }

      await onSubmit({
        creatorId: creator.id,
        title: form.title.trim(),
        description: form.description.trim(),
        budget: form.budget,
        deliveryTimeDays: form.deliveryTimeDays || "0",
        deliverables: form.deliverables.trim(),
      });

      setForm(initialForm);
      alert("Custom package request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Request Custom Package
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Send a custom collaboration request to{" "}
              <span className="font-semibold">@{creator.username}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Creator Info Card */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6 border border-purple-100">
          <div className="flex items-center gap-3">
            <img
              src={creator.profilePicUrl || "/avatar-placeholder.png"}
              alt={creator.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">
                @{creator.username}
              </p>
              <p className="text-xs text-gray-600">
                {[creator.category, creator.niche]
                  .filter(Boolean)
                  .join(" • ")}
              </p>
            </div>
          </div>
        </div>

        {/* Package Title */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Package Title *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Instagram Reel Campaign, Brand Story Series"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your campaign goals, brand message, and any specific details..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>

        {/* Budget & Timeline */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Budget (₹) *
            </label>
            <input
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="Enter budget"
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Delivery Timeline (days)
            </label>
            <input
              name="deliveryTimeDays"
              value={form.deliveryTimeDays}
              onChange={handleChange}
              placeholder="e.g., 7, 14, 30"
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Deliverables */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deliverables *
          </label>
          <textarea
            name="deliverables"
            value={form.deliverables}
            onChange={handleChange}
            placeholder="List what you need (e.g., 3 Instagram Reels, 1 TikTok video, 1 static post, 2 stories)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition"
          >
            {submitting ? "Sending..." : "Send Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
