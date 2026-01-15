// components/brand/Profile/types.ts

export type BrandProfile = {
  id: string;
  userId: string;
  username: string;
  logoUrl?: string | null;
  bio?: string | null;
  industryTags?: string[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
  collaborations?: any[];
};
