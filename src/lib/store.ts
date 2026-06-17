import { create } from "zustand";
import type { UMKM, Stream, InvestorPosition, WalletState } from "./types";
import { generateTxDigest } from "./format";

// ===== MOCK DATA: UMKM Indonesia =====
const MOCK_UMKM: UMKM[] = [
  {
    id: "umkm-001",
    name: "Kopi Senja",
    tagline: "Spesialti coffee roastery dari Bandung",
    category: "kopi",
    location: "Bandung, Jawa Barat",
    ownerName: "Andi Pratama",
    establishedYear: 2021,
    description:
      "Roastery spesialti yang mengolah biji kopi dari petani lokal Garut dan Aceh. Memiliki 2 outlet kafe dan supply ke 12 kafe lain di Bandung. Sedang ekspansi ke 3 outlet baru dengan model ghost kitchen.",
    monthlyRevenue: 145_000_000,
    monthlyProfit: 28_000_000,
    valuation: 1_800_000_000,
    totalShares: 1800,
    availableShares: 642,
    pricePerShare: 1_000_000,
    gradient: "from-amber-200 via-orange-300 to-rose-300",
    emoji: "☕",
    profitDistributionDay: 5,
    apyEstimate: 18.7,
    riskLevel: "sedang",
    verifiedKyc: true,
    documentsHash: "walrus_b1x9af...k3p7",
    revenueHistory: [
      { month: "Jan", revenue: 98_000_000, profit: 18_500_000 },
      { month: "Feb", revenue: 112_000_000, profit: 21_800_000 },
      { month: "Mar", revenue: 105_000_000, profit: 19_400_000 },
      { month: "Apr", revenue: 128_000_000, profit: 24_100_000 },
      { month: "Mei", revenue: 134_000_000, profit: 25_700_000 },
      { month: "Jun", revenue: 145_000_000, profit: 28_000_000 },
    ],
  },
  {
    id: "umkm-002",
    name: "Warung Bu Tini",
    tagline: "Penyedia catering & nasi kotak Jakarta",
    category: "kuliner",
    location: "Jakarta Selatan, DKI Jakarta",
    ownerName: "Tini Wahyuni",
    establishedYear: 2019,
    description:
      "Catering rumahan yang sudah melayani 80+ kantor dan acara per bulan. Punya dapur pusat di Pasar Minggu dan 5 unit food truck. Sedang upgrade cold storage untuk doubling kapasitas.",
    monthlyRevenue: 96_000_000,
    monthlyProfit: 19_500_000,
    valuation: 1_200_000_000,
    totalShares: 1200,
    availableShares: 318,
    pricePerShare: 1_000_000,
    gradient: "from-rose-200 via-red-300 to-orange-300",
    emoji: "🍱",
    profitDistributionDay: 10,
    apyEstimate: 19.5,
    riskLevel: "sedang",
    verifiedKyc: true,
    documentsHash: "walrus_m2z4qr...n8t1",
    revenueHistory: [
      { month: "Jan", revenue: 72_000_000, profit: 13_800_000 },
      { month: "Feb", revenue: 78_000_000, profit: 15_200_000 },
      { month: "Mar", revenue: 81_000_000, profit: 16_400_000 },
      { month: "Apr", revenue: 85_000_000, profit: 17_100_000 },
      { month: "Mei", revenue: 90_000_000, profit: 18_200_000 },
      { month: "Jun", revenue: 96_000_000, profit: 19_500_000 },
    ],
  },
  {
    id: "umkm-003",
    name: "Bersih Kilat Laundry",
    tagline: "Jaringan laundry kilat 24 jam",
    category: "laundry",
    location: "Surabaya, Jawa Timur",
    ownerName: "Budi Santoso",
    establishedYear: 2020,
    description:
      "Jaringan laundry self-service 24 jam dengan 8 outlet di Surabaya. Memakai mesin industrial dan sistem IoT untuk monitoring real-time. Sedang ekspansi ke Sidoarjo dan Gresik.",
    monthlyRevenue: 78_000_000,
    monthlyProfit: 17_200_000,
    valuation: 950_000_000,
    totalShares: 950,
    availableShares: 0,
    pricePerShare: 1_000_000,
    gradient: "from-teal-200 via-cyan-300 to-emerald-300",
    emoji: "🧺",
    profitDistributionDay: 8,
    apyEstimate: 21.7,
    riskLevel: "rendah",
    verifiedKyc: true,
    documentsHash: "walrus_p7v3bn...q5r2",
    revenueHistory: [
      { month: "Jan", revenue: 58_000_000, profit: 12_800_000 },
      { month: "Feb", revenue: 62_000_000, profit: 13_700_000 },
      { month: "Mar", revenue: 65_000_000, profit: 14_300_000 },
      { month: "Apr", revenue: 70_000_000, profit: 15_400_000 },
      { month: "Mei", revenue: 74_000_000, profit: 16_300_000 },
      { month: "Jun", revenue: 78_000_000, profit: 17_200_000 },
    ],
  },
  {
    id: "umkm-004",
    name: "Bakso Pak Joko",
    tagline: "Franchise bakso legendaris sejak 1998",
    category: "kuliner",
    location: "Solo, Jawa Tengah",
    ownerName: "Joko Susilo",
    establishedYear: 1998,
    description:
      "Bakso Pak Joko sudah berjualan 25+ tahun dengan resep turun temurun. Saat ini punya 1 gerai utama dan 4 gerai franchise. Dana riset untuk frozen bakso distribusi nasional.",
    monthlyRevenue: 65_000_000,
    monthlyProfit: 14_800_000,
    valuation: 780_000_000,
    totalShares: 780,
    availableShares: 215,
    pricePerShare: 1_000_000,
    gradient: "from-orange-200 via-amber-300 to-yellow-300",
    emoji: "🍲",
    profitDistributionDay: 12,
    apyEstimate: 22.8,
    riskLevel: "rendah",
    verifiedKyc: true,
    documentsHash: "walrus_k9p2lm...t6w8",
    revenueHistory: [
      { month: "Jan", revenue: 52_000_000, profit: 11_800_000 },
      { month: "Feb", revenue: 55_000_000, profit: 12_400_000 },
      { month: "Mar", revenue: 57_000_000, profit: 12_900_000 },
      { month: "Apr", revenue: 60_000_000, profit: 13_600_000 },
      { month: "Mei", revenue: 62_000_000, profit: 14_100_000 },
      { month: "Jun", revenue: 65_000_000, profit: 14_800_000 },
    ],
  },
  {
    id: "umkm-005",
    name: "Keripik Tempe Ibu Sum",
    tagline: "Oleh-oleh khas Malang ekspor nasional",
    category: "kerajinan",
    location: "Malang, Jawa Timur",
    ownerName: "Sumarni",
    establishedYear: 2017,
    description:
      "Produsen keripik tempe dengan kapasitas 500 pack/hari. Sudah ekspor ke 6 kota via marketplace. Sedang bangun PABRIK baru 3x lipat kapasitas untuk penetrasi modern retail (Indomaret, Alfamart).",
    monthlyRevenue: 42_000_000,
    monthlyProfit: 9_800_000,
    valuation: 520_000_000,
    totalShares: 520,
    availableShares: 187,
    pricePerShare: 1_000_000,
    gradient: "from-lime-200 via-green-300 to-emerald-300",
    emoji: "🥬",
    profitDistributionDay: 15,
    apyEstimate: 22.6,
    riskLevel: "sedang",
    verifiedKyc: true,
    documentsHash: "walrus_j4f7qr...b2m9",
    revenueHistory: [
      { month: "Jan", revenue: 28_000_000, profit: 6_500_000 },
      { month: "Feb", revenue: 32_000_000, profit: 7_400_000 },
      { month: "Mar", revenue: 35_000_000, profit: 8_100_000 },
      { month: "Apr", revenue: 38_000_000, profit: 8_800_000 },
      { month: "Mei", revenue: 40_000_000, profit: 9_300_000 },
      { month: "Jun", revenue: 42_000_000, profit: 9_800_000 },
    ],
  },
  {
    id: "umkm-006",
    name: "Kebun Organik Lestari",
    tagline: "Sayur organik subscription box",
    category: "pertanian",
    location: "Cianjur, Jawa Barat",
    ownerName: "Dewi Lestari",
    establishedYear: 2022,
    description:
      "Kebun organik 2 hektar dengan 80+ subscriber box sayur mingguan. Sedang bangun greenhouse untuk produksi microgreens premium yang di-supply ke hotel & restoran bintang 5 di Jakarta.",
    monthlyRevenue: 38_000_000,
    monthlyProfit: 9_200_000,
    valuation: 480_000_000,
    totalShares: 480,
    availableShares: 134,
    pricePerShare: 1_000_000,
    gradient: "from-emerald-200 via-teal-300 to-green-300",
    emoji: "🌱",
    profitDistributionDay: 20,
    apyEstimate: 23.0,
    riskLevel: "tinggi",
    verifiedKyc: true,
    documentsHash: "walrus_n5d8kp...x1y3",
    revenueHistory: [
      { month: "Jan", revenue: 22_000_000, profit: 5_200_000 },
      { month: "Feb", revenue: 26_000_000, profit: 6_100_000 },
      { month: "Mar", revenue: 30_000_000, profit: 7_000_000 },
      { month: "Apr", revenue: 32_000_000, profit: 7_600_000 },
      { month: "Mei", revenue: 35_000_000, profit: 8_400_000 },
      { month: "Jun", revenue: 38_000_000, profit: 9_200_000 },
    ],
  },
];

