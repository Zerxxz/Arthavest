"use client";

import { useAppStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Database,
  CheckCircle2,
  XCircle,
  Gavel,
  Users,
  FileText,
  ExternalLink,
} from "lucide-react";
import { formatIDR, shortAddress } from "@/lib/format";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export function DAOJury() {
  const daoQueue = useAppStore((s) => s.daoQueue);
  const voteOnReport = useAppStore((s) => s.voteOnReport);

  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [voting, setVoting] = useState<"approve" | "reject" | null>(null);

  const handleVote = async (reportId: string, vote: "approve" | "reject") => {
    setVoting(vote);
    await new Promise((r) => setTimeout(r, 700));
    voteOnReport(reportId, vote);
    setVoting(null);
    toast.success(`Vote ${vote === "approve" ? "approve" : "reject"} terkirim`, {
      description: "Vote on-chain · tx 0x" + Math.random().toString(16).slice(2, 18),
    });
    setSelectedReport(null);
  };

  const selected = daoQueue.find((r) => r.id === selectedReport);

  const stats = {
    pending: daoQueue.filter((r) => r.status === "pending").length,
    approved: daoQueue.filter((r) => r.status === "approved").length,
    rejected: daoQueue.filter((r) => r.status === "rejected").length,
    totalValue: daoQueue.reduce((acc, r) => acc + (r.status === "approved" ? r.amount : 0), 0),
  };

  return (
    <section className="py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">DAO Jury Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-2">
              <Gavel className="h-3.5 w-3.5 text-primary" />
              Verifikasi profit report UMKM · Bukti permanen di Walrus · Vote on-chain
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5 bg-accent/30 border-accent/50">
            <ShieldCheck className="h-3 w-3" />
            Jury member
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Antrian pending", value: `${stats.pending}`, icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
            { label: "Approved bulan ini", value: `${stats.approved}`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
            { label: "Rejected", value: `${stats.rejected}`, icon: XCircle, color: "text-rose-600", bg: "bg-rose-100" },
            { label: "Total disetujui", value: formatIDR(stats.totalValue, { compact: true }), icon: Users, color: "text-primary", bg: "bg-primary/10" },
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

        {/* How jury works banner */}
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/10 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
              <Gavel className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-xs leading-relaxed">
              <div className="font-semibold text-sm mb-1">Cara kerja DAO Jury</div>
              <p className="text-muted-foreground">
                Setiap UMKM owner submit laporan profit bulanan beserta bukti (invoice, bank statement)
                yang disimpan permanen di Walrus. 5 jury terpilih melakukan verifikasi dokumen + vote.
                Kalau ≥3 approve → status <code className="font-mono text-emerald-600">approved</code> →
                owner bisa trigger PTB distribusi profit. Kalau ≥3 reject → status <code className="font-mono text-rose-600">rejected</code> →
                dispute escalation.
              </p>
            </div>
          </div>
        </Card>

        {/* Queue */}
        <div className="space-y-3">
          <h3 className="text-base font-bold">Antrian Verifikasi Profit Report</h3>
          {daoQueue.map((item) => {
            const approvalPct = (item.juryApprovals / item.juryRequired) * 100;
            const rejectionPct = (item.juryRejections / item.juryRequired) * 100;
            const submittedHoursAgo = Math.floor((Date.now() - item.submittedAt) / (1000 * 60 * 60));

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`overflow-hidden ${item.status === "approved" ? "border-emerald-300" : item.status === "rejected" ? "border-rose-300" : ""}`}>
                  <div className="grid lg:grid-cols-[auto_1fr_auto] gap-4 p-4">
                    {/* UMKM avatar */}
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${item.umkmGradient} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {item.umkmEmoji}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-sm">{item.umkmName}</h4>
                        <Badge variant="outline" className="text-[10px]">{item.reportingMonth}</Badge>
                        <Badge variant="secondary" className="text-[10px] font-mono gap-1">
                          <Database className="h-2.5 w-2.5" />
                          {item.walrusBlobId}
                        </Badge>
                        {item.status === "approved" && (
                          <Badge className="bg-emerald-500 text-white border-0 text-[10px] gap-1">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Approved
                          </Badge>
                        )}
                        {item.status === "rejected" && (
                          <Badge className="bg-rose-500 text-white border-0 text-[10px] gap-1">
                            <XCircle className="h-2.5 w-2.5" />
                            Rejected
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mb-2">
                        <div>
                          <span className="text-muted-foreground">Owner: </span>
                          <span className="font-mono">{shortAddress(item.ownerAddress)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount: </span>
                          <span className="font-bold text-emerald-600">{formatIDR(item.amount, { compact: true })}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Submitted: </span>
                          <span>{submittedHoursAgo}h lalu</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Required: </span>
                          <span className="font-mono">{item.juryApprovals}/{item.juryRequired} approve</span>
                        </div>
                      </div>

                      {/* Vote progress */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-3 w-3 text-emerald-600" />
                          <Progress value={approvalPct} className="h-1.5 flex-1" />
                          <span className="text-[10px] font-mono text-emerald-600 min-w-[24px]">{item.juryApprovals}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="h-3 w-3 text-rose-600" />
                          <Progress value={rejectionPct} className="h-1.5 flex-1" />
                          <span className="text-[10px] font-mono text-rose-600 min-w-[24px]">{item.juryRejections}</span>
                        </div>
                      </div>

                      {item.userVote && (
                        <div className="mt-2 text-[11px] flex items-center gap-1">
                          <span className="text-muted-foreground">Vote kamu:</span>
                          {item.userVote === "approve" ? (
                            <Badge variant="outline" className="text-[10px] gap-0.5 border-emerald-300 text-emerald-700 bg-emerald-50">
                              <ThumbsUp className="h-2.5 w-2.5" /> Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] gap-0.5 border-rose-300 text-rose-700 bg-rose-50">
                              <ThumbsDown className="h-2.5 w-2.5" /> Rejected
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:items-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReport(item.id)}
                        className="gap-1.5"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Review
                      </Button>
                      {item.status === "pending" && !item.userVote && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => handleVote(item.id, "approve")}
                            disabled={voting !== null}
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 border-rose-300 text-rose-700 hover:bg-rose-50"
                            onClick={() => handleVote(item.id, "reject")}
                            disabled={voting !== null}
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Review modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedReport(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-warm">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Review Profit Report — {selected.umkmName}
                </DialogTitle>
                <DialogDescription>
                  Verifikasi bukti di Walrus · Vote approve atau reject
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Report summary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="text-[10px] text-muted-foreground">Periode</div>
                    <div className="text-sm font-bold">{selected.reportingMonth}</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="text-[10px] text-muted-foreground">Amount dilaporkan</div>
                    <div className="text-sm font-bold text-emerald-600">{formatIDR(selected.amount)}</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="text-[10px] text-muted-foreground">Owner</div>
                    <div className="text-xs font-mono">{selected.ownerAddress}</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="text-[10px] text-muted-foreground">Submitted</div>
                    <div className="text-sm font-bold">{Math.floor((Date.now() - selected.submittedAt) / (1000 * 60 * 60))}h lalu</div>
                  </div>
                </div>

                {/* Walrus proof */}
                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Bukti di Walrus Storage</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] gap-1">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      Immutable
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-background/60 border border-border/40">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-amber-600" />
                        <span>Invoice + bank statement (PDF, 2.4 MB)</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                        Lihat
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-background/60 border border-border/40">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-amber-600" />
                        <span>Laporan keuangan internal (Excel, 1.1 MB)</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                        Lihat
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-background/60 border border-border/40">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-amber-600" />
                        <span>Foto operasional (3 foto, 8.7 MB)</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                        Lihat
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 text-[10px] font-mono text-muted-foreground">
                    Blob ID: {selected.walrusBlobId}
                  </div>
                </div>

                {/* Jury status */}
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="text-sm font-semibold mb-2">Status Jury (5 anggota)</div>
                  <div className="flex gap-2 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const hasApprove = i < selected.juryApprovals;
                      const hasReject = i >= selected.juryApprovals && i < selected.juryApprovals + selected.juryRejections;
                      return (
                        <div
                          key={i}
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                            hasApprove
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                              : hasReject
                                ? "bg-rose-100 text-rose-700 border border-rose-300"
                                : "bg-secondary text-muted-foreground border border-border"
                          }`}
                        >
                          {hasApprove ? <ThumbsUp className="h-3 w-3" /> : hasReject ? <ThumbsDown className="h-3 w-3" /> : "?"}
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Butuh ≥3 approve untuk distribusi profit · Saat ini: {selected.juryApprovals} approve, {selected.juryRejections} reject
                  </div>
                </div>
              </div>

              {selected.status === "pending" && (
                <DialogFooter>
                  {selected.userVote ? (
                    <div className="text-xs text-muted-foreground w-full text-center">
                      Kamu sudah vote: <span className="font-semibold">{selected.userVote}</span>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="gap-2 border-rose-300 text-rose-700 hover:bg-rose-50"
                        onClick={() => handleVote(selected.id, "reject")}
                        disabled={voting !== null}
                      >
                        {voting === "reject" ? "Voting..." : (
                          <>
                            <ThumbsDown className="h-4 w-4" />
                            Reject
                          </>
                        )}
                      </Button>
                      <Button
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleVote(selected.id, "approve")}
                        disabled={voting !== null}
                      >
                        {voting === "approve" ? "Voting..." : (
                          <>
                            <ThumbsUp className="h-4 w-4" />
                            Approve
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </DialogFooter>
              )}
              {selected.status === "approved" && (
                <DialogFooter>
                  <Badge className="bg-emerald-500 text-white border-0 gap-1 py-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Report disetujui · UMKM owner bisa distribute profit sekarang
                  </Badge>
                </DialogFooter>
              )}
              {selected.status === "rejected" && (
                <DialogFooter>
                  <Badge className="bg-rose-500 text-white border-0 gap-1 py-2">
                    <XCircle className="h-3.5 w-3.5" />
                    Report ditolak · Dispute escalation aktif
                  </Badge>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
