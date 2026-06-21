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
import { useTranslation } from "@/lib/useTranslation";
import { useSuiTransactions } from "@/lib/sui/useSuiTransactions";
import { getExplorerTxUrl } from "@/lib/sui/transactions";
import { categoryIconPath } from "@/lib/category-icons";
import type { UMKMCategory } from "@/lib/types";

const STEPS = [
  { id: 0, icon: Store },
  { id: 1, icon: Boxes },
  { id: 2, icon: Database },
  { id: 3, icon: ShieldCheck },
];

const CATEGORY_VALUES: { value: UMKMCategory }[] = [
  { value: "kuliner" },
  { value: "kopi" },
  { value: "laundry" },
  { value: "kerajinan" },
  { value: "jasa" },
  { value: "pertanian" },
];

export function OnboardingUMKM() {
  const form = useAppStore((s) => s.onboardForm);
  const updateForm = useAppStore((s) => s.updateOnboardForm);
  const uploadWalrusDoc = useAppStore((s) => s.uploadWalrusDoc);
  const submitOnboard = useAppStore((s) => s.submitOnboard);
  const wallet = useAppStore((s) => s.wallet);
  const { t } = useTranslation();
  const suiTx = useSuiTransactions();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState<"idle" | "building" | "signing" | "executing" | "done">("idle");

  const handleUpload = async (docType: "legal" | "financial") => {
    const result = await uploadWalrusDoc(docType);
    if (result.success) {
      toast.success(`Upload to Walrus successful!`, {
        description: `Blob ID: ${result.blobId} · Stored permanently & immutable`,
      });
    }
  };

  const handleSubmit = async () => {
    setSubmitting("building");
    await new Promise((r) => setTimeout(r, 600));

    // Try real on-chain transaction first
    if (suiTx.isReady && form.legalDocBlobId) {
      setSubmitting("signing");
      const result = await suiTx.onboardOnChain({
        umkmName: form.name,
        location: form.location,
        docsBlobId: form.legalDocBlobId,
        totalShares: form.totalShares,
        pricePerShare: form.pricePerShare,
      });
      setSubmitting("executing");
      await new Promise((r) => setTimeout(r, 800));

      if (result.success) {
        // Also update mock store for UX continuity
        submitOnboard();
        setSubmitting("done");
        toast.success("UMKM onboarded on-chain!", {
          description: `Real tx: ${result.digest?.slice(0, 12)}...${result.digest?.slice(-6)} · ${form.totalShares} ARTHAVEST tokens minted`,
          action: {
            label: "View on Sui Explorer",
            onClick: () => window.open(getExplorerTxUrl(result.digest!), "_blank"),
          },
        });
        setTimeout(() => {
          setSubmitting("idle");
          setStep(0);
        }, 2500);
        return;
      }
      // If real tx failed, fall through to mock
      setSubmitting("idle");
      return;
    }

    // Mock simulation fallback (no real wallet or no Walrus blob)
    setSubmitting("signing");
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting("executing");
    await new Promise((r) => setTimeout(r, 1200));

    const result = submitOnboard();
    setSubmitting("done");

    if (result.success) {
      toast.success("MSME onboarded!", {
        description: `${result.message} · tx ${shortAddress(result.txDigest)}`,
      });
      setTimeout(() => {
        setSubmitting("idle");
        setStep(0);
      }, 2000);
    } else {
      toast.error("Submit failed", { description: result.message });
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
          <h2 className="text-2xl font-bold tracking-tight">{t("onboard.title")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
            <Store className="h-3.5 w-3.5 text-primary" />
            {t("onboard.subtitle")}
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
                    {t("onboard.step")} {s.id + 1}
                  </div>
                  <div className={`text-[11px] ${step === s.id ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                    {t(`onboard.step${s.id + 1}`)}
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
                      {t("onboard.basicTitle")}
                    </h3>
                    <p className="text-xs text-muted-foreground">{t("onboard.basicSubtitle")}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">{t("onboard.name")}</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => updateForm({ name: e.target.value })}
                        placeholder={t("onboard.namePlaceholder")}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">{t("onboard.category")}</Label>
                      <Select value={form.category} onValueChange={(v) => updateForm({ category: v as UMKMCategory })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_VALUES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              <span className="flex items-center gap-2">
                                <img
                                  src={categoryIconPath(c.value)}
                                  alt=""
                                  className="h-5 w-5 object-contain"
                                />
                                {t(`market.cat.${c.value}`)}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">{t("onboard.tagline")}</Label>
                    <Input
                      value={form.tagline}
                      onChange={(e) => updateForm({ tagline: e.target.value })}
                      placeholder={t("onboard.taglinePlaceholder")}
                      maxLength={80}
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">{t("onboard.location")}</Label>
                    <Input
                      value={form.location}
                      onChange={(e) => updateForm({ location: e.target.value })}
                      placeholder={t("onboard.locationPlaceholder")}
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1.5 block">{t("onboard.description")}</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => updateForm({ description: e.target.value })}
                      placeholder={t("onboard.descriptionPlaceholder")}
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
                      {t("onboard.financialTitle")}
                    </h3>
                    <p className="text-xs text-muted-foreground">{t("onboard.financialSubtitle")}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">{t("onboard.monthlyRevenue")}</Label>
                      <Input
                        type="number"
                        value={form.monthlyRevenue || ""}
                        onChange={(e) => updateForm({ monthlyRevenue: Number(e.target.value) })}
                        placeholder="e.g.: 145000000"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">{t("onboard.monthlyProfit")}</Label>
                      <Input
                        type="number"
                        value={form.monthlyProfit || ""}
                        onChange={(e) => updateForm({ monthlyProfit: Number(e.target.value) })}
                        placeholder="e.g.: 28000000"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">{t("onboard.totalShares")}</Label>
                      <Input
                        type="number"
                        value={form.totalShares || ""}
                        onChange={(e) => updateForm({ totalShares: Number(e.target.value) })}
                        placeholder="e.g.: 1800"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">{t("onboard.pricePerShare")}</Label>
                      <Input
                        type="number"
                        value={form.pricePerShare || ""}
                        onChange={(e) => updateForm({ pricePerShare: Number(e.target.value) })}
                        placeholder="e.g.: 1000000"
                      />
                    </div>
                  </div>

                  {/* Auto-calculated valuation card */}
                  {totalValuation > 0 && (
                    <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/20 p-4">
                      <div className="text-xs font-semibold text-primary mb-2">{t("onboard.tokenomicsPreview")}</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div>
                          <div className="text-[10px] text-muted-foreground">{t("onboard.totalValuation")}</div>
                          <div className="text-base font-bold">{formatIDR(totalValuation, { compact: true })}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">{t("onboard.estAPY")}</div>
                          <div className="text-base font-bold text-emerald-600">{estApy.toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground">{t("onboard.profitPerShare")}</div>
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
                      {t("onboard.walrusTitle")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("onboard.walrusSubtitle")}
                    </p>
                  </div>

                  <WalrusUploadCard
                    title={t("onboard.legalDoc")}
                    description={t("onboard.legalDocDesc")}
                    icon={FileText}
                    status={form.legalDocStatus}
                    blobId={form.legalDocBlobId}
                    onUpload={() => handleUpload("legal")}
                  />

                  <WalrusUploadCard
                    title={t("onboard.financialDoc")}
                    description={t("onboard.financialDocDesc")}
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
                        <div className="font-semibold text-amber-900 mb-1">{t("onboard.aboutWalrus")}</div>
                        <p className="text-amber-700 leading-relaxed">
                          {t("onboard.aboutWalrusBody")}
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
                      {t("onboard.reviewTitle")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t("onboard.reviewSubtitle", { n: form.totalShares })}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 divide-y divide-border/40">
                    <ReviewRow label={t("onboard.name").replace(" *", "")} value={form.name || "-"} />
                    <ReviewRow label={t("onboard.category").replace(" *", "")} value={CATEGORY_VALUES.find((c) => c.value === form.category) ? t(`market.cat.${form.category}`) : "-"} />
                    <ReviewRow label={t("onboard.location").replace(" *", "")} value={form.location || "-"} />
                    <ReviewRow label={t("onboard.tagline").replace(" *", "")} value={form.tagline || "-"} />
                    <ReviewRow label={t("onboard.monthlyRevenue").replace(" (IDR) *", "").replace(" *", "")} value={form.monthlyRevenue ? formatIDR(form.monthlyRevenue) : "-"} />
                    <ReviewRow label={t("onboard.monthlyProfit").replace(" (IDR) *", "").replace(" *", "")} value={form.monthlyProfit ? formatIDR(form.monthlyProfit) : "-"} />
                    <ReviewRow label={t("onboard.totalShares").replace(" (supply) *", "").replace(" (供应量) *", "").replace(" *", "")} value={form.totalShares ? `${form.totalShares} shares` : "-"} />
                    <ReviewRow label={t("onboard.pricePerShare").replace(" (IDR) *", "").replace(" *", "")} value={form.pricePerShare ? formatIDR(form.pricePerShare) : "-"} />
                    <ReviewRow label={t("onboard.totalValuation")} value={totalValuation > 0 ? formatIDR(totalValuation) : "-"} />
                    <ReviewRow label={t("onboard.estAPY")} value={`${estApy.toFixed(1)}%`} />
                    <ReviewRow label={t("onboard.walrusBlobLegal")} value={form.legalDocBlobId ?? "-"} mono />
                    <ReviewRow label={t("onboard.walrusBlobFinancial")} value={form.financialDocBlobId ?? "-"} mono />
                  </div>

                  {/* PTB preview */}
                  <div className="rounded-xl bg-zinc-900 border border-zinc-700 p-4 overflow-x-auto scrollbar-warm">
                    <div className="text-[10px] font-mono text-zinc-400 mb-2">{"// PTB preview"}</div>
                    <pre className="text-[11px] leading-relaxed text-zinc-300 font-mono">
{`let ptb = ProgrammableTransaction::new();

// 1. Mint UMKM NFT object
let umkm = ptb.move_call(
  "arthavest::arthavest", "onboard_umkm",
  [admin_cap, treasury, name, location,
   ${form.legalDocBlobId ? `"${form.legalDocBlobId}"` : "legal_blob_id"},
   ${form.totalShares}, ${form.pricePerShare}]
);

// 2. Mint ${form.totalShares} share tokens (ARTHA)
for i in 0..${form.totalShares} {
  let share = ptb.move_call(
    "sui::coin", "mint",
    [treasury_cap<ARTHA>, 1]
  );
  ptb.transfer_args(umkm_owner, share);
}

// 3. Emit UMKMOnboarded event
ptb.move_call("arthavest::arthavest", "emit_onboarded", [umkm]);

ptb.execute(); // 1 tx, atomic, ~800ms finality`}
                    </pre>
                  </div>

                  {/* Submit phases */}
                  {submitting !== "idle" && (
                    <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-2">
                      {[
                        { key: "building", label: t("onboard.ptbBuilding") },
                        { key: "signing", label: t("onboard.ptbSigning") },
                        { key: "executing", label: t("onboard.ptbExecuting") },
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
            {t("onboard.back")}
          </Button>

          <div className="text-xs text-muted-foreground">
            {t("onboard.step")} {step + 1} {t("onboard.of")} {STEPS.length}
          </div>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canNext()}
              className="gap-2"
            >
              {t("onboard.next")}
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
                  {t("onboard.onboarded")}
                </>
              ) : submitting !== "idle" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("onboard.submitting")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t("onboard.submit")}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Wallet info */}
        <div className="text-center text-[11px] text-muted-foreground">
          {t("onboard.walletInfo", { addr: shortAddress(wallet.address) })}
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
  const { t } = useTranslation();
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
                <div className="text-[10px] text-primary mt-1 font-mono">{t("onboard.uploading")} Walrus...</div>
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
              {t("onboard.uploaded")}
            </>
          ) : status === "uploading" ? (
            t("onboard.uploading")
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              {t("onboard.upload")}
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
