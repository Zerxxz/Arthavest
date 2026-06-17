"use client";

import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Wallet,
  TrendingUp,
  Droplets,
  ArrowDownToLine,
  ArrowUpRight,
  Clock,
  Zap,
  Sparkles,
  ShieldCheck,
  Gift,
} from "lucide-react";
import {
  formatIDR,
  formatPercent,
  shortAddress,
  timeRemaining,
  accruedAmount,
} from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StreamVisualizer } from "@/components/stream/StreamVisualizer";
import { useTranslation } from "@/lib/useTranslation";

export function InvestorDashboard() {
  const { t } = useTranslation();
  const wallet = useAppStore((s) => s.wallet);
  const positions = useAppStore((s) => s.positions);
  const umkms = useAppStore((s) => s.umkms);
  const streams = useAppStore((s) => s.streams);
  const withdrawFromStream = useAppStore((s) => s.withdrawFromStream);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const [now, setNow] = useState(Date.now());

  // Tick every 500ms to update accrual
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, []);

  if (!wallet.connected) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Card className="p-12">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("investor.walletNotConnected")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("investor.walletNotConnectedDesc")}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="h-3 w-3" />
                zkLogin support
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Gift className="h-3 w-3" />
                {t("detail.sponsoredFirst")}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                Sub-second finality
              </Badge>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  const totalInvested = positions.reduce((acc, p) => acc + p.totalInvested, 0);
  const totalWithdrawn = positions.reduce((acc, p) => acc + p.totalWithdrawn, 0);
  const totalAccrued = streams.reduce((acc, s) => acc + accruedAmount(s), 0);
  const totalRatePerSecond = streams.reduce((acc, s) => acc + s.ratePerSecond, 0);
  const monthlyProjection = totalRatePerSecond * 86400 * 30;
  const portfolioValue = totalInvested + totalAccrued;

  const handleWithdraw = (streamId: string) => {
    const stream = streams.find((s) => s.id === streamId);
    if (!stream) return;
    const amount = accruedAmount(stream);
    if (amount <= 0) {
      toast.error("No balance available for withdrawal");
      return;
    }
    withdrawFromStream(streamId, amount);
    toast.success("Withdrawal successful!", {
      description: `${formatIDR(amount)} added to IDR balance · tx: ${shortAddress(generateRandomDigest())}`,
    });
  };

  const visualizerStreams = streams.map((s) => ({
    id: s.id,
    umkmName: s.umkmName,
    ratePerSecond: s.ratePerSecond,
    particleColor: s.particleColor,
    intensity: 0.8,
  }));

  return (
    <section className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t("investor.title")}</h2>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
              {wallet.viaZkLogin ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  zkLogin via {wallet.provider} · {shortAddress(wallet.address)}
                </>
              ) : (
                <>
                  <Wallet className="h-3.5 w-3.5 text-primary" />
                  {shortAddress(wallet.address)}
                </>
              )}
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => setActiveTab("marketplace")}>
            <ArrowUpRight className="h-4 w-4" />
            {t("investor.investMore")}
          </Button>
        </div>

        {/* Portfolio summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: t("investor.totalInvested"),
              value: formatIDR(totalInvested, { compact: true }),
              icon: Wallet,
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              label: t("investor.portfolioValue"),
              value: formatIDR(portfolioValue, { compact: true }),
              icon: TrendingUp,
              color: "text-emerald-600",
              bg: "bg-emerald-100",
            },
            {
              label: t("investor.activeStreams"),
              value: `${streams.length} stream`,
              icon: Droplets,
              color: "text-amber-600",
              bg: "bg-amber-100",
              sub: `${totalRatePerSecond.toFixed(4)} IDR/s`,
            },
            {
              label: t("investor.withdrawn"),
              value: formatIDR(totalWithdrawn + totalAccrued, { compact: true }),
              icon: ArrowDownToLine,
              color: "text-rose-600",
              bg: "bg-rose-100",
            },
          ].map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4">
                <div className={`h-9 w-9 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
                  <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
                </div>
                <div className="text-[11px] text-muted-foreground">{card.label}</div>
                <div className="text-lg font-bold">{card.value}</div>
                {card.sub && (
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">{card.sub}</div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Live stream visualizer */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <Droplets className="h-4 w-4 text-primary" />
                {t("investor.streamTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("investor.streamSubtitle")}
              </p>
            </div>
            <Badge variant="secondary" className="gap-1 bg-emerald-100 text-emerald-700">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              Live · {totalRatePerSecond.toFixed(4)} IDR/s
            </Badge>
          </div>

          <div className="rounded-2xl bg-background/40 border border-border/40 p-2">
            <StreamVisualizer streams={visualizerStreams} height={260} showLabels={false} />
          </div>

          {/* Projection strip */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="rounded-lg bg-background/50 border border-border/40 p-2.5">
              <div className="text-[10px] text-muted-foreground">{t("investor.dailyAccrual")}</div>
              <div className="text-sm font-bold text-primary">
                {formatIDR(totalRatePerSecond * 86400, { compact: true })}
              </div>
            </div>
            <div className="rounded-lg bg-background/50 border border-border/40 p-2.5">
              <div className="text-[10px] text-muted-foreground">{t("investor.monthlyProj")}</div>
              <div className="text-sm font-bold text-emerald-600">
                {formatIDR(monthlyProjection, { compact: true })}
              </div>
            </div>
            <div className="rounded-lg bg-background/50 border border-border/40 p-2.5">
              <div className="text-[10px] text-muted-foreground">{t("investor.readyWithdraw")}</div>
              <div className="text-sm font-bold text-amber-600">
                {formatIDR(totalAccrued, { compact: true })}
              </div>
            </div>
          </div>
        </Card>

        {/* Active streams list */}
        <Card className="p-5">
          <h3 className="text-base font-bold mb-4">{t("investor.streamDetail")}</h3>
          <div className="space-y-3">
            {streams.map((stream) => {
              const umkm = umkms.find((u) => u.id === stream.umkmId);
              const accrued = accruedAmount(stream);
              const progressPct = ((stream.withdrawnAmount + accrued) / stream.totalAmount) * 100;
              return (
                <div
                  key={stream.id}
                  className="rounded-xl border border-border/60 bg-background/40 p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${umkm?.gradient ?? "from-primary/20 to-accent/30"} flex items-center justify-center text-lg flex-shrink-0`}>
                        {umkm?.emoji ?? "💧"}
                      </div>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                          {stream.umkmName}
                          <Badge variant="outline" className="text-[9px] gap-0.5">
                            <Sparkles className="h-2.5 w-2.5" />
                            {stream.sharesOwned} {t("investor.shares")}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          {stream.id} · tx {shortAddress(stream.txDigest)}
                        </div>
                      </div>
                    </div>
                    <Badge className="gap-1 bg-emerald-100 text-emerald-700 border-0">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      </span>
                      {stream.ratePerSecond.toFixed(4)} IDR/s
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">
                        {formatIDR(stream.withdrawnAmount + accrued, { compact: true })} / {formatIDR(stream.totalAmount, { compact: true })}
                      </span>
                      <span className="font-mono">{progressPct.toFixed(1)}%</span>
                    </div>
                    <Progress value={progressPct} className="h-1.5" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                      <span>{t("investor.alreadyWithdrawn", { amount: formatIDR(stream.withdrawnAmount) })}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {t("investor.timeRemaining", { time: timeRemaining(stream.endTime) })}
                      </span>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/40">
                    <div>
                      <div className="text-[10px] text-muted-foreground">{t("investor.saldoTersedia")}</div>
                      <motion.div
                        key={Math.floor(accrued)}
                        initial={{ scale: 1.02, color: "oklch(0.7 0.17 75)" }}
                        animate={{ scale: 1, color: "oklch(0.18 0.012 60)" }}
                        className="text-base font-bold"
                      >
                        {formatIDR(accrued)}
                      </motion.div>
                    </div>
                    <Button
                      size="sm"
                      className="gap-1.5"
                      onClick={() => handleWithdraw(stream.id)}
                      disabled={accrued <= 0}
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" />
                      {t("investor.withdraw")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Portfolio table */}
        <Card className="p-5">
          <h3 className="text-base font-bold mb-4">{t("investor.positionsTitle")}</h3>
          <div className="overflow-x-auto scrollbar-warm">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-muted-foreground border-b border-border/60">
                  <th className="pb-2 font-medium">{t("investor.col.umkm")}</th>
                  <th className="pb-2 font-medium text-right">{t("investor.col.shares")}</th>
                  <th className="pb-2 font-medium text-right">{t("investor.col.avgBuy")}</th>
                  <th className="pb-2 font-medium text-right">{t("investor.col.invested")}</th>
                  <th className="pb-2 font-medium text-right">{t("investor.col.withdrawn")}</th>
                  <th className="pb-2 font-medium text-right">{t("investor.col.roi")}</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => {
                  const umkm = umkms.find((u) => u.id === pos.umkmId);
                  if (!umkm) return null;
                  const roi = ((pos.totalWithdrawn + accruedAmount(streams.find((s) => s.umkmId === pos.umkmId)!)) / pos.totalInvested) * 100;
                  return (
                    <tr key={pos.umkmId} className="border-b border-border/40 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{umkm.emoji}</span>
                          <div>
                            <div className="font-semibold text-xs">{umkm.name}</div>
                            <div className="text-[10px] text-muted-foreground">{umkm.location.split(",")[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono text-xs">{pos.sharesOwned}</td>
                      <td className="py-3 text-right font-mono text-xs">{formatIDR(pos.avgBuyPrice, { compact: true })}</td>
                      <td className="py-3 text-right font-mono text-xs">{formatIDR(pos.totalInvested, { compact: true })}</td>
                      <td className="py-3 text-right font-mono text-xs">{formatIDR(pos.totalWithdrawn, { compact: true })}</td>
                      <td className="py-3 text-right">
                        <span className={`text-xs font-bold ${roi >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          {formatPercent(roi)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}

function generateRandomDigest(): string {
  const chars = "0123456789abcdef";
  let result = "0x";
  for (let i = 0; i < 16; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
