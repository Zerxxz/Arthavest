"use client";

import { useCurrentAccount, useCurrentWallet, useDisconnectWallet } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

/**
 * Real wallet hook — NO mock fallback.
 *
 * Strategy (production mode for demo video):
 * - User MUST connect a real Sui wallet via dapp-kit (Sui Wallet, Ethos, etc.)
 * - No auto-connect, no mock wallet
 * - Detects if a Sui wallet extension is installed so we can show appropriate UI
 *   ("Install Sui Wallet" prompt vs "Connect Wallet" button)
 * - Syncs real wallet state to Zustand store
 */
export function useHybridWallet() {
  const currentAccount = useCurrentAccount();
  const currentWallet = useCurrentWallet();
  const { mutate: disconnectReal } = useDisconnectWallet();
  const wallet = useAppStore((s) => s.wallet);
  const disconnectMock = useAppStore((s) => s.disconnectWallet);

  const [hasExtension, setHasExtension] = useState<boolean | null>(null);

  // Detect Sui wallet extension presence
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      const suiWindow = window as unknown as { sui?: unknown };
      setHasExtension(!!suiWindow.sui);
    };
    check();
    // Re-check after 1.5s in case wallet injects late
    const t = setTimeout(check, 1500);
    return () => clearTimeout(t);
  }, []);

  // Sync real wallet to store — only when user actually connects via dapp-kit
  useEffect(() => {
    if (currentAccount && currentWallet.isConnected) {
      const realAddr = currentAccount.address.slice(0, 10) + "..." + currentAccount.address.slice(-4);
      // Determine provider label from wallet name
      const walletName = (currentWallet as { name?: string }).name?.toLowerCase() ?? "sui";
      const provider: "google" | "twitch" | "ethos" = walletName.includes("ethos")
        ? "ethos"
        : walletName.includes("google")
          ? "google"
          : walletName.includes("twitch")
            ? "twitch"
            : "ethos";
      const viaZkLogin = walletName.includes("google") || walletName.includes("twitch");

      useAppStore.setState((state) => ({
        wallet: {
          ...state.wallet,
          connected: true,
          address: realAddr,
          suiBalance: state.wallet.suiBalance || 0, // Real balance would come from SuiClient
          idrBalance: state.wallet.idrBalance || 75_000_000, // Demo IDR balance for marketplace UX
          viaZkLogin,
          provider,
        },
      }));
    } else if (!currentWallet.isConnected && wallet.connected) {
      // Real wallet disconnected — clear store
      disconnectMock();
    }
  }, [currentAccount, currentWallet, wallet.connected, disconnectMock]);

  const handleDisconnect = () => {
    if (currentWallet.isConnected) {
      disconnectReal();
    }
    disconnectMock();
  };

  return {
    hasExtension,
    isRealWallet: currentWallet.isConnected,
    realAccount: currentAccount,
    disconnect: handleDisconnect,
  };
}
