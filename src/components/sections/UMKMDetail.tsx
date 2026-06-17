"use client";

import { useAppStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
  Calendar,
  Droplets,
  Wallet,
  Zap,
  Database,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatIDR, formatPercent } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function UMKMDetail() {
  const selectedUMKMId = useAppStore((s) => s.selectedUMKMId);
  const setSelectedUMKM = useAppStore((s) => s.setSelectedUMKM);
  const umkm = useAppStore((s) => (s.selectedUMKMId ? s.getUMKM(s.selectedUMKMId) : undefined));
  const wallet = useAppStore((s) => s.wallet);
  const buyShares = useAppStore((s) => s.buyShares);

  const [sharesToBuy, setSharesToBuy] = useState(1);
  const [txPhase, setTxPhase] = useState<"idle" | "building" | "signing" | "executing" | "done">("idle");

  const open = !!selectedUMKMId && !!umkm;

  const handleBuy = async () => {
    if (!umkm) return;
    if (!wallet.connected) {
      toast.error("Wallet belum terhubung", {
        description: "Hubungkan wallet via zkLogin atau Ethos untuk mulai investasi.",
      });
      return;
    }

    // Simulate PTB transaction phases
    setTxPhase("building");
    await new Promise((r) => setTimeout(r, 700));
    setTxPhase("signing");
    await new Promise((r) => setTimeout(r, 900));
    setTxPhase("executing");
    await new Promise((r) => setTimeout(r, 1100));

    const result = buyShares(umkm.id, sharesToBuy);
    setTxPhase("done");

    if (result.success) {
      toast.success("Transaksi PTB terkonfirmasi!", {
        description: result.message,
      });
      setTimeout(() => {
        setTxPhase("idle");
        setSelectedUMKM(null);
        setSharesToBuy(1);
      }, 1500);
    } else {
      toast.error("Transaksi gagal", { description: result.message });
      setTxPhase("idle");
    }
  };

  const handleClose = () => {
    if (txPhase === "idle" || txPhase === "done") {
      setSelectedUMKM(null);
      setTxPhase("idle");
      setSharesToBuy(1);
    }
  };

  if (!umkm) return null;

  const fundedPct = ((umkm.totalShares - umkm.availableShares) / umkm.totalShares) * 100;
  const totalCost = sharesToBuy * umkm.pricePerShare;
  const estMonthlyProfit = (umkm.monthlyProfit * sharesToBuy) / umkm.totalShares;
  const estRatePerSecond = estMonthlyProfit / (30 * 86400);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto scrollbar-warm p-0 gap-0">
        {/* Cover */}
        <div className={`relative h-40 bg-gradient-to-br ${umkm.gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-warm opacity-30" />
          <div className="absolute top-4 left-4 flex gap-1.5">
            <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-0">
              {umkm.category}
            </Badge>
            {umkm.verifiedKyc && (
              <Badge className="bg-emerald-500/90 text-white border-0 gap-1">
                <ShieldCheck className="h-3 w-3" />
                KYC Verified
              </Badge>
            )}
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-0">
              Risiko {umkm.riskLevel}
            </Badge>
          </div>
          <div className="absolute -bottom-6 left-6 h-16 w-16 rounded-2xl bg-card border-4 border-background flex items-center justify-center text-3xl shadow-lg">
            {umkm.emoji}
          </div>
        </div>

        <DialogHeader className="px-6 pt-8 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl">{umkm.name}</DialogTitle>
              <DialogDescription className="text-base mt-1">{umkm.tagline}</DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Estimasi APY</div>
              <div className="text-xl font-bold text-emerald-600">{formatPercent(umkm.apyEstimate)}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {umkm.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Berdiri {umkm.establishedYear} · {new Date().getFullYear() - umkm.establishedYear} tahun
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Owner: {umkm.ownerName}
            </span>
            <span className="flex items-center gap-1 text-primary">
              <Database className="h-3.5 w-3.5" />
              Walrus: {umkm.documentsHash}
            </span>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Tentang UMKM</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{umkm.description}</p>
          </div>

          {/* Financial metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Revenue/bulan", value: formatIDR(umkm.monthlyRevenue, { compact: true }), icon: TrendingUp },
              { label: "Profit/bulan", value: formatIDR(umkm.monthlyProfit, { compact: true }), icon: Droplets },
              { label: "Valuasi", value: formatIDR(umkm.valuation, { compact: true }), icon: Wallet },
              { label: "Distribusi profit", value: `Tgl ${umkm.profitDistributionDay}`, icon: Calendar },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-border/60 bg-card p-3">
                <m.icon className="h-4 w-4 text-primary mb-1.5" />
                <div className="text-[10px] text-muted-foreground">{m.label}</div>
                <div className="text-sm font-bold">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Performa 6 bulan terakhir</h4>
            <div className="rounded-xl border border-border/60 bg-card p-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={umkm.revenueHistory}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.52 0.11 172)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.52 0.11 172)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.7 0.17 75)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="oklch(0.7 0.17 75)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.015 80)" />
                  <XAxis dataKey="month" stroke="oklch(0.5 0.015 60)" fontSize={11} />
                  <YAxis
                    stroke="oklch(0.5 0.015 60)"
                    fontSize={11}
                    tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`}
                  />
                  <Tooltip
                    formatter={(v: number) => formatIDR(v)}
                    contentStyle={{
                      background: "oklch(0.995 0.005 85)",
                      border: "1px solid oklch(0.9 0.015 80)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="oklch(0.52 0.11 172)"
                    strokeWidth={2}
                    fill="url(#rev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="oklch(0.7 0.17 75)"
                    strokeWidth={2}
                    fill="url(#prof)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funding progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Progress funding</h4>
              <span className="text-xs text-muted-foreground">
                {umkm.availableShares > 0
                  ? `${umkm.availableShares} saham tersisa dari ${umkm.totalShares}`
                  : "Sold out"}
              </span>
            </div>
            <Progress value={fundedPct} className="h-2" />
            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-muted-foreground">
                Terdanai: {formatIDR((umkm.totalShares - umkm.availableShares) * umkm.pricePerShare)}
              </span>
              <span className="font-mono font-semibold">{formatIDR(umkm.pricePerShare)} / saham</span>
            </div>
          </div>

          {/* Buy box */}
          <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-primary" />
                Beli Saham via PTB
              </h4>
              <Badge variant="secondary" className="text-[10px] gap-1">
                <ShieldCheck className="h-2.5 w-2.5" />
                Sponsored tx untuk first-timer
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="shares" className="text-xs text-muted-foreground mb-1.5 block">
                  Jumlah saham
                </Label>
                <Input
                  id="shares"
                  type="number"
                  min={1}
                  max={umkm.availableShares}
                  value={sharesToBuy}
                  onChange={(e) => setSharesToBuy(Math.max(1, Math.min(umkm.availableShares, Number(e.target.value))))}
                  disabled={txPhase !== "idle" && txPhase !== "done" || umkm.availableShares === 0}
                />
                <div className="text-[10px] text-muted-foreground mt-1">
                  Max: {umkm.availableShares} saham
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">Total biaya</Label>
                <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm font-bold">
                  {formatIDR(totalCost)}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Est. profit: {formatIDR(estMonthlyProfit, { compact: true })}/bulan
                </div>
              </div>
            </div>

            {/* Stream preview */}
            <div className="rounded-lg bg-background/60 border border-border/40 p-2.5 mb-3">
              <div className="flex items-center gap-2 text-[11px]">
                <Droplets className="h-3 w-3 text-primary" />
                <span className="text-muted-foreground">Setelah profit distribution:</span>
                <span className="font-mono font-semibold text-primary">
                  +{estRatePerSecond.toFixed(4)} IDR/detik
                </span>
              </div>
            </div>

            {/* PTB phases visualization */}
            <AnimatePresence mode="wait">
              {txPhase !== "idle" && txPhase !== "done" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-lg bg-background/80 border border-primary/20 p-3 mb-3 space-y-2"
                >
                  {[
                    { key: "building", label: "Membangun PTB (pay + receive + mint receipt)" },
                    { key: "signing", label: "Menandatangani transaksi" },
                    { key: "executing", label: "Eksekusi atomik di Sui network" },
                  ].map((phase) => {
                    const phaseOrder = ["building", "signing", "executing"];
                    const currentIdx = phaseOrder.indexOf(txPhase);
                    const phaseIdx = phaseOrder.indexOf(phase.key);
                    const isDone = phaseIdx < currentIdx;
                    const isActive = phaseIdx === currentIdx;
                    return (
                      <div key={phase.key} className="flex items-center gap-2 text-xs">
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : isActive ? (
                          <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30" />
                        )}
                        <span className={isDone || isActive ? "text-foreground" : "text-muted-foreground"}>
                          {phase.label}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              className="w-full gap-2 h-11 shadow-glow-emerald"
              onClick={handleBuy}
              disabled={txPhase !== "idle" && txPhase !== "done" || umkm.availableShares === 0}
            >
              {txPhase === "done" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Transaksi terkonfirmasi!
                </>
              ) : txPhase !== "idle" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses PTB...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  {umkm.availableShares === 0 ? "Sold Out" : `Beli ${sharesToBuy} saham · ${formatIDR(totalCost, { compact: true })}`}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {!wallet.connected && (
              <p className="text-[11px] text-amber-600 text-center mt-2">
                Hubungkan wallet (Google/Ethos) di kanan atas untuk mulai investasi.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
