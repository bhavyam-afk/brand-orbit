import { BrandProfile, CampaignCollaboration, PackageCollaboration } from "@prisma/client";

export type DealStatus = "ACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED";

export interface Deal {
  id: string;
  creatorId: string;
  brandId: string;
  packageId: string;
  campaignId?: string;
  collabType: string;
  collabstatus: DealStatus;
  createdAt: string;
  updatedAt: string;
  packageCollaborations?: PackageCollaboration[];
  campaignCollaborations?: CampaignCollaboration[];
  brand: BrandProfile;
  package: {
    price: number;
    title: string;
  };
}
