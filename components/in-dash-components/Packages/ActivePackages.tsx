import PackageCard from "./PackageCard";
import { Package } from "@/types/Package";

export default function ActivePackages({
  packages,
  onSetDraft,
}: {
  packages: Package[];
  onSetDraft: (id: string) => void;
}) {
  return (
    <>
      {packages
        .filter(p => p.status === "ACTIVE")
        .slice(0, 2)
        .map(pkg => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            actionLabel="Set Draft"
            onAction={() => onSetDraft(pkg.id)}
          />
        ))}
    </>
  );
}
