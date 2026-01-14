"use client";

import React, { useState } from "react";
import { Package } from "@/types/Package";

type Props = {
  onClose: () => void;
  onCreate: (pkg: Omit<Package, "id" | "status">) => void | Promise<void>;
};

type FormState = {
  title: string;
  description: string;
  price: string;
  deliveryTimeDays: string;
  thumbnailUrl: string;
  mediaType: string;
  deliverables: string;
};

const initialForm: FormState = {
  title: "",
  description: "",
  price: "",
  deliveryTimeDays: "",
  thumbnailUrl: "",
  mediaType: "",
  deliverables: "",
};

export default function PackageForm({ onClose, onCreate }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.price) {
      alert("Title and price are required");
      return;
    }

    setSubmitting(true);

    onCreate({
      title: form.title.trim(),
      description: form.description.trim(),
      price: form.price,
      deliveryTimeDays: Number(form.deliveryTimeDays) || 0,
      thumbnailUrl: form.thumbnailUrl || null,
      mediaType: form.mediaType || null,
      deliverables: form.deliverables ? form.deliverables.split(",").map(d => d.trim()) : [],
    });

    setSubmitting(false);
    setForm(initialForm);

  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Create New Package
        </h2>

        {/* Row 1 */}
        <div className="flex gap-3 mb-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Package title"
            className="flex-1 px-3 py-2 border rounded-lg"
            required
          />
          <input
            name="mediaType"
            value={form.mediaType}
            onChange={handleChange}
            placeholder="Media type (Instagram Reel)"
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short description"
          className="w-full px-3 py-2 border rounded-lg mb-3"
          rows={3}
        />

        {/* Row 2 */}
        <div className="flex gap-3 mb-3">
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (₹)"
            className="w-32 px-3 py-2 border rounded-lg"
            required
          />
          <input
            name="deliveryTimeDays"
            value={form.deliveryTimeDays}
            onChange={handleChange}
            placeholder="Delivery days"
            className="w-32 px-3 py-2 border rounded-lg"
          />
          <input
            name="thumbnailUrl"
            value={form.thumbnailUrl}
            onChange={handleChange}
            placeholder="Thumbnail URL"
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Deliverables */}
        <input
          name="deliverables"
          value={form.deliverables}
          onChange={handleChange}
          placeholder="Deliverables (comma separated)"
          className="w-full px-3 py-2 border rounded-lg mb-4"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-[#7b52d3] text-white font-medium hover:bg-[#5f3fb2]"
          >
            {submitting ? "Saving..." : "Save Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
