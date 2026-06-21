"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Boxes,
  Workflow,
  Fingerprint,
  Gift,
  Database,
  LineChart,
  Sparkles,
  Code2,
  Droplets,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { SUI_FEATURES } from "@/lib/sui-features";
import * as Icons from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Boxes,
  Workflow,
  Fingerprint,
  Gift,
  Database,
  LineChart,
};

// Map SuiStream capability indices to translation keys (first 4 used here).
// Order matches SUISTREAM_PRIMITIVE_DESCRIPTION.capabilities in sui-features.ts.
const SUISTREAM_CAP_KEYS = [
  { labelKey: "how.cap.ratePerSec", valueKey: "how.cap.configurable" },
  { labelKey: "how.cap.cliffVesting", valueKey: "how.cap.milestoneUnlock" },
  { labelKey: "how.cap.transferable", valueKey: "how.cap.sendToOther" },
  { labelKey: "how.cap.cancellable", valueKey: "how.cap.refundRemaining" },
  { labelKey: "how.cap.composable", valueKey: "how.cap.packNft" },
] as const;

// Tree visualization items. Names + types are Move identifiers (kept as-is);
// `descKey` points to the translated caption.
const TREE_ITEMS = [
  { name: "UMKM", type: "struct has key, store", descKey: "arch.tree.umkm", icon: "🏪" },
  { name: "ShareToken", type: "coin::Coin<ARTHA>", descKey: "arch.tree.shareToken", icon: "🪙" },
  { name: "ProfitReport", type: "struct has key", descKey: "arch.tree.profitReport", icon: "📊" },
  { name: "Distribution", type: "struct has key", descKey: "arch.tree.distribution", icon: "📦" },
] as const;

