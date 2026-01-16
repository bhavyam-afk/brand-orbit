"use client";

import CreatorTestimonials from "./CreatorTestimonials";
import { useState } from "react";
import PackagesModal from "./PackagesModal";
import DraftViewerModal from "./DraftViewerModal";
import { useBrandFeed } from "./useBrandFeed";

export default function BrandFeed() {
  const {
    creators,
    loading,
    error,

    // package modal
    modalOpen,
    selectedCreator,
    creatorPackages,
    pkgsLoading,
    openPackages,
    closeModal,
    requestPackage,
    requestingPackageId,
    requestedPackageIds,
    activePackageIds,
    draftedPackageIds,

    // draft viewer
    selectedDraft,
    setSelectedDraft,
    draftedFilesMap,
    
    // brand username
    getBrandUsername,
  } = useBrandFeed();
  const [requestError, setRequestError] = useState<string | null>(null);
  
  const brandUsername = getBrandUsername() || "";


  if (loading) return <div className="p-6">Loading creators…</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <>
      {/* 🎯 SINGLE CREATOR FOCUS */}
      <CreatorTestimonials
        creators={creators}
        brandUsername={brandUsername}
        onSelectCreator={openPackages}
      />

      {/* 📦 PACKAGE MODAL */}
      {modalOpen && selectedCreator && (
        <PackagesModal
          creator={selectedCreator}
          creatorPackages={creatorPackages}
          pkgsLoading={pkgsLoading}
          onClose={closeModal}
          requestPackage={requestPackage}
          requestingPackageId={requestingPackageId}
          requestedPackageIds={requestedPackageIds}
          activePackageIds={activePackageIds}
          draftedPackageIds={draftedPackageIds}
          draftedFilesMap={draftedFilesMap}
          requestError={requestError}
          selectedDraft={selectedDraft}
          setSelectedDraft={setSelectedDraft}
        />

      )}

      {/* 📝 DRAFT VIEWER */}
      {selectedDraft && (
        <DraftViewerModal
          draft={selectedDraft}
          onClose={() => setSelectedDraft(null)}
        />
      )}
    </>
  );
}