// ===== MOCK: Investor positions (asumsi user sudah invest di 3 UMKM) =====
const INITIAL_POSITIONS: InvestorPosition[] = [
  {
    umkmId: "umkm-001",
    sharesOwned: 25,
    avgBuyPrice: 1_000_000,
    totalInvested: 25_000_000,
    totalWithdrawn: 4_350_000,
  },
  {
    umkmId: "umkm-004",
    sharesOwned: 18,
    avgBuyPrice: 1_000_000,
    totalInvested: 18_000_000,
    totalWithdrawn: 3_120_000,
  },
  {
    umkmId: "umkm-006",
    sharesOwned: 12,
    avgBuyPrice: 1_000_000,
    totalInvested: 12_000_000,
    totalWithdrawn: 2_180_000,
  },
];

// ===== MOCK: Active streams to investor =====
function buildInitialStreams(): Stream[] {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  return [
    {
      id: "stream-001",
      umkmId: "umkm-001",
      umkmName: "Kopi Senja",
      investorAddress: "0xuser",
      sharesOwned: 25,
      // Total profit bulanan = 28jt * (25/1800) = 388.888  → dibagi 30 hari = 12.963/day
      // ratePerSecond = 12.963 / 86400 ≈ 0.15 IDR/sec
      ratePerSecond: 0.15,
      totalAmount: 388_889,
      startTime: now - dayInMs * 4, // started 4 days ago
      endTime: now + dayInMs * 26, // ends in 26 days
      withdrawnAmount: 50_000,
      txDigest: "8a3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
      status: "active",
      particleColor: "#0d9488",
    },
    {
      id: "stream-002",
      umkmId: "umkm-004",
      umkmName: "Bakso Pak Joko",
      investorAddress: "0xuser",
      sharesOwned: 18,
      // 14.8jt * (18/780) = 341.538 / 30 = 11.385/day → 0.132 IDR/sec
      ratePerSecond: 0.132,
      totalAmount: 341_538,
      startTime: now - dayInMs * 6,
      endTime: now + dayInMs * 24,
      withdrawnAmount: 75_000,
      txDigest: "1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      status: "active",
      particleColor: "#f59e0b",
    },
    {
      id: "stream-003",
      umkmId: "umkm-006",
      umkmName: "Kebun Organik Lestari",
      investorAddress: "0xuser",
      sharesOwned: 12,
      // 9.2jt * (12/480) = 230.000 / 30 = 7.667/day → 0.089 IDR/sec
      ratePerSecond: 0.089,
      totalAmount: 230_000,
      startTime: now - dayInMs * 2,
      endTime: now + dayInMs * 28,
      withdrawnAmount: 0,
      txDigest: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
      status: "active",
      particleColor: "#10b981",
    },
  ];
}

