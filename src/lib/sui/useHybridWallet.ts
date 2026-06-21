"use client";

import { useCurrentAccount, useCurrentWallet, useDisconnectWallet, useSuiClientContext } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

/**
 * Real wallet hook — syncs dapp-kit wallet state to Zustand store.
 *
 * NO mock fallback. User must connect a real Sui wallet via dapp-kit.
 * Also detects if wallet is on the wrong network (must be testnet).
 */
export function useHybridWallet() {
  const currentAccount = useCurrentAccount();
  const currentWallet = useCurrentWallet();
  const { mutate: disconnectReal } = useDisconnectWallet();
  const walletConnected = useAppStore((s) => s.wallet.connected);
  const disconnectMock = useAppStore((s) => s.disconnectWallet);
  const { network: activeNetwork } = useSuiClientContext();

  // Extract primitives from currentWallet (avoids object identity in deps)
  const isConnected = currentWallet.isConnected;
  const walletName = (currentWallet as { name?: string }).name ?? "";

  const [hasExtension, setHasExtension] = useState<boolean | null>(null);

  // Detect Sui wallet extension presence
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      const suiWindow = window as unknown as { sui?: unknown };
      setHasExtension(!!suiWindow.sui);
    };
    check();
    const t = setTimeout(check, 1500);
    return () => clearTimeout(t);
  }, []);

  // Warn if wallet is on wrong network (must be testnet for our package)
  useEffect(() => {
    if (isConnected && activeNetwork && activeNetwork !== "testnet") {
      toast.error("Wrong network detected!", {
        description: `Your wallet is on "${activeNetwork}". Please switch to TESTNET in your wallet settings to use Arthavest (contracts deployed on testnet).`,
        duration: 8000,
      });
    }
  }, [isConnected, activeNetwork]);

  // Sync real wallet state to Zustand store
  useEffect(() => {
    if (currentAccount && isConnected) {
      const realAddr =
        currentAccount.address.slice(0, 10) + "..." + currentAccount.address.slice(-4);

      // Determine provider label safely
      const lowerName = (walletName || "").toLowerCase();
      const provider: "google" | "twitch" | "ethos" = lowerName.includes("ethos")
        ? "ethos"
        : lowerName.includes("google")
          ? "google"
          : lowerName.includes("twitch")
            ? "twitch"
            : "ethos";
      const viaZkLogin = lowerName.includes("google") || lowerName.includes("twitch");

      useAppStore.setState((state) => {
        // Skip if already synced with same address (prevents infinite loop)
        if (state.wallet.address === realAddr && state.wallet.connected) {
          return state;
        }
        return {
          wallet: {
            ...state.wallet,
            connected: true,
            address: realAddr,
            suiBalance: state.wallet.suiBalance || 0,
            idrBalance: state.wallet.idrBalance || 75_000_000,
            viaZkLogin,
            provider,
          },
        };
      });
    } else if (!isConnected && walletConnected) {
      // Real wallet disconnected — clear store
      disconnectMock();
    }
  }, [currentAccount, isConnected, walletName, walletConnected, disconnectMock]);

  const handleDisconnect = () => {
    if (isConnected) {
      disconnectReal();
    }
    disconnectMock();
  };

  return {
    hasExtension,
    isRealWallet: isConnected,
    realAccount: currentAccount,
    disconnect: handleDisconnect,
    activeNetwork,
    isWrongNetwork: isConnected && activeNetwork !== "testnet",
  };
}
