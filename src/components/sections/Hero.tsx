"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  PlayCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
  Droplets,
  Users,
} from "lucide-react";
import { StreamVisualizer } from "@/components/stream/StreamVisualizer";
import { useAppStore } from "@/lib/store";
import { formatIDR } from "@/lib/format";
import { useTranslation } from "@/lib/useTranslation";

export function Hero() {
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const streams = useAppStore((s) => s.streams);
  const { t } = useTranslation();

  const visualizerStreams = streams.map((s) => ({
    id: s.id,
    umkmName: s.umkmName,
    ratePerSecond: s.ratePerSecond,
    particleColor: s.particleColor,
    intensity: 0.7,
  }));

  return (
    <section className="relative overflow-hidden bg-grid-warm">
      <div className="absolute inset-0 bg-radial-warm" aria-hidden="true" />
      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <Badge
              variant="outline"
              className="self-start gap-1.5 py-1.5 px-3 bg-accent/30 border-accent/50 text-accent-foreground"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <span className="text-xs font-semibold">
                {t("hero.hackathonBadge")}
              </span>
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                {t("hero.titleLine1")}
                <br />
                <span className="text-gradient-emerald">{t("hero.titleLine2")}</span>{" "}
                <span className="text-gradient-amber">{t("hero.titleLine3")}</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                {t("hero.subtitle")}
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="gap-2 h-12 px-6 shadow-glow-emerald"
                onClick={() => setActiveTab("marketplace")}
              >
                {t("hero.explore")}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 h-12 px-6"
                onClick={() => setActiveTab("how")}
              >
                <PlayCircle className="h-4 w-4" />
                {t("hero.howItWorks")}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {[
                { icon: Users, label: "6", sublabel: t("hero.umkmVerified") },
                { icon: Droplets, label: "47-312", sublabel: t("hero.investorsPer") },
                { icon: TrendingUp, label: "18-23%", sublabel: t("hero.estimatedAPY") },
                { icon: ShieldCheck, label: "zkLogin", sublabel: t("hero.noWalletNeeded") },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="glass-card rounded-xl p-3 flex flex-col gap-0.5"
                >
                  <stat.icon className="h-4 w-4 text-primary mb-1" />
                  <div className="text-sm font-bold">{stat.label}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.sublabel}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Stream visualizer card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card rounded-3xl p-6 shadow-glow-emerald relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Droplets className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{t("hero.streamLive")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("hero.activeProfitStreams")}
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1 bg-primary/10 text-primary border-primary/20">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
                  </span>
                  {t("hero.streaming")}
                </Badge>
              </div>

              <div className="rounded-2xl bg-background/40 border border-border/40 p-2">
                <StreamVisualizer streams={visualizerStreams} height={300} />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="rounded-xl bg-background/50 p-3 border border-border/40">
                  <div className="text-[10px] text-muted-foreground mb-1">{t("hero.dailyAccrual")}</div>
                  <div className="text-sm font-bold text-primary">
                    {formatIDR(
                      streams.reduce((acc, s) => acc + s.ratePerSecond * 86400, 0),
                      { compact: true },
                    )}
                  </div>
                </div>
                <div className="rounded-xl bg-background/50 p-3 border border-border/40">
                  <div className="text-[10px] text-muted-foreground mb-1">{t("hero.activeStreams")}</div>
                  <div className="text-sm font-bold">{streams.length}</div>
                </div>
                <div className="rounded-xl bg-background/50 p-3 border border-border/40">
                  <div className="text-[10px] text-muted-foreground mb-1">{t("hero.ptbTx")}</div>
                  <div className="text-sm font-bold flex items-center gap-1">
                    <Zap className="h-3 w-3 text-amber-500" />
                    {t("hero.atomic")}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating accent */}
            <motion.div
              className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-amber-300/30 blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              aria-hidden="true"
            />
            <motion.div
              className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 5, repeat: Infinity }}
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
