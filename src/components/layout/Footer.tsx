"use client";

import { Badge } from "@/components/ui/badge";
import { Droplets, Github, Twitter, ExternalLink } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/useTranslation";

export function Footer() {
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const { t } = useTranslation();

  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-full bg-white overflow-hidden ring-1 ring-border/40 flex-shrink-0">
                <img
                  src="/logo-icon.png"
                  alt="Arthavest logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <img
                src="/logo-wordmark.png"
                alt="Arthavest"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div className="text-[10px] text-muted-foreground mb-3">
              {t("footer.tagline")}
            </div>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed mb-4">
              {t("footer.desc")}
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1 text-[10px]">
                <Droplets className="h-2.5 w-2.5 text-primary" />
                {t("footer.suiStreamPrimitive")}
              </Badge>
              <Badge variant="outline" className="gap-1 text-[10px]">
                {t("footer.suiOverflow")}
              </Badge>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              {t("footer.product")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("marketplace")}
                >
                  {t("footer.marketplace")}
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("investor")}
                >
                  {t("footer.portfolio")}
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("owner")}
                >
                  {t("footer.umkmDashboard")}
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("how")}
                >
                  {t("footer.howItWorks")}
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("architecture")}
                >
                  {t("footer.suiArch")}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://docs.sui.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                >
                  Sui Documentation
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://overflow.sui.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                >
                  Sui Overflow Hackathon
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.walrus.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                >
                  Walrus Storage
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://deepbook.sui.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                >
                  DeepBook Protocol
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground" aria-label="Twitter">
                  <Twitter className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            {t("footer.copyright")}
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
