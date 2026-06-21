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
  ShieldCheck,
  Zap,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Languages,
  Check,
  AlertTriangle,
} from "lucide-react";
import { shortAddress, formatIDR, formatSUI } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { useHybridWallet } from "@/lib/sui/useHybridWallet";
import { useTranslation } from "@/lib/useTranslation";
import { useTheme } from "next-themes";
import { LANGUAGES } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export type NavTab = "marketplace" | "investor" | "owner" | "how" | "architecture" | "secondary" | "dao" | "onboarding";

function useNavItems() {
  const { t } = useTranslation();
  return [
    { id: "marketplace" as NavTab, label: t("nav.marketplace") },
    { id: "investor" as NavTab, label: t("nav.portfolio") },
    { id: "owner" as NavTab, label: t("nav.owner") },
    { id: "secondary" as NavTab, label: t("nav.secondary") },
    { id: "dao" as NavTab, label: t("nav.dao") },
    { id: "onboarding" as NavTab, label: t("nav.onboarding") },
    { id: "how" as NavTab, label: t("nav.how") },
    { id: "architecture" as NavTab, label: t("nav.architecture") },
  ];
}

export function Header() {
  const wallet = useAppStore((s) => s.wallet);
  const disconnectWallet = useAppStore((s) => s.disconnectWallet);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const { hasExtension, isRealWallet, isWrongNetwork, activeNetwork } = useHybridWallet();
  const { t, lang, setLang } = useTranslation();
  const NAV_ITEMS = useNavItems();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const _currentAccount = useCurrentAccount(); // Subscribe to account changes so wallet UI syncs
  // Mount flag — needed because next-themes theme is undefined on first SSR render.
  // Use useLayoutEffect to set before paint, avoiding visible flash.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const isDark = mounted && theme === "dark";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            className="flex items-center gap-2.5 group"
            onClick={() => setActiveTab("marketplace")}
          >
            {/* Circular logo icon (custom brand mark) */}
            <div className="relative h-12 w-12 rounded-full bg-white shadow-glow-emerald overflow-hidden flex-shrink-0 ring-1 ring-border/40">
              <img
                src="/logo-icon.png"
                alt="Arthavest logo"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Wordmark logo (Arthavest text) */}
            <div className="flex flex-col items-start leading-none">
              <img
                src="/logo-wordmark.png"
                alt="Arthavest"
                className="h-10 w-auto object-contain"
              />
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-1">
                {isRealWallet ? (
                  isWrongNetwork ? (
                    <>
                      <AlertTriangle className="h-2.5 w-2.5 text-rose-500" />
                      <span className="text-rose-600 font-semibold">
                        Wrong network: {activeNetwork} — switch to TESTNET
                      </span>
                    </>
                  ) : (
                    <>
                      <Wifi className="h-2.5 w-2.5 text-emerald-500" />
                      {t("header.liveTestnet")}
                    </>
                  )
                ) : (
                  <>
                    <WifiOff className="h-2.5 w-2.5 text-amber-500" />
                    {t("header.demoMode")}
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

          {/* Theme toggle + Language switcher + Wallet */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label={isDark ? t("header.themeLight") : t("header.themeDark")}
              title={isDark ? t("header.themeLight") : t("header.themeDark")}
            >
              {mounted && (isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              ))}
            </Button>

            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9" aria-label={t("header.language")} title={t("header.language")}>
                  <Languages className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {t("header.language")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className="gap-2 py-2"
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="flex-1 text-sm">{l.native}</span>
                    {lang === l.code && <Check className="h-3.5 w-3.5 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
                    <span className="text-xs font-medium text-muted-foreground">{t("header.balanceSUI")}</span>
                    <span className="text-xs font-bold">{wallet.suiBalance.toFixed(2)}</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/60">
                    <span className="text-xs font-medium text-muted-foreground">{t("header.balanceIDR")}</span>
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
                        <span className="text-xs text-muted-foreground">{t("header.walletConnected")}</span>
                        <span className="text-xs font-mono break-all">{wallet.address}</span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                        {wallet.viaZkLogin ? (
                          <span className="flex items-center gap-1.5 text-primary">
                            <ShieldCheck className="h-3.5 w-3.5" /> {t("header.zkLoginVia")} {wallet.provider}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5" /> {t("header.ethos")}
                          </span>
                        )}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="px-2 py-1.5 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t("header.saldoSUI")}</span>
                          <span className="font-medium">{formatSUI(wallet.suiBalance)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{t("header.saldoIDR")}</span>
                          <span className="font-medium">{formatIDR(wallet.idrBalance)}</span>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={disconnectWallet} className="text-destructive focus:text-destructive">
                        <LogOut className="h-3.5 w-3.5 mr-2" />
                        {t("header.disconnect")}
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
                  className="flex items-center"
                >
                  {/* dapp-kit ConnectButton — opens native wallet selection modal */}
                  <ConnectButton
                    connectText={t("header.connectWallet")}
                    className="arthavest-connect-btn !h-9 !gap-2 !rounded-lg !bg-primary !px-4 !text-xs !font-semibold !text-primary-foreground !shadow-glow-emerald hover:!bg-primary/90"
                  />
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
