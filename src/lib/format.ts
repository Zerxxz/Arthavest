// Format helpers untuk currency IDR, SUI, time, dll

export function formatIDR(value: number, options?: { compact?: boolean }): string {
  if (options?.compact) {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(2)} M`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)} jt`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)} rb`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatSUI(value: number): string {
  return `${value.toLocaleString("en-US", { maximumFractionDigits: 4 })} SUI`;
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("id-ID", { maximumFractionDigits: decimals });
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function shortAddress(addr: string | null): string {
  if (!addr) return "";
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function timeRemaining(endTime: number): string {
  const now = Date.now();
  const diff = endTime - now;
  if (diff <= 0) return "Selesai";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `${days}h ${hours}j`;
  if (hours > 0) return `${hours}j ${minutes}m`;
  return `${minutes}m`;
}

export function elapsedPercent(startTime: number, endTime: number): number {
  const now = Date.now();
  const total = endTime - startTime;
  const elapsed = now - startTime;
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, (elapsed / total) * 100));
}

// Mock: hitung jumlah yang sudah ter-accrue di stream
export function accruedAmount(stream: {
  ratePerSecond: number;
  startTime: number;
  endTime: number;
  withdrawnAmount: number;
}): number {
  const now = Date.now();
  const elapsedSec = Math.max(0, (now - stream.startTime) / 1000);
  const totalAccrued = elapsedSec * stream.ratePerSecond;
  const capped = Math.min(totalAccrued, stream.totalAmount);
  return Math.max(0, capped - stream.withdrawnAmount);
}

const MONTH_NAMES_ID = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];

export function getMonthLabel(monthIndex: number): string {
  return MONTH_NAMES_ID[monthIndex] ?? "";
}

export function generateTxDigest(): string {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < 64; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
