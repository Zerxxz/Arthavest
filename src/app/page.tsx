"use client";

import { useAppStore } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Marketplace } from "@/components/sections/Marketplace";
import { InvestorDashboard } from "@/components/sections/InvestorDashboard";
import { OwnerDashboard } from "@/components/sections/OwnerDashboard";
import { Architecture } from "@/components/sections/Architecture";
import { SecondaryMarket } from "@/components/sections/secondary/SecondaryMarket";
import { DAOJury } from "@/components/sections/dao/DAOJury";
import { OnboardingUMKM } from "@/components/sections/onboarding/OnboardingUMKM";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster as SonnerToaster } from "sonner";

export default function Home() {
  const activeTab = useAppStore((s) => s.activeTab);

  // NOTE: Production mode — NO auto-connect mock wallet.
  // User must connect a real Sui wallet via the "Connect Wallet" button in Header
  // (requires Sui Wallet browser extension installed).

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "marketplace" && (
              <>
                <Hero />
                <Marketplace />
              </>
            )}
            {activeTab === "how" && <HowItWorks />}
            {activeTab === "investor" && <InvestorDashboard />}
            {activeTab === "owner" && <OwnerDashboard />}
            {activeTab === "secondary" && <SecondaryMarket />}
            {activeTab === "dao" && <DAOJury />}
            {activeTab === "onboarding" && <OnboardingUMKM />}
            {activeTab === "architecture" && <Architecture />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <SonnerToaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.995 0.005 85)",
            border: "1px solid oklch(0.9 0.015 80)",
            color: "oklch(0.18 0.012 60)",
          },
        }}
      />
    </div>
  );
}
