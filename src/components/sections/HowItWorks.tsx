"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Boxes,
  Workflow,
  Droplets,
  ShieldCheck,
  Database,
  ArrowRight,
  Code2,
  Layers,
} from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";

// Map SuiStream capability indices to translation keys.
// Order matches SUISTREAM_PRIMITIVE_DESCRIPTION.capabilities in sui-features.ts.
const SUISTREAM_CAP_KEYS = [
  { labelKey: "how.cap.ratePerSec", valueKey: "how.cap.configurable" },
  { labelKey: "how.cap.cliffVesting", valueKey: "how.cap.milestoneUnlock" },
  { labelKey: "how.cap.transferable", valueKey: "how.cap.sendToOther" },
  { labelKey: "how.cap.cancellable", valueKey: "how.cap.refundRemaining" },
  { labelKey: "how.cap.composable", valueKey: "how.cap.packNft" },
] as const;

// Translation keys for the Layer 2 step list.
const LAYER2_STEPS = [
  { step: "1", labelKey: "how.step1.label", descKey: "how.step1.desc" },
  { step: "2", labelKey: "how.step2.label", descKey: "how.step2.desc" },
  { step: "3", labelKey: "how.step3.label", descKey: "how.step3.desc" },
  { step: "4", labelKey: "how.step4.label", descKey: "how.step4.desc" },
  { step: "5", labelKey: "how.step5.label", descKey: "how.step5.desc" },
] as const;

// Translation keys for the central flow diagram.
const FLOW_STEPS = [
  {
    icon: Database,
    color: "text-teal-600 bg-teal-50",
    titleKey: "how.flow.walrus",
    descKey: "how.flow.walrusDesc",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-600 bg-emerald-50",
    titleKey: "how.flow.dao",
    descKey: "how.flow.daoDesc",
  },
  {
    icon: Workflow,
    color: "text-amber-600 bg-amber-50",
    titleKey: "how.flow.ptb",
    descKey: "how.flow.ptbDesc",
  },
  {
    icon: Droplets,
    color: "text-primary bg-primary/10",
    titleKey: "how.flow.stream",
    descKey: "how.flow.streamDesc",
  },
  {
    icon: ArrowRight,
    color: "text-rose-600 bg-rose-50",
    titleKey: "how.flow.withdraw",
    descKey: "how.flow.withdrawDesc",
  },
] as const;

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-accent/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <Badge variant="outline" className="mb-4 gap-1.5 bg-accent/30 border-accent/50">
            <Layers className="h-3 w-3" />
            <span className="text-xs font-semibold">{t("how.badge")}</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="text-gradient-emerald">{t("how.title")}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("how.subtitle")}
          </p>
        </motion.div>

        {/* Layer diagram */}
        <div className="grid lg:grid-cols-2 gap-6 mb-16">
          {/* Layer 1: SuiStream */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-glow-emerald"
          >
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {t("how.layer1")}
            </div>
            <div className="flex items-start justify-between mb-4 mt-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">{t("arch.suiStream.name")}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("arch.suiStream.tagline")}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              {t("arch.suiStream.description")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUISTREAM_CAP_KEYS.map((cap) => (
                <div
                  key={cap.labelKey}
                  className="flex items-start gap-2 rounded-lg bg-background/50 border border-border/40 p-2.5"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-foreground">{t(cap.labelKey)}</div>
                    <div className="text-muted-foreground">{t(cap.valueKey)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                <Code2 className="h-3.5 w-3.5" />
                {t("how.moveContract")}
              </div>
              <code className="text-[11px] font-mono text-muted-foreground break-all">
                module suistream::stream {"{ "}
                public fun create_stream&lt;T&gt;(...): Stream&lt;T&gt; {" }"}
              </code>
            </div>
          </motion.div>

          {/* Layer 2: SahamKita */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border-2 border-amber-500/40 bg-card p-6 shadow-glow-amber"
          >
            <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
              {t("how.layer2")}
            </div>
            <div className="flex items-start justify-between mb-4 mt-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Boxes className="h-5 w-5 text-amber-600" />
                  <h3 className="text-xl font-bold">SahamKita App</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("how.app.tagline")}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              {t("how.app.body")}
            </p>

            <div className="space-y-2">
              {LAYER2_STEPS.map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-foreground">{t(item.labelKey)}</span>
                    <span className="text-muted-foreground"> — {t(item.descKey)}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Central flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-card border border-border/60 p-6 lg:p-8 shadow-sm"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold">{t("how.flowTitle")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t("how.flowSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.titleKey} className="relative">
                <div className="rounded-xl border border-border/60 bg-background/50 p-4 h-full flex flex-col gap-2">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${step.color}`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-bold">{t(step.titleKey)}</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">{t(step.descKey)}</div>
                </div>
                {i < 4 && (
                  <ArrowRight className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 z-10 bg-background" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
