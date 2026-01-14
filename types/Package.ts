export type Package = {
  id: string;
  title: string;
  description?: string | null;
  price: string | number;
  deliveryTimeDays?: number;
  thumbnailUrl?: string | null;
  mediaType?: string | null;
  deliverables?: string[];
  status: "ACTIVE" | "DRAFT" | "DELETED";
};