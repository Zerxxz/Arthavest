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
import { SUISTREAM_PRIMITIVE_DESCRIPTION } from "@/lib/sui-features";

export function HowItWorks() {
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
            <span className="text-xs font-semibold">Cara Kerja</span>
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Dua lapisan,{" "}
            <span className="text-gradient-emerald">satu pengalaman</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            SahamKita adalah aplikasi yang dibangun di atas{" "}
            <span className="font-semibold text-foreground">SuiStream</span> — primitive
            money-stream yang composable. Setiap profit bulanan UMKM dikonversi menjadi stream
            object yang mengalir ke wallet investor setiap detik.
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
              LAYER 1 · PRIMITIVE
            </div>
            <div className="flex items-start justify-between mb-4 mt-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">{SUISTREAM_PRIMITIVE_DESCRIPTION.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {SUISTREAM_PRIMITIVE_DESCRIPTION.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              {SUISTREAM_PRIMITIVE_DESCRIPTION.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUISTREAM_PRIMITIVE_DESCRIPTION.capabilities.map((cap) => (
                <div
                  key={cap.label}
                  className="flex items-start gap-2 rounded-lg bg-background/50 border border-border/40 p-2.5"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-foreground">{cap.label}</div>
                    <div className="text-muted-foreground">{cap.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                <Code2 className="h-3.5 w-3.5" />
                Move contract
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
              LAYER 2 · APLIKASI
            </div>
            <div className="flex items-start justify-between mb-4 mt-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Boxes className="h-5 w-5 text-amber-600" />
                  <h3 className="text-xl font-bold">SahamKita App</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Marketplace kepemilikan UMKM + distribusi profit via SuiStream
                </p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground mb-4">
              SahamKita membungkus SuiStream dengan UX onboarding UMKM dan investor. Setiap UMKM
              adalah NFT object, setiap saham adalah fungible token, dan setiap distribusi profit
              adalah PTB yang memanggil SuiStream::create_stream untuk semua investor dalam 1 tx.
            </p>

            <div className="space-y-2">
              {[
                { step: "1", label: "UMKM onboard", desc: "Admin verifikasi → mint UMKM NFT + 1800 share tokens" },
                { step: "2", label: "Investor beli share", desc: "PTB: pay SUI → receive share token → emit receipt NFT" },
                { step: "3", label: "Owner lapork profit", desc: "Submit profit bulanan + bukti Walrus → verifikasi DAO" },
                { step: "4", label: "Distribusi otomatis", desc: "PTB bulk: create_stream untuk setiap holder, atomic" },
                { step: "5", label: "Investor withdraw", desc: "Stream object ada di wallet, withdraw kapan saja" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold text-foreground">{item.label}</span>
                    <span className="text-muted-foreground"> — {item.desc}</span>
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
            <h3 className="text-lg font-bold">Alur distribusi profit end-to-end</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Dari UMKM lapor profit → investor terima stream → withdraw kapan saja
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
            {[
              {
                icon: Database,
                title: "Walrus",
                desc: "Bukti profit (invoice, bank stmt) upload ke Walrus, blob ID on-chain",
                color: "text-teal-600 bg-teal-50",
              },
              {
                icon: ShieldCheck,
                title: "DAO Verify",
                desc: "Jury verifikasi dokumen, approve profit distribution",
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                icon: Workflow,
                title: "PTB Bulk",
                desc: "1 tx: create_stream untuk semua holder (47-312 investor)",
                color: "text-amber-600 bg-amber-50",
              },
              {
                icon: Droplets,
                title: "SuiStream",
                desc: "Stream object dibuat di wallet investor, accrue per detik",
                color: "text-primary bg-primary/10",
              },
              {
                icon: ArrowRight,
                title: "Withdraw",
                desc: "Investor withdraw kapan saja, sponsored tx untuk first-timer",
                color: "text-rose-600 bg-rose-50",
              },
            ].map((step, i) => (
              <div key={step.title} className="relative">
                <div className="rounded-xl border border-border/60 bg-background/50 p-4 h-full flex flex-col gap-2">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${step.color}`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-bold">{step.title}</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</div>
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
