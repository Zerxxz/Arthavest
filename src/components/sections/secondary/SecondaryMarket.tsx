"use client";

import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Zap,
  Activity,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Database,
  LineChart as LineChartIcon,
  Plus,
} from "lucide-react";
import { formatIDR, shortAddress } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export function SecondaryMarket() {
  const listings = useAppStore((s) => s.listings);
  const buyFromListing = useAppStore((s) => s.buyFromListing);
  const positions = useAppStore((s) => s.positions);
  const umkms = useAppStore((s) => s.umkms);
  const createListing = useAppStore((s) => s.createListing);
  const wallet = useAppStore((s) => s.wallet);

  const [buyListingId, setBuyListingId] = useState<string | null>(null);
  const [buyPhase, setBuyPhase] = useState<"idle" | "matching" | "settling" | "done">("idle");
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [sellUMKMId, setSellUMKMId] = useState<string>("");
  const [sellShares, setSellShares] = useState(1);
  const [sellPrice, setSellPrice] = useState(1_000_000);

  const handleBuy = async (listingId: string) => {
    setBuyListingId(listingId);
    setBuyPhase("matching");
    await new Promise((r) => setTimeout(r, 900));
    setBuyPhase("settling");
    await new Promise((r) => setTimeout(r, 1100));
    const result = buyFromListing(listingId);
    setBuyPhase("done");
    if (result.success) {
      toast.success("Match & settle sukses via DeepBook!", {
        description: `${result.message} · tx ${shortAddress(result.txDigest)}`,
      });
    } else {
      toast.error("Order gagal", { description: result.message });
    }
    setTimeout(() => {
      setBuyPhase("idle");
      setBuyListingId(null);
    }, 1500);
  };

  const handleCreateListing = () => {
    if (!sellUMKMId) {
      toast.error("Pilih UMKM dulu");
      return;
    }
    const result = createListing(sellUMKMId, sellShares, sellPrice);
    if (result.success) {
      toast.success("Listing dibuat di DeepBook!", { description: result.message });
      setSellModalOpen(false);
      setSellUMKMId("");
      setSellShares(1);
      setSellPrice(1_000_000);
    } else {
      toast.error("Gagal membuat listing", { description: result.message });
    }
  };

  const sellablePositions = positions.filter((p) => p.sharesOwned > 0);

  // Aggregate stats
  const totalVolume = listings.reduce((acc, l) => acc + l.dailyVolume, 0);
  const avgSpread = listings.length > 0 ? listings.reduce((acc, l) => acc + l.spread, 0) / listings.length : 0;
  const activePools = new Set(listings.map((l) => l.umkmId)).size;

  return (
    <section className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Pasar Sekunder · DeepBook</h2>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
              <LineChartIcon className="h-3.5 w-3.5 text-primary" />
              Central limit orderbook on-chain — likuiditas saham UMKM tanpa exit window
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => setSellModalOpen(true)}
            disabled={sellablePositions.length === 0}
          >
            <Plus className="h-4 w-4" />
            Jual Saham
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Volume 24h", value: formatIDR(totalVolume, { compact: true }), icon: Activity, color: "text-primary", bg: "bg-primary/10" },
            { label: "Pool aktif", value: `${activePools}`, icon: Database, color: "text-emerald-600", bg: "bg-emerald-100" },
            { label: "Avg spread", value: formatIDR(avgSpread, { compact: true }), icon: Zap, color: "text-amber-600", bg: "bg-amber-100" },
            { label: "Listing aktif", value: `${listings.length}`, icon: LineChartIcon, color: "text-rose-600", bg: "bg-rose-100" },
          ].map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              <div className="text-[11px] text-muted-foreground">{stat.label}</div>
              <div className="text-lg font-bold">{stat.value}</div>
            </Card>
          ))}
        </div>

        {/* Listings grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => {
            const firstPrice = listing.priceHistory[0]?.p ?? listing.pricePerShare;
            const lastPrice = listing.priceHistory[listing.priceHistory.length - 1]?.p ?? listing.pricePerShare;
            const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;
            const isUp = priceChange >= 0;

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden hover:shadow-glow-emerald transition-shadow">
                  {/* Header */}
                  <div className={`relative h-20 bg-gradient-to-br ${listing.umkmGradient} p-3`}>
                    <div className="absolute inset-0 bg-grid-warm opacity-30" />
                    <div className="relative flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-card border flex items-center justify-center text-xl">
                          {listing.umkmEmoji}
                        </div>
                        <div>
                          <div className="font-bold text-sm">{listing.umkmName}</div>
                          <div className="text-[10px] opacity-80 font-mono">seller {shortAddress(listing.sellerAddress)}</div>
                        </div>
                      </div>
                      <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-0 text-[10px] gap-1">
                        <LineChartIcon className="h-2.5 w-2.5" />
                        DeepBook
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Price + sparkline */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-[10px] text-muted-foreground">Ask price</div>
                        <div className="text-lg font-bold">{formatIDR(listing.pricePerShare)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-muted-foreground">24h</div>
                        <div className={`text-sm font-bold flex items-center gap-0.5 ${isUp ? "text-emerald-600" : "text-rose-600"}`}>
                          {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {Math.abs(priceChange).toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    {/* Sparkline */}
                    <div className="h-12 mb-3">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={listing.priceHistory}>
                          <XAxis dataKey="t" hide />
                          <YAxis domain={["dataMin", "dataMax"]} hide />
                          <Tooltip
                            labelFormatter={() => ""}
                            formatter={(v: number) => [formatIDR(v), "Harga"]}
                            contentStyle={{
                              background: "oklch(0.995 0.005 85)",
                              border: "1px solid oklch(0.9 0.015 80)",
                              borderRadius: "8px",
                              fontSize: "11px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="p"
                            stroke={isUp ? "oklch(0.55 0.13 172)" : "oklch(0.58 0.22 25)"}
                            strokeWidth={1.5}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Orderbook mini */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
                      <div className="rounded-lg bg-emerald-50/60 border border-emerald-200/40 p-2">
                        <div className="text-[10px] text-emerald-700">Best Bid</div>
                        <div className="font-mono font-bold text-emerald-700">{formatIDR(listing.bestBid, { compact: true })}</div>
                      </div>
                      <div className="rounded-lg bg-rose-50/60 border border-rose-200/40 p-2">
                        <div className="text-[10px] text-rose-700">Best Ask</div>
                        <div className="font-mono font-bold text-rose-700">{formatIDR(listing.bestAsk, { compact: true })}</div>
                      </div>
                    </div>

                    {/* Listing details */}
                    <div className="flex items-center justify-between text-[11px] mb-3">
                      <div>
                        <span className="text-muted-foreground">Jumlah: </span>
                        <span className="font-semibold">{listing.shares} saham</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Spread: </span>
                        <span className="font-mono">{formatIDR(listing.spread, { compact: true })}</span>
                      </div>
                    </div>

                    {/* Buy button */}
                    <Button
                      className="w-full gap-2"
                      onClick={() => handleBuy(listing.id)}
                      disabled={buyListingId === listing.id}
                    >
                      {buyListingId === listing.id ? (
                        <>
                          <AnimatePresence mode="wait">
                            {buyPhase === "matching" && (
                              <motion.span key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Matching order...
                              </motion.span>
                            )}
                            {buyPhase === "settling" && (
                              <motion.span key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Settling via PTB...
                              </motion.span>
                            )}
                            {buyPhase === "done" && (
                              <motion.span key="d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Matched!
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <>
                          <Zap className="h-3.5 w-3.5" />
                          Beli {listing.shares} saham · {formatIDR(listing.shares * listing.pricePerShare, { compact: true })}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {listings.length === 0 && (
          <Card className="p-12 text-center">
            <LineChartIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Belum ada listing aktif</h3>
            <p className="text-sm text-muted-foreground">Jual saham portfolio-mu untuk menyediakan likuiditas.</p>
          </Card>
        )}
      </div>

      {/* Sell Modal */}
      <Dialog open={sellModalOpen} onOpenChange={setSellModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              Jual Saham via DeepBook
            </DialogTitle>
            <DialogDescription>
              Buat ask order di orderbook on-chain. Saham akan di-lock sampai match atau cancel.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs text-muted-foreground">UMKM</Label>
              <Select value={sellUMKMId} onValueChange={setSellUMKMId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih UMKM dari portfolio" />
                </SelectTrigger>
                <SelectContent>
                  {sellablePositions.map((pos) => {
                    const umkm = umkms.find((u) => u.id === pos.umkmId);
                    if (!umkm) return null;
                    return (
                      <SelectItem key={pos.umkmId} value={pos.umkmId}>
                        {umkm.emoji} {umkm.name} ({pos.sharesOwned} saham)
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Jumlah saham</Label>
                <Input
                  type="number"
                  min={1}
                  value={sellShares}
                  onChange={(e) => setSellShares(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Harga per saham (IDR)</Label>
                <Input
                  type="number"
                  min={1000}
                  step={10000}
                  value={sellPrice}
                  onChange={(e) => setSellPrice(Math.max(1000, Number(e.target.value)))}
                />
              </div>
            </div>

            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Total nilai</span>
                <span className="font-bold">{formatIDR(sellShares * sellPrice)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Fee DeepBook (0.25%)</span>
                <span className="font-mono">{formatIDR(sellShares * sellPrice * 0.0025, { compact: true })}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-primary/20">
                <span className="text-muted-foreground">Estimasi diterima</span>
                <span className="font-bold text-emerald-600">{formatIDR(sellShares * sellPrice * 0.9975, { compact: true })}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <Wallet className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>Wallet: {shortAddress(wallet.address)} · Saldo: {formatIDR(wallet.idrBalance, { compact: true })}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSellModalOpen(false)}>Batal</Button>
            <Button onClick={handleCreateListing} className="gap-2">
              <Zap className="h-4 w-4" />
              Place Ask Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
