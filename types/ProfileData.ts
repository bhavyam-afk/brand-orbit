import { Transaction } from "@prisma/client";

export default interface ProfileData {
  username: string;
  bio: string | null;
  location: string | null;
  niche: string | null;
  profilePicUrl: string | null;
  nicheTags: string[];
  category: string | null;
  platformLinks: any | null;
  rating: number | 0;
  collaborations?: any[];
  incomingTransactions?: Transaction[];
  outgoingTransactions?: Transaction[];
} 