// ===== ZUSTAND STORE =====
interface AppState {
  // Wallet
  wallet: WalletState;
  connectWallet: (provider: "google" | "twitch" | "ethos") => void;
  disconnectWallet: () => void;

  // UMKM
  umkms: UMKM[];
  getUMKM: (id: string) => UMKM | undefined;

  // Investor positions
  positions: InvestorPosition[];

  // Streams
  streams: Stream[];
  withdrawFromStream: (streamId: string, amount: number) => void;
  buyShares: (umkmId: string, shares: number) => { success: boolean; message: string };
  distributeProfits: (umkmId: string) => { success: boolean; txDigest: string; investorCount: number; totalDistributed: number };

  // UI state
  activeTab: "marketplace" | "investor" | "owner" | "how" | "architecture";
  setActiveTab: (tab: "marketplace" | "investor" | "owner" | "how" | "architecture") => void;
  selectedUMKMId: string | null;
  setSelectedUMKM: (id: string | null) => void;
  buyModalOpen: boolean;
  setBuyModalOpen: (open: boolean) => void;
  distributeModalOpen: boolean;
  setDistributeModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  wallet: {
    connected: false,
    address: null,
    suiBalance: 0,
    idrBalance: 0,
    viaZkLogin: false,
    provider: null,
  },
  connectWallet: (provider) => {
    const mockAddr =
      "0x" +
      Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0"),
      ).join("") +
      "..." +
      Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0"),
      ).join("");
    set({
      wallet: {
        connected: true,
        address: mockAddr,
        suiBalance: 142.8,
        idrBalance: 75_000_000,
        viaZkLogin: provider === "google" || provider === "twitch",
        provider,
      },
    });
  },
  disconnectWallet: () =>
    set({
      wallet: {
        connected: false,
        address: null,
        suiBalance: 0,
        idrBalance: 0,
        viaZkLogin: false,
        provider: null,
      },
    }),

  umkms: MOCK_UMKM,
  getUMKM: (id) => get().umkms.find((u) => u.id === id),

  positions: INITIAL_POSITIONS,
  streams: buildInitialStreams(),

  withdrawFromStream: (streamId, amount) => {
    set((state) => ({
      streams: state.streams.map((s) =>
        s.id === streamId
          ? { ...s, withdrawnAmount: s.withdrawnAmount + amount }
          : s,
      ),
      wallet: {
        ...state.wallet,
        idrBalance: state.wallet.idrBalance + amount,
      },
    }));
  },

  buyShares: (umkmId, shares) => {
    const state = get();
    const umkm = state.umkms.find((u) => u.id === umkmId);
    if (!umkm) return { success: false, message: "UMKM tidak ditemukan" };
    if (shares <= 0) return { success: false, message: "Jumlah saham harus > 0" };
    if (shares > umkm.availableShares) {
      return { success: false, message: `Hanya ${umkm.availableShares} saham tersedia` };
    }
    const cost = shares * umkm.pricePerShare;
    if (cost > state.wallet.idrBalance) {
      return { success: false, message: `Saldo IDR tidak cukup (butuh Rp ${cost.toLocaleString("id-ID")})` };
    }

    // Update UMKM available shares
    const newUmkms = state.umkms.map((u) =>
      u.id === umkmId ? { ...u, availableShares: u.availableShares - shares } : u,
    );

    // Update or create position
    const existingPos = state.positions.find((p) => p.umkmId === umkmId);
    let newPositions: InvestorPosition[];
    if (existingPos) {
      const newTotalShares = existingPos.sharesOwned + shares;
      const newTotalInvested = existingPos.totalInvested + cost;
      newPositions = state.positions.map((p) =>
        p.umkmId === umkmId
          ? {
              ...p,
              sharesOwned: newTotalShares,
              totalInvested: newTotalInvested,
              avgBuyPrice: newTotalInvested / newTotalShares,
            }
          : p,
      );
    } else {
      newPositions = [
        ...state.positions,
        {
          umkmId,
          sharesOwned: shares,
          avgBuyPrice: umkm.pricePerShare,
          totalInvested: cost,
          totalWithdrawn: 0,
        },
      ];
    }

    set({
      umkms: newUmkms,
      positions: newPositions,
      wallet: {
        ...state.wallet,
        idrBalance: state.wallet.idrBalance - cost,
      },
    });

    return {
      success: true,
      message: `Berhasil beli ${shares} saham ${umkm.name} seharga Rp ${cost.toLocaleString("id-ID")}. PTB tx atomik terkonfirmasi.`,
    };
  },

  distributeProfits: (umkmId) => {
    const state = get();
    const umkm = state.umkms.find((u) => u.id === umkmId);
    if (!umkm) return { success: false, txDigest: "", investorCount: 0, totalDistributed: 0 };

    // Mock: asumsi ada 47-312 investor tergantung UMKM
    const investorCount = Math.floor(umkm.totalShares * 0.18) + 12;
    const totalDistributed = umkm.monthlyProfit;
    const txDigest = generateTxDigest();

    // Update existing stream milik user (kalau ada posisi)
    const userPos = state.positions.find((p) => p.umkmId === umkmId);
    if (userPos) {
      const userShare = (userPos.sharesOwned / umkm.totalShares) * umkm.monthlyProfit;
      const dayInMs = 24 * 60 * 60 * 1000;
      const now = Date.now();
      // rate per second for 30-day stream
      const ratePerSecond = userShare / (30 * 86400);

      const existingStreamIdx = state.streams.findIndex((s) => s.umkmId === umkmId);
      let newStreams: Stream[];
      const newStream: Stream = {
        id: `stream-${Date.now()}`,
        umkmId: umkm.id,
        umkmName: umkm.name,
        investorAddress: "0xuser",
        sharesOwned: userPos.sharesOwned,
        ratePerSecond,
        totalAmount: userShare,
        startTime: now,
        endTime: now + dayInMs * 30,
        withdrawnAmount: 0,
        txDigest: generateTxDigest(),
        status: "active",
        particleColor: umkm.id === "umkm-001" ? "#0d9488" : umkm.id === "umkm-004" ? "#f59e0b" : "#10b981",
      };

      if (existingStreamIdx >= 0) {
        // replace existing
        newStreams = state.streams.map((s, i) => (i === existingStreamIdx ? newStream : s));
      } else {
        newStreams = [...state.streams, newStream];
      }
      set({ streams: newStreams });
    }

    return {
      success: true,
      txDigest,
      investorCount,
      totalDistributed,
    };
  },

  activeTab: "marketplace",
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedUMKMId: null,
  setSelectedUMKM: (id) => set({ selectedUMKMId: id }),
  buyModalOpen: false,
  setBuyModalOpen: (open) => set({ buyModalOpen: open }),
  distributeModalOpen: false,
  setDistributeModalOpen: (open) => set({ distributeModalOpen: open }),
}));
