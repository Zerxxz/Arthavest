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
import { useEffect } from "react";

export default function Home() {
  const activeTab = useAppStore((s) => s.activeTab);

  // Auto-connect wallet on first load to make demo seamless
  const connectWallet = useAppStore((s) => s.connectWallet);
  const walletConnected = useAppStore((s) => s.wallet.connected);

  useEffect(() => {
    if (!walletConnected) {
      // Auto-connect via zkLogin Google for demo purposes
      const timer = setTimeout(() => connectWallet("google"), 800);
      return () => clearTimeout(timer);
    }
  }, [walletConnected, connectWallet]);

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
