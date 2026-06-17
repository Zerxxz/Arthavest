"use client";

import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  Upload,
  CheckCircle2,
  Loader2,
  Sparkles,
  Store,
  FileText,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Boxes,
  Zap,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { formatIDR, shortAddress } from "@/lib/format";
import type { UMKMCategory } from "@/lib/types";

const STEPS = [
  { id: 0, label: "Info Dasar", icon: Store },
  { id: 1, label: "Finansial", icon: Boxes },
  { id: 2, label: "Dokumen Walrus", icon: Database },
  { id: 3, label: "Review & Submit", icon: ShieldCheck },
];

const CATEGORIES: { value: UMKMCategory; label: string; emoji: string }[] = [
  { value: "kuliner", label: "Kuliner", emoji: "🍲" },
  { value: "kopi", label: "Kopi", emoji: "☕" },
  { value: "laundry", label: "Laundry", emoji: "🧺" },
  { value: "kerajinan", label: "Kerajinan", emoji: "🥬" },
  { value: "jasa", label: "Jasa", emoji: "🔧" },
  { value: "pertanian", label: "Pertanian", emoji: "🌱" },
];

export function OnboardingUMKM() {
  const form = useAppStore((s) => s.onboardForm);
  const updateForm = useAppStore((s) => s.updateOnboardForm);
  const uploadWalrusDoc = useAppStore((s) => s.uploadWalrusDoc);
  const submitOnboard = useAppStore((s) => s.submitOnboard);
  const wallet = useAppStore((s) => s.wallet);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState<"idle" | "building" | "signing" | "executing" | "done">("idle");

  const handleUpload = async (docType: "legal" | "financial") => {
    const result = await uploadWalrusDoc(docType);
    if (result.success) {
      toast.success(`Upload ke Walrus sukses!`, {
        description: `Blob ID: ${result.blobId} · Tersimpan permanen & immutable`,
      });
    }
  };

  const handleSubmit = async () => {
    setSubmitting("building");
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting("signing");
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting("executing");
    await new Promise((r) => setTimeout(r, 1200));

    const result = submitOnboard();
    setSubmitting("done");

    if (result.success) {
      toast.success("UMKM onboarded!", {
        description: `${result.message} · tx ${shortAddress(result.txDigest)}`,
      });
      setTimeout(() => {
        setSubmitting("idle");
        setStep(0);
      }, 2000);
    } else {
      toast.error("Submit gagal", { description: result.message });
      setSubmitting("idle");
    }
  };

  const canNext = () => {
    switch (step) {
      case 0:
        return form.name && form.tagline && form.location && form.description;
      case 1:
        return form.monthlyRevenue > 0 && form.monthlyProfit > 0 && form.totalShares > 0 && form.pricePerShare > 0;
      case 2:
        return form.legalDocStatus === "uploaded" && form.financialDocStatus === "uploaded";
      default:
        return true;
    }
  };

  const totalValuation = form.totalShares * form.pricePerShare;
  const estApy = form.monthlyProfit > 0 && totalValuation > 0
    ? ((form.monthlyProfit * 12 / totalValuation) * 100)
    : 0;

  return (
    <section className="py-8">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Onboard UMKM ke SahamKita</h2>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            <Store className="h-3.5 w-3.5 text-primary" />
            Mint UMKM NFT + share tokens via PTB · Dokumen legal permanen di Walrus
          </p>
        </div>

        {/* Stepper */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    step > s.id
                      ? "bg-emerald-500 text-white"
                      : step === s.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <div className="hidden sm:block flex-1 min-w-0">
                  <div className={`text-xs font-medium ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>
                    Step {s.id + 1}
                  </div>
                  <div className={`text-[11px] ${step === s.id ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                    {s.label}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`hidden sm:block h-0.5 flex-1 rounded ${step > s.id ? "bg-emerald-500" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-6">
              {/* Step 0: Info Dasar */}
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                      <Store className="h-4 w-4 text-primary" />
                      Informasi Dasar UMKM
                    </h3>
                    <p className="text-xs text-muted-foreground">Detail ini akan tertera di marketplace & NFT object on-chain.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Nama UMKM *</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value })}
                        placeholder="cth: Kopi Senja"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Kategori *</Label>
                      <Select value={form.category} onValueChange={(v) => updateForm({ category: v as UMKMCategory })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              {c.emoji} {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Tagline *</Label>
                    <Input
                      value={form.tagline}
                      onChange={(e) => updateForm({ tagline: e.target.value })}
                      placeholder="cth: Spesialti coffee roastery dari Bandung"
                      maxLength={80}
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Lokasi *</Label>
                    <Input
                      value={form.location}
                      onChange={(e) => updateForm({ location: e.target.value })}
                      placeholder="cth: Bandung, Jawa Barat"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">Deskripsi *</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => updateForm({ description: e.target.value })}
                      placeholder="Ceritakan sejarah, model bisnis, rencana ekspansi, dan use of funds..."
                      rows={4}
                      maxLength={500}
                    />
                    <div className="text-[10px] text-muted-foreground mt-1 text-right">{form.description.length}/500</div>
                  </div>
                </div>
              )}

              {/* Step 1: Finansial */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                      <Boxes className="h-4 w-4 text-primary" />
                      Data Finansial & Tokenomics
                    </h3>
                    <p className="text-xs text-muted-foreground">Menentukan valuasi, jumlah saham, dan estimasi APY investor.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Revenue bulanan (IDR) *</Label>
                      <Input
                        type="number"
                        value={form.monthlyRevenue || ""}
                        onChange={(e) => updateForm({ monthlyRevenue: Number(e.target.value) })}
                        placeholder="cth: 145000000"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Profit bulanan (IDR) *</Label>
                      <Input
                        type="number"
                        value={form.monthlyProfit || ""}
                        onChange={(e) => updateForm({ monthlyProfit: Number(e.target.value) })}
                        placeholder="cth: 28000000"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Total saham (supply) *</Label>
                      <Input
                        type="number"
                        value={form.totalShares || ""}
                        onChange={(e) => updateForm({ totalShares: Number(e.target.value) })}
                        placeholder="cth: 1800"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">Harga per saham (IDR) *</Label>
                      <Input
                        type="number"
                        value={form.pricePerShare || ""}
                        onChange={(e) => updateForm({ pricePerShare: Number(e.target.value) })}
                        placeholder="cth: 1000000"
                      />
                    </div>
                  </div>

                  {/* Auto-calculated valuation card */}
                  {totalValuation > 0 && (
                    <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/20 p-4">
                      <div className="text-xs font-semibold text-primary mb-2">Preview Tokenomics</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <div className="text-[10px] text-muted-foreground">Total valuasi</div>
                          <div className="text-base font-bold">{formatIDR(totalValuation, { compact: true })}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Estimasi APY</div>
                          <div className="text-base font-bold text-emerald-600">{estApy.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">Profit per saham/bulan</div>
                          <div className="text-base font-bold text-amber-600">
                            {form.totalShares > 0 ? formatIDR(form.monthlyProfit / form.totalShares, { compact: true }) : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Walrus */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                      <Database className="h-4 w-4 text-primary" />
                      Upload Dokumen ke Walrus
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Dokumen disimpan permanen & immutable di Walrus storage. Blob ID tercatat on-chain sebagai audit trail.
                      DAO jury akan verifikasi dokumen ini sebelum UMKM bisa list di marketplace.
                    </p>
                  </div>

                  <WalrusUploadCard
                    title="Dokumen Legal"
                    description="Akta pendirian, NPWP, KTP pemilik (PDF, max 10MB)"
                    icon={FileText}
                    status={form.legalDocStatus}
                    blobId={form.legalDocBlobId}
                    onUpload={() => handleUpload("legal")}
                  />

                  <WalrusUploadCard
                    title="Laporan Keuangan"
                    description="Laporan rugi laba 6 bulan terakhir + bank statement (PDF/Excel, max 10MB)"
                    icon={ImageIcon}
                    status={form.financialDocStatus}
                    blobId={form.financialDocBlobId}
                    onUpload={() => handleUpload("financial")}
                  />

                  {/* Walrus info */}
                  <div className="rounded-lg bg-amber-50/60 border border-amber-200/40 p-3 text-[11px]">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-amber-900 mb-1">Tentang Walrus Storage</div>
                        <p className="text-amber-700 leading-relaxed">
                          Walrus adalah storage terdesentralisasi Sui ecosystem. Setiap file di-encode dengan
                          erasure coding (Reed-Solomon) lalu didistribusikan ke ratusan node. Setelah blob ID
                          tercatat on-chain, dokumen tidak bisa dihapus atau diubah — audit trail permanen untuk
                          investor & regulator.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Review & Submit Onboarding
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      1 PTB akan dieksekusi: mint UMKM NFT + mint {form.totalShares} share tokens + emit onboarded event.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 divide-y divide-border/40">
                    <ReviewRow label="Nama UMKM" value={form.name || "-"} />
                    <ReviewRow label="Kategori" value={CATEGORIES.find((c) => c.value === form.category)?.label ?? "-"} />
                    <ReviewRow label="Lokasi" value={form.location || "-"} />
                    <ReviewRow label="Tagline" value={form.tagline || "-"} />
                    <ReviewRow label="Revenue/bulan" value={form.monthlyRevenue ? formatIDR(form.monthlyRevenue) : "-"} />
                    <ReviewRow label="Profit/bulan" value={form.monthlyProfit ? formatIDR(form.monthlyProfit) : "-"} />
                    <ReviewRow label="Total saham" value={form.totalShares ? `${form.totalShares} saham` : "-"} />
                    <ReviewRow label="Harga/saham" value={form.pricePerShare ? formatIDR(form.pricePerShare) : "-"} />
                    <ReviewRow label="Valuasi total" value={totalValuation > 0 ? formatIDR(totalValuation) : "-"} />
                    <ReviewRow label="Estimasi APY" value={`${estApy.toFixed(1)}%`} />
                    <ReviewRow label="Walrus blob (legal)" value={form.legalDocBlobId ?? "-"} mono />
                    <ReviewRow label="Walrus blob (finansial)" value={form.financialDocBlobId ?? "-"} mono />
                  </div>

                  {/* PTB preview */}
                  <div className="rounded-xl bg-zinc-900 border border-zinc-700 p-4 overflow-x-auto scrollbar-warm">
                    <div className="text-[10px] font-mono text-zinc-400 mb-2">{"// PTB preview"}</div>
                    <pre className="text-[11px] leading-relaxed text-zinc-300 font-mono">
{`let ptb = ProgrammableTransaction::new();

// 1. Mint UMKM NFT object
let umkm = ptb.move_call(
  "saham_kita::saham_kita", "onboard_umkm",
  [admin_cap, treasury, name, location,
   ${form.legalDocBlobId ? `"${form.legalDocBlobId}"` : "legal_blob_id"},
   ${form.totalShares}, ${form.pricePerShare}]
);

// 2. Mint ${form.totalShares} share tokens (SAHAM)
for i in 0..${form.totalShares} {
  let share = ptb.move_call(
    "sui::coin", "mint",
    [treasury_cap<SAHAM>, 1]
  );
  ptb.transfer_args(umkm_owner, share);
}

// 3. Emit UMKMOnboarded event
ptb.move_call("saham_kita::saham_kita", "emit_onboarded", [umkm]);

ptb.execute(); // 1 tx, atomic, ~800ms finality`}
                    </pre>
                  </div>

                  {/* Submit phases */}
                  {submitting !== "idle" && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-2">
                      {[
                        { key: "building", label: "Membangun PTB (mint NFT + share tokens)" },
                        { key: "signing", label: "Menandatangani transaksi" },
                        { key: "executing", label: "Eksekusi atomik di Sui testnet" },
                      ].map((phase, i) => {
                        const order = ["building", "signing", "executing", "done"];
                        const currentIdx = order.indexOf(submitting);
                        const phaseIdx = order.indexOf(phase.key);
                        const isDone = submitting === "done" || phaseIdx < currentIdx;
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
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting !== "idle"}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>

          <div className="text-xs text-muted-foreground">
            Step {step + 1} dari {STEPS.length}
          </div>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canNext()}
              className="gap-2"
            >
              Lanjut
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting !== "idle"}
              className="gap-2 shadow-glow-emerald"
            >
              {submitting === "done" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Onboarded!
                </>
              ) : submitting !== "idle" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Submit Onboarding
                </>
              )}
            </Button>
          )}
        </div>

        {/* Wallet info */}
        <div className="text-center text-[11px] text-muted-foreground">
          Wallet: <span className="font-mono">{shortAddress(wallet.address)}</span> · Submit akan trigger PTB di Sui testnet
        </div>
      </div>
    </section>
  );
}

