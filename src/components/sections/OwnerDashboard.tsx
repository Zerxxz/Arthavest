"use client";

import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Store,
  Wallet,
  TrendingUp,
  Users,
  Workflow,
  CheckCircle2,
  Loader2,
  Zap,
  Database,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Droplets,
  Calendar,
} from "lucide-react";
import { formatIDR, formatPercent, shortAddress } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "@/lib/useTranslation";

export function OwnerDashboard() {
  const { t } = useTranslation();
  const wallet = useAppStore((s) => s.wallet);
  const umkms = useAppStore((s) => s.umkms);
  const positions = useAppStore((s) => s.positions);
  const distributeProfits = useAppStore((s) => s.distributeProfits);

  // Mock: assume user is owner of umkm-001 (Kopi Senja) and umkm-004 (Bakso Pak Joko)
  const ownerUMKMIds = ["umkm-001", "umkm-004"];
  const ownerUMKMs = umkms.filter((u) => ownerUMKMIds.includes(u.id));

  const [selectedDistributeUMKM, setSelectedDistributeUMKM] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "uploading" | "verifying" | "distributing" | "done">("idle");

  if (!wallet.connected) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center">
          <Card className="p-12">
            <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("investor.walletNotConnected")}</h3>
            <p className="text-sm text-muted-foreground">
              Connect your MSME wallet (via zkLogin Google/Ethos) in top-right to manage profit distribution to investors.
            </p>
          </Card>
        </div>
      </section>
    );
  }

  const handleDistribute = async (umkmId: string) => {
    setSelectedDistributeUMKM(umkmId);
    setPhase("uploading");
    await new Promise((r) => setTimeout(r, 800));
    setPhase("verifying");
    await new Promise((r) => setTimeout(r, 1100));
    setPhase("distributing");
    await new Promise((r) => setTimeout(r, 1400));

    const result = distributeProfits(umkmId);
    setPhase("done");

    if (result.success) {
      toast.success(t("distribute.success"), {
        description: `${result.investorCount} investors · ${formatIDR(result.totalDistributed, { compact: true })} · tx ${shortAddress(result.txDigest)}`,
      });
      setTimeout(() => {
        setPhase("idle");
        setSelectedDistributeUMKM(null);
      }, 2000);
    } else {
      toast.error("Distribution failed");
      setPhase("idle");
    }
  };

  const handleClose = () => {
    if (phase === "idle" || phase === "done") {
      setSelectedDistributeUMKM(null);
      setPhase("idle");
    }
  };

  const selectedUMKM = selectedDistributeUMKM ? umkms.find((u) => u.id === selectedDistributeUMKM) : null;
  const selectedInvestorCount = selectedUMKM ? Math.floor(selectedUMKM.totalShares * 0.18) + 12 : 0;

  return (
    <section className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t("owner.title")}</h2>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
              <Store className="h-3.5 w-3.5 text-primary" />
              {ownerUMKMs.length} {t("owner.umkmManaged")} · {shortAddress(wallet.address)}
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 bg-accent/30 border-accent/50 self-start">
            <ShieldCheck className="h-3 w-3" />
            {t("owner.kycVerifiedOwner")}
          </Badge>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: t("owner.totalRevenueMonth"),
              value: formatIDR(ownerUMKMs.reduce((a, u) => a + u.monthlyRevenue, 0), { compact: true }),
              icon: TrendingUp,
              bg: "bg-primary/10",
              color: "text-primary",
            },
            {
              label: t("owner.totalProfitMonth"),
              value: formatIDR(ownerUMKMs.reduce((a, u) => a + u.monthlyProfit, 0), { compact: true }),
              icon: Droplets,
              bg: "bg-amber-100",
              color: "text-amber-600",
            },
            {
              label: t("owner.totalInvestors"),
              value: `${ownerUMKMs.reduce((a, u) => a + Math.floor(u.totalShares * 0.18) + 12, 0)}`,
              icon: Users,
              bg: "bg-emerald-100",
              color: "text-emerald-600",
            },
            {
              label: t("owner.distributionThisMonth"),
              value: ownerUMKMs.some((u) => u.profitDistributionDay <= new Date().getDate()) ? t("owner.pending") : t("owner.done"),
              icon: Calendar,
              bg: "bg-rose-100",
              color: "text-rose-600",
            },
          ].map((card) => (
            <Card key={card.label} className="p-4">
              <div className={`h-9 w-9 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
                <card.icon className={`h-4.5 w-4.5 ${card.color}`} />
              </div>
              <div className="text-[11px] text-muted-foreground">{card.label}</div>
              <div className="text-lg font-bold">{card.value}</div>
            </Card>
          ))}
        </div>

        {/* UMKM list with distribute action */}
        <div className="space-y-4">
          {ownerUMKMs.map((umkm) => {
            const investorCount = Math.floor(umkm.totalShares * 0.18) + 12;
            const userHoldsThis = positions.some((p) => p.umkmId === umkm.id);
            return (
              <Card key={umkm.id} className="overflow-hidden">
                <div className="grid lg:grid-cols-[1fr_280px] gap-0">
                  {/* Left: UMKM info */}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${umkm.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                        {umkm.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-bold text-base">{umkm.name}</h3>
                          <Badge variant="outline" className="text-[10px]">{umkm.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{umkm.tagline}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1.5">
                          <Database className="h-2.5 w-2.5" />
                          <span className="font-mono">Walrus: {umkm.documentsHash}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <div className="text-[10px] text-muted-foreground">{t("detail.revenue")}</div>
                        <div className="text-sm font-bold">{formatIDR(umkm.monthlyRevenue, { compact: true })}</div>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <div className="text-[10px] text-muted-foreground">{t("detail.profit")}</div>
                        <div className="text-sm font-bold text-emerald-600">{formatIDR(umkm.monthlyProfit, { compact: true })}</div>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <div className="text-[10px] text-muted-foreground">{t("common.investors")}</div>
                        <div className="text-sm font-bold">{investorCount}</div>
                      </div>
                    </div>

                    {/* Mini chart */}
                    <div className="h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={umkm.revenueHistory}>
                          <defs>
                            <linearGradient id={`rev-${umkm.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="oklch(0.52 0.11 172)" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="oklch(0.52 0.11 172)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" stroke="oklch(0.5 0.015 60)" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis hide />
                          <Tooltip
                            formatter={(v: number) => formatIDR(v)}
                            contentStyle={{
                              background: "oklch(0.995 0.005 85)",
                              border: "1px solid oklch(0.9 0.015 80)",
                              borderRadius: "8px",
                              fontSize: "11px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="oklch(0.52 0.11 172)"
                            strokeWidth={1.5}
                            fill={`url(#rev-${umkm.id})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right: Distribution action */}
                  <div className="border-l border-border/40 bg-secondary/20 p-5 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Workflow className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold">{t("owner.distributionNext")}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {formatIDR(umkm.monthlyProfit, { compact: true })}
                    </div>
                    <div className="text-[11px] text-muted-foreground mb-4">
                      {t("owner.distributionEvery", { day: umkm.profitDistributionDay, n: investorCount })}
                    </div>

                    {/* Sui features used */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      <Badge variant="secondary" className="text-[9px] gap-0.5">
                        <Workflow className="h-2.5 w-2.5" />
                        PTB Bulk
                      </Badge>
                      <Badge variant="secondary" className="text-[9px] gap-0.5">
                        <Database className="h-2.5 w-2.5" />
                        Walrus proof
                      </Badge>
                      <Badge variant="secondary" className="text-[9px] gap-0.5">
                        <Zap className="h-2.5 w-2.5" />
                        Atomic
                      </Badge>
                    </div>

                    <div className="mt-auto">
                      <Button
                        className="w-full gap-2 shadow-glow-emerald"
                        onClick={() => handleDistribute(umkm.id)}
                      >
                        <Sparkles className="h-4 w-4" />
                        {t("owner.distributeNow")}
                      </Button>
                      {userHoldsThis && (
                        <p className="text-[10px] text-muted-foreground text-center mt-2">
                          {t("owner.youAreAlsoInvestor")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Distribute Dialog */}
      <Dialog open={!!selectedDistributeUMKM} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-primary" />
              {t("distribute.title", { name: selectedUMKM?.name ?? "" })}
            </DialogTitle>
            <DialogDescription>
              {t("distribute.desc", { n: selectedInvestorCount })}
            </DialogDescription>
          </DialogHeader>

          {/* Steps */}
          <div className="space-y-3 py-4">
            {[
              { key: "uploading", label: t("distribute.uploading"), desc: t("distribute.uploadingDesc") },
              { key: "verifying", label: t("distribute.verifying"), desc: t("distribute.verifyingDesc") },
              { key: "distributing", label: t("distribute.distributing"), desc: t("distribute.distributingDesc", { n: selectedInvestorCount }) },
            ].map((step, i) => {
              const order = ["uploading", "verifying", "distributing", "done"];
              const currentIdx = order.indexOf(phase);
              const stepIdx = order.indexOf(step.key);
              const isDone = phase === "done" || stepIdx < currentIdx;
              const isActive = stepIdx === currentIdx;

              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    isActive ? "border-primary/30 bg-primary/5" :
                    isDone ? "border-emerald-200 bg-emerald-50" : "border-border/40"
                  }`}
                >
                  <div className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${isActive || isDone ? "" : "text-muted-foreground"}`}>
                      {step.label}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{step.desc}</div>
                    {isActive && step.key === "uploading" && (
                      <div className="text-[10px] font-mono text-primary mt-1">
                        walrus_blob_id: 0xb1x9af3c...k3p7
                      </div>
                    )}
                    {isActive && step.key === "distributing" && (
                      <div className="text-[10px] font-mono text-primary mt-1">
                        ptb.make_move_vector({selectedInvestorCount} streams)
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {phase === "done" && selectedUMKM && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-emerald-50 border border-emerald-200 p-4"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-emerald-900">{t("distribute.success")}</div>
                  <div className="text-xs text-emerald-700 mt-1">
                    {t("distribute.successDesc", { n: selectedInvestorCount, amount: formatIDR(selectedUMKM.monthlyProfit, { compact: true }) })}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-600 mt-2">
                    {t("distribute.tx")} 0x{Math.random().toString(16).slice(2, 18)}...
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={phase !== "idle" && phase !== "done"}
            >
              {phase === "done" ? t("distribute.close") : t("distribute.cancel")}
            </Button>
            {phase === "idle" && (
              <Button
                className="gap-2"
                onClick={() => selectedUMKM && handleDistribute(selectedUMKM.id)}
              >
                <ArrowRight className="h-4 w-4" />
                {t("distribute.start")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
