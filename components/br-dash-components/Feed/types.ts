// components/brand/Feed/types.ts

export type Creator = {
  id: string;
  username: string;
  profilePicUrl?: string | null;
  category?: string | null;
  niche?: string | null;
  nicheTags?: string[];
  location?: string | null;
};

export type DraftInfo = {
  packageId: string;
  fileUrls: string[];
  submittedAt?: string;
};
