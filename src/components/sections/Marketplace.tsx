"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
  Calendar,
  Search,
  Droplets,
  AlertTriangle,
} from "lucide-react";
import { formatIDR, formatPercent } from "@/lib/format";
import { useState } from "react";
import { UMKMDetail } from "./UMKMDetail";
import type { UMKMCategory } from "@/lib/types";

const CATEGORY_LABELS: Record<UMKMCategory, string> = {
  kuliner: "Kuliner",
  kopi: "Kopi",
  laundry: "Laundry",
  kerajinan: "Kerajinan",
  jasa: "Jasa",
  pertanian: "Pertanian",
};

const RISK_COLORS: Record<string, string> = {
  rendah: "bg-emerald-100 text-emerald-700 border-emerald-200",
  sedang: "bg-amber-100 text-amber-700 border-amber-200",
  tinggi: "bg-rose-100 text-rose-700 border-rose-200",
};

export function Marketplace() {
  const umkms = useAppStore((s) => s.umkms);
  const setSelectedUMKM = useAppStore((s) => s.setSelectedUMKM);
  const positions = useAppStore((s) => s.positions);
  const [filter, setFilter] = useState<UMKMCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = umkms.filter((u) => {
    const matchesCat = filter === "all" || u.category === filter;
    const matchesSearch =
      !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Marketplace UMKM
            </h2>
            <p className="text-sm text-muted-foreground">
              {umkms.length} UMKM terverifikasi · Profit distribution via SuiStream
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari UMKM, lokasi, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            Semua
          </button>
          {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as UMKMCategory)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((umkm, i) => {
            const fundedPct = ((umkm.totalShares - umkm.availableShares) / umkm.totalShares) * 100;
            const userPosition = positions.find((p) => p.umkmId === umkm.id);
            const isSoldOut = umkm.availableShares === 0;

            return (
              <motion.div
                key={umkm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card
                  className="group relative overflow-hidden cursor-pointer hover:shadow-glow-emerald transition-all duration-300 hover:-translate-y-1"
                  onClick={() => setSelectedUMKM(umkm.id)}
                >
                  {/* Cover gradient */}
                  <div className={`relative h-32 bg-gradient-to-br ${umkm.gradient} overflow-hidden`}>
                    <div className="absolute inset-0 bg-grid-warm opacity-30" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <Badge className="bg-background/80 backdrop-blur-sm text-foreground border-0 text-[10px]">
                        {CATEGORY_LABELS[umkm.category]}
                      </Badge>
                      {umkm.verifiedKyc && (
                        <Badge className="bg-emerald-500/90 text-white border-0 gap-1 text-[10px]">
                          <ShieldCheck className="h-2.5 w-2.5" />
                          KYC
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${RISK_COLORS[umkm.riskLevel]}`}>
                        Risiko {umkm.riskLevel}
                      </div>
                    </div>
                    <div className="absolute -bottom-3 left-4 h-12 w-12 rounded-xl bg-card border-2 border-background flex items-center justify-center text-2xl shadow-sm">
                      {umkm.emoji}
                    </div>
                    {userPosition && (
                      <div className="absolute -bottom-3 right-4 px-2 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-sm">
                        {userPosition.sharesOwned} saham dimiliki
                      </div>
                    )}
                  </div>

                  <div className="p-4 pt-5">
                    <h3 className="font-bold text-base mb-0.5 line-clamp-1">{umkm.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{umkm.tagline}</p>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {umkm.location.split(",")[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date().getFullYear() - umkm.establishedYear} thn
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {Math.floor(umkm.totalShares * 0.18) + 12}
                      </span>
                    </div>

                    {/* Financial highlights */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <div className="text-[10px] text-muted-foreground">Profit/bulan</div>
                        <div className="text-sm font-bold">{formatIDR(umkm.monthlyProfit, { compact: true })}</div>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2">
                        <div className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <TrendingUp className="h-2.5 w-2.5" />
                          Estimasi APY
                        </div>
                        <div className="text-sm font-bold text-emerald-600">{formatPercent(umkm.apyEstimate)}</div>
                      </div>
                    </div>

                    {/* Funding progress */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-muted-foreground">
                          Terdanai {formatIDR((umkm.totalShares - umkm.availableShares) * umkm.pricePerShare, { compact: true })}
                        </span>
                        <span className="font-semibold">{fundedPct.toFixed(0)}%</span>
                      </div>
                      <Progress
                        value={fundedPct}
                        className="h-1.5"
                      />
                      <div className="flex items-center justify-between text-[10px] mt-1.5">
                        <span className="text-muted-foreground">
                          {umkm.availableShares > 0 ? `${umkm.availableShares} saham tersisa` : "Sold out"}
                        </span>
                        <span className="font-mono">{formatIDR(umkm.pricePerShare, { compact: true })}/saham</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      className="w-full gap-2"
                      variant={isSoldOut ? "secondary" : "default"}
                      disabled={isSoldOut}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUMKM(umkm.id);
                      }}
                    >
                      {isSoldOut ? (
                        "Sold Out — Lihat Detail"
                      ) : (
                        <>
                          <Droplets className="h-3.5 w-3.5" />
                          Investasi Sekarang
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Tidak ada UMKM yang cocok dengan filter Anda.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <UMKMDetail />
    </section>
  );
}
