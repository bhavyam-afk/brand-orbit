"use client";

import { usePackages } from "./usePackages";
import PackageForm from "./PackageForm";
import ActivePackages from "./ActivePackages";
import DraftPackages from "./DraftPackages";
import { AvailabilityCalendar } from "./Calendar";

export default function ListPackages() {
  const { loading, packages, showForm, openForm, closeForm, createPackage, updateStatus, canActivateDraft } = usePackages();

  return (
    <div className="flex flex-col items-center p-8 gap-6">

      <div className="w-full flex justify-center mb-4">
        <button onClick={openForm} className="px-4 py-2 bg-[#7b52d3] text-white rounded-xl">
          Add package
        </button>
      </div>

      {showForm && ( <PackageForm onClose={closeForm} onCreate={createPackage} /> )}

      {loading && <div className="text-sm text-gray-500">Loading packages…</div>}

      <div className="flex flex-row gap-6 w-full">
        <ActivePackages packages={packages} onSetDraft={(id) => updateStatus(id, "DRAFT")} />
        <DraftPackages packages={packages} canActivate={canActivateDraft} onActivate={(id) => updateStatus(id, "ACTIVE")} onDelete={(id) => updateStatus(id, "DELETED")} />
      </div>

      <div className="w-full max-w-[520px]">
        <div className="bg-[#232946] rounded-2xl shadow-lg p-6">
          <div className="text-lg font-semibold text-white mb-4 text-center">
            Availability Calendar
          </div>
          <AvailabilityCalendar />
        </div>
      </div>

    </div>
  );
}
