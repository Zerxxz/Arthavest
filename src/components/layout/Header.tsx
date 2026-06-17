"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
  Wifi,
  WifiOff,
} from "lucide-react";
import { shortAddress, formatIDR, formatSUI } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { useHybridWallet } from "@/lib/sui/useHybridWallet";

export type NavTab = "marketplace" | "investor" | "owner" | "how" | "architecture" | "secondary" | "dao" | "onboarding";

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: "marketplace", label: "Marketplace" },
  { id: "investor", label: "Portfolio" },
  { id: "owner", label: "Dashboard UMKM" },
  { id: "secondary", label: "Sekunder" },
  { id: "dao", label: "DAO Jury" },
  { id: "onboarding", label: "Onboard UMKM" },
  { id: "how", label: "Cara Kerja" },
  { id: "architecture", label: "Arsitektur Sui" },
];

export function Header() {
  const wallet = useAppStore((s) => s.wallet);
  const connectWallet = useAppStore((s) => s.connectWallet);
  const disconnectWallet = useAppStore((s) => s.disconnectWallet);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const { hasExtension, isRealWallet } = useHybridWallet();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            className="flex items-center gap-2.5 group"
            onClick={() => setActiveTab("marketplace")}
          >
            <div className="relative h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-glow-emerald">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-primary/40"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-base font-bold tracking-tight">SahamKita</span>
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                {isRealWallet ? (
                  <>
                    <Wifi className="h-2.5 w-2.5 text-emerald-500" />
                    Sui Testnet · Live
                  </>
                ) : (
                  <>
                    <WifiOff className="h-2.5 w-2.5 text-amber-500" />
                    Demo mode · Sui Testnet ready
                  </>
                )}
              </span>
            </div>
          </button>

          {/* Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Wallet */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {wallet.connected ? (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2"
                >
                  {/* Balance pill */}
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/60">
                    <span className="text-xs font-medium text-muted-foreground">SUI</span>
                    <span className="text-xs font-bold">{wallet.suiBalance.toFixed(2)}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/60">
                    <span className="text-xs font-medium text-muted-foreground">IDR</span>
                    <span className="text-xs font-bold">{formatIDR(wallet.idrBalance, { compact: true })}</span>
                  </div>

                  {/* Address dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 h-9">
                        {wallet.viaZkLogin ? (
                          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Wallet className="h-3.5 w-3.5 text-primary" />
                        )}
                        <span className="text-xs font-mono">
                          {shortAddress(wallet.address)}
                        </span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Wallet terhubung</span>
                        <span className="text-xs font-mono break-all">{wallet.address}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                        {wallet.viaZkLogin ? (
                          <span className="flex items-center gap-1.5 text-primary">
                            <ShieldCheck className="h-3.5 w-3.5" /> zkLogin via {wallet.provider}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5" /> Ethos Wallet
                          </span>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Saldo SUI</span>
                          <span className="font-medium">{formatSUI(wallet.suiBalance)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Saldo IDR</span>
                          <span className="font-medium">{formatIDR(wallet.idrBalance)}</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={disconnectWallet} className="text-destructive focus:text-destructive">
                        <LogOut className="h-3.5 w-3.5 mr-2" />
                        Putuskan koneksi
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ) : (
                <motion.div
                  key="disconnected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="gap-2 h-9 shadow-glow-emerald">
                        <Zap className="h-3.5 w-3.5" />
                        Hubungkan Wallet
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-72">
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Pilih metode login
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => connectWallet("google")} className="gap-3 py-2.5">
                        <div className="h-7 w-7 rounded-full bg-white border flex items-center justify-center text-xs font-bold">G</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Google (zkLogin)</div>
                          <div className="text-[10px] text-muted-foreground">Tanpa install wallet</div>
                        </div>
                        <Badge variant="secondary" className="text-[9px]">Recommended</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => connectWallet("twitch")} className="gap-3 py-2.5">
                        <div className="h-7 w-7 rounded-full bg-purple-100 border flex items-center justify-center text-xs font-bold">T</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Twitch (zkLogin)</div>
                          <div className="text-[10px] text-muted-foreground">Untuk kreator konten</div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => connectWallet("ethos")} className="gap-3 py-2.5">
                        <div className="h-7 w-7 rounded-full bg-primary/10 border flex items-center justify-center">
                          <Wallet className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Ethos Wallet</div>
                          <div className="text-[10px] text-muted-foreground">Wallet native Sui</div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="lg:hidden flex items-center gap-1 overflow-x-auto scrollbar-warm pb-2 -mx-1 px-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