function WalrusUploadCard({
  title,
  description,
  icon: Icon,
  status,
  blobId,
  onUpload,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "idle" | "uploading" | "uploaded" | "error";
  blobId: string | null;
  onUpload: () => void;
}) {
  return (
    <div className={`rounded-xl border-2 p-4 transition-colors ${
      status === "uploaded" ? "border-emerald-300 bg-emerald-50/40" :
      status === "uploading" ? "border-primary/30 bg-primary/5" :
      "border-border/60 bg-card"
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            status === "uploaded" ? "bg-emerald-100" : "bg-secondary"
          }`}>
            {status === "uploaded" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : status === "uploading" ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
            ) : (
              <Icon className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-[11px] text-muted-foreground">{description}</div>
            {status === "uploading" && (
              <div className="mt-2">
                <Progress value={50} className="h-1" />
                <div className="text-[10px] text-primary mt-1 font-mono">Uploading to Walrus...</div>
              </div>
            )}
            {status === "uploaded" && blobId && (
              <div className="mt-2 text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-2 py-1 break-all">
                {blobId}
              </div>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant={status === "uploaded" ? "outline" : "default"}
          onClick={onUpload}
          disabled={status === "uploading" || status === "uploaded"}
          className="gap-1.5"
        >
          {status === "uploaded" ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Uploaded
            </>
          ) : status === "uploading" ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              Upload
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-semibold text-right ${mono ? "font-mono text-[10px]" : ""}`}>{value}</span>
    </div>
  );
}
