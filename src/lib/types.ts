// Tipe data inti untuk SahamKita + SuiStream

export type UMKMCategory =
  | "kuliner"
  | "kopi"
  | "laundry"
  | "kerajinan"
  | "jasa"
  | "pertanian";

export interface UMKM {
  id: string;
  name: string;
  tagline: string;
  category: UMKMCategory;
  location: string;
  ownerName: string;
  establishedYear: number;
  description: string;
  // Financial metrics (in IDR)
  monthlyRevenue: number;
  monthlyProfit: number;
  valuation: number;
  // Shares
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  // Visual
  gradient: string; // tailwind gradient class
  emoji: string;
  // Stream
  profitDistributionDay: number; // day of month when profit is distributed
  apyEstimate: number; // estimated annual yield %
  // Risk
  riskLevel: "rendah" | "sedang" | "tinggi";
  // Verification
  verifiedKyc: boolean;
  documentsHash: string; // Walrus blob ID (mock)
  // Performance history (last 6 months revenue)
  revenueHistory: { month: string; revenue: number; profit: number }[];
}

export interface Stream {
  id: string;
  umkmId: string;
  umkmName: string;
  investorAddress: string;
  sharesOwned: number;
  // Stream rate
  ratePerSecond: number; // in IDR
  totalAmount: number; // total amount to be streamed
  startTime: number; // unix ms
  endTime: number; // unix ms
  withdrawnAmount: number;
  // PTB tx digest (mock)
  txDigest: string;
  // Status
  status: "active" | "completed" | "paused";
  // Visualization seed
  particleColor: string;
}

export interface InvestorPosition {
  umkmId: string;
  sharesOwned: number;
  avgBuyPrice: number;
  totalInvested: number;
  totalWithdrawn: number;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  // Mock balances
  suiBalance: number;
  idrBalance: number;
  // zkLogin flag
  viaZkLogin: boolean;
  provider: "google" | "twitch" | "ethos" | null;
}

export interface SuiFeature {
  id: string;
  name: string;
  icon: string;
  description: string;
  usedIn: string;
  benefit: string;
}
