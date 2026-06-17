"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles, Droplets, Github, Twitter, ExternalLink } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Footer() {
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-bold">SahamKita</div>
                <div className="text-[10px] text-muted-foreground">
                  powered by SuiStream · Sui Network
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed mb-4">
              Platform kepemilikan fraksional UMKM Indonesia dengan distribusi profit via SuiStream
              primitive. Dibangun untuk Sui Overflow Hackathon — kombinasi RWA marketplace + DeFi
              money stream di atas Sui object-centric model.
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1 text-[10px]">
                <Droplets className="h-2.5 w-2.5 text-primary" />
                SuiStream Primitive
              </Badge>
              <Badge variant="outline" className="gap-1 text-[10px]">
                Sui Overflow 2025
              </Badge>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Produk
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("marketplace")}
                >
                  Marketplace UMKM
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("investor")}
                >
                  Portfolio Investor
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("owner")}
                >
                  Dashboard UMKM
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("how")}
                >
                  Cara Kerja
                </button>
              </li>
              <li>
                <button
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setActiveTab("architecture")}
                >
                  Arsitektur Sui
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Resources
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
            © 2025 SahamKita · Built for Sui Overflow Hackathon. Demo data — bukan investasi nyata.
          </p>
          <p className="text-[11px] text-muted-foreground font-mono">
            Made with ☕ in Bandung · Move + Sui + Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
