// types.ts

// ------------------
// Creator
// ------------------
export interface Creator {
  id: string;
  username: string;
  category?: string | null;
  niche?: string | null;
  location?: string | null;
  nicheTags?: string[] | null;
  profilePicUrl?: string | null;
  bio?: string | null;
}

// ------------------
// Creator Package
// ------------------
export interface CreatorPackage {
  id: string;
  creatorId: string;
  title: string;
  description?: string | null;
  price?: number | string;
}

// ------------------
// Draft Info
// ------------------
export interface DraftInfo {
  packageId: string;
  fileUrls: string[];
  submittedAt?: string;
  brandFeedback?: string | null;
}
