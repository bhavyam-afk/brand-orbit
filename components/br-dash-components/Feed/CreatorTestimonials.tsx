"use client";

import CircularTestimonials from "@/components/ui/circular-testimonials";
import CustomPackageModal, { CustomPackageRequest } from "./CustomPackageModal";
import { Creator } from "./types";
import { useState } from "react";

interface Props {
  creators: Creator[];
  brandUsername: string;
  onSelectCreator: (creator: Creator) => void;
}

export default function CreatorTestimonials({
  creators,
  brandUsername,
  onSelectCreator,
}: Props) {
  const [showCustomPackageModal, setShowCustomPackageModal] = useState(false);
  const [selectedCreatorForCustom, setSelectedCreatorForCustom] = useState<Creator | null>(null);

  const testimonials = creators.map((creator) => ({
    src: creator.profilePicUrl ?? "/avatar-placeholder.png",
    name: `@${creator.username}`,
    designation: [
      creator.category,
      creator.niche,
      creator.location,
    ]
      .filter(Boolean)
      .join(" • "),
    quote: creator.nicheTags?.length
      ? `Specializes in ${creator.nicheTags.join(", ")}`
      : "Creator on BrandOrbit",
    creator, // 🔑 critical
  }));

  const handleRequestCustom = (item: any) => {
    setSelectedCreatorForCustom(item.creator);
    setShowCustomPackageModal(true);
  };

  const handleCustomPackageSubmit = async (data: CustomPackageRequest) => {
    console.log("Custom package request:", data);
    // TODO: Call API endpoint to save custom package request
    setShowCustomPackageModal(false);
    setSelectedCreatorForCustom(null);
  };

  return (
    <>
      <CircularTestimonials
        testimonials={testimonials}
        autoplay={false}
        primaryActionLabel="See Packages"
        viewPackage={(item: any) =>
          onSelectCreator(item.creator)
        }
        onRequestCustom={handleRequestCustom}
        customActionLabel="Request Custom"
      />
      {showCustomPackageModal && selectedCreatorForCustom && (
        <CustomPackageModal
          creator={selectedCreatorForCustom}
          brandUsername={brandUsername}
          onClose={() => {
            setShowCustomPackageModal(false);
            setSelectedCreatorForCustom(null);
          }}
          onSubmit={handleCustomPackageSubmit}
        />
      )}
    </>
  );
}