export function Architecture() {
  const { t } = useTranslation();
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-accent/10 to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <Badge variant="outline" className="mb-4 gap-1.5 bg-accent/30 border-accent/50">
            <Sparkles className="h-3 w-3" />
            <span className="text-xs font-semibold">{t("arch.badge")}</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="text-gradient-emerald">{t("arch.title")}</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t("arch.subtitle")}
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {SUI_FEATURES.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon] ?? Boxes;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full p-5 hover:shadow-glow-emerald transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] gap-0.5">
                      <Code2 className="h-2.5 w-2.5" />
                      {feature.id}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-base mb-2">{t(`arch.feature.${feature.id}.name`)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {t(`arch.feature.${feature.id}.description`)}
                  </p>
                  <div className="space-y-1.5 pt-3 border-t border-border/40">
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] font-mono text-primary font-semibold uppercase tracking-wide min-w-[40px]">
                        {t("arch.pakai")}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{t(`arch.feature.${feature.id}.usedIn`)}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-[10px] font-mono text-amber-600 font-semibold uppercase tracking-wide min-w-[40px]">
                        {t("arch.benefit")}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{t(`arch.feature.${feature.id}.benefit`)}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Smart contract architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-card border border-border/60 p-6 lg:p-8 shadow-sm"
        >
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
            {/* Left: Architecture diagram */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Boxes className="h-5 w-5 text-primary" />
                {t("arch.objectModelTitle")}
              </h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {t("arch.objectModelBody")}
              </p>

              {/* Tree visualization */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
                  <Boxes className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="font-bold">Package: arthavest::</span>
                </div>
                <div className="ml-6 space-y-1.5">
                  {TREE_ITEMS.map((item) => (
                    <div key={item.name} className="flex items-start gap-2 p-2.5 rounded-lg bg-secondary/40 border border-border/40">
                      <span className="text-base">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground">{item.name}</div>
                        <div className="text-[10px] text-primary">{item.type}</div>
                        <div className="text-[10px] text-muted-foreground">{t(item.descKey)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 mt-2">
                  <Droplets className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  <span className="font-bold">Package: suistream::</span>
                  <Badge variant="outline" className="text-[9px] ml-auto">{t("arch.primitive")}</Badge>
                </div>
                <div className="ml-6 space-y-1.5">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/40">
                    <span className="text-base">💧</span>
                    <div className="flex-1">
                      <div className="font-bold text-foreground">Stream&lt;T&gt;</div>
                      <div className="text-[10px] text-amber-700">struct has key · object owned by recipient</div>
                      <div className="text-[10px] text-muted-foreground">Fields: sender, recipient, rate, start, end, withdrawn</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: PTB example */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Workflow className="h-5 w-5 text-amber-600" />
                {t("arch.ptbTitle")}
              </h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {t("arch.ptbBody")}
              </p>

              <div className="rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-800/60">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">distribute_profit.ptb</span>
                </div>
                <pre className="p-4 text-[11px] leading-relaxed overflow-x-auto scrollbar-warm">
                  <code className="text-zinc-300 font-mono">
{`// PTB bulk: distribute monthly profit
// to all shareholders atomically

let ptb = ProgrammableTransaction::new();

// 1. Load ProfitReport (verified)
let report = ptb.obj(${"`"}${"`"}${"`"}0xabc...profit_report${"`"}${"`"}${"`"});
let amount = ptb.move_call(report, "amount");

// 2. Pay profit from UMKM treasury
let coin = ptb.move_call(
  "sui::pay", "split",
  [treasury, amount]
);

// 3. For each shareholder → create stream
for (holder in holders) {
  let share = holder.shares_owned;
  let stream_amount = (amount * share)
                    / total_shares;
  let rate = stream_amount / SECONDS_30D;

  let stream = ptb.move_call(
    "suistream::stream", "create_stream",
    [coin, holder.addr, rate, DURATION]
  );

  ptb.transfer_args(holder.addr, stream);
}

// 4. Emit Distribution receipt NFT
ptb.move_call(
  "arthavest::distribution",
  "mint_receipt",
  [umkm, holders.length, amount]
);

// 5. Execute atomically
client.execute(ptb); // 1 tx, ~800ms finality`}
                  </code>
                </pre>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="rounded-lg bg-secondary/40 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground">{t("arch.stat.investor")}</div>
                  <div className="text-base font-bold text-primary">47-312</div>
                </div>
                <div className="rounded-lg bg-secondary/40 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground">{t("arch.stat.finality")}</div>
                  <div className="text-base font-bold text-emerald-600">~800ms</div>
                </div>
                <div className="rounded-lg bg-secondary/40 p-2.5 text-center">
                  <div className="text-[10px] text-muted-foreground">{t("arch.stat.gas")}</div>
                  <div className="text-base font-bold text-amber-600">~0.03 SUI</div>
                </div>
              </div>

              {/* Live deployment proof — published on Sui testnet */}
              <div className="mt-4 rounded-xl border-2 border-emerald-300/60 bg-emerald-50/60 dark:bg-emerald-900/20 dark:border-emerald-600/40 p-4">
                <div className="flex items-start gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                      ✅ Live on Sui Testnet
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Move contracts published &amp; verified on Sui Explorer
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-muted-foreground">Package ID:</span>
                    <div className="break-all text-foreground">
                      0x271298465a97fc009872c8708c438325f7f6e65c729e41909860cad598e41fbc
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Publish tx:</span>
                    <div className="break-all text-foreground">2oRV6K595Y1SQkMNtCkRSkFYAq4kRjM1ey8edg57xZ36</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <a
                    href="https://suiexplorer.com/tx/2oRV6K595Y1SQkMNtCkRSkFYAq4kRjM1ey8edg57xZ36?network=testnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View tx on Sui Explorer
                  </a>
                  <a
                    href="https://suiexplorer.com/package/0x271298465a97fc009872c8708c438325f7f6e65c729e41909860cad598e41fbc?network=testnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View package on Sui Explorer
                  </a>
                </div>
                <div className="text-[10px] text-muted-foreground mt-2">
                  Gas used: 0.0495 SUI · Modules: <code className="font-mono">arthavest</code>,{" "}
                  <code className="font-mono">stream</code>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SuiStream primitive recap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 rounded-2xl bg-gradient-to-br from-primary/5 via-accent/10 to-amber-500/5 border border-primary/20 p-6 lg:p-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="flex-1">
              <Badge variant="outline" className="mb-2 gap-1.5 bg-background/60 border-primary/30">
                <Droplets className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-semibold uppercase tracking-wide">{t("arch.reusability")}</span>
              </Badge>
              <h3 className="text-xl font-bold mb-2">
                {t("arch.reusabilityTitle")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("arch.reusabilityBody")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 min-w-[200px]">
              {SUISTREAM_CAP_KEYS.slice(0, 4).map((cap) => (
                <div key={cap.labelKey} className="rounded-lg bg-background/70 border border-border/40 p-2">
                  <div className="text-[10px] font-semibold text-primary">{t(cap.labelKey)}</div>
                  <div className="text-[10px] text-muted-foreground">{t(cap.valueKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
