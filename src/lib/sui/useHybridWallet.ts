"use client";

import { useCurrentAccount, useCurrentWallet, useDisconnectWallet, useConnectWallet } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

/**
 * Hybrid wallet hook — bridges real Sui dapp-kit wallet with our mock store.
 *
 * Strategy:
 * - If user has Sui wallet extension (Sui Wallet, Ethos, etc.), use real connection.
 * - If no extension, fall back to mock mode (auto-connects as Google zkLogin user)
 *   so the demo is always explorable.
 * - Updates our Zustand store with real wallet state when available.
 */
export function useHybridWallet() {
  const currentAccount = useCurrentAccount();
  const currentWallet = useCurrentWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: connect } = useConnectWallet();
  const wallet = useAppStore((s) => s.wallet);
  const connectMock = useAppStore((s) => s.connectWallet);
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

  // Auto-connect mock wallet if no extension AND not already connected
  useEffect(() => {
    if (hasExtension === false && !wallet.connected && !currentWallet.isConnected) {
      const t = setTimeout(() => connectMock("google"), 800);
      return () => clearTimeout(t);
    }
  }, [hasExtension, wallet.connected, currentWallet.isConnected, connectMock]);

  // Sync real wallet to store
  useEffect(() => {
    if (currentAccount && currentWallet.isConnected) {
      const mockAddr =
        "0x" +
        Array.from({ length: 8 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join("") +
        "..." +
        Array.from({ length: 4 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join("");
      // Use real address from dapp-kit if available, else mock
      const realAddr = currentAccount.address.slice(0, 10) + "..." + currentAccount.address.slice(-4);
      // Only update if not already synced
      if (wallet.address !== realAddr) {
        // Disconnect mock first, then connect with real data
        if (wallet.connected && !wallet.viaZkLogin) {
          // Already a mock session — replace with real
        }
        // Use connectMock to set initial state, but we'll override
        connectMock("ethos"); // Ethos = real wallet flow
        // Override address with real Sui address via direct store manipulation
        useAppStore.setState((state) => ({
          wallet: {
            ...state.wallet,
            connected: true,
            address: realAddr,
            viaZkLogin: false,
            provider: "ethos",
          },
        }));
      }
    }
  }, [currentAccount, currentWallet.isConnected, wallet.address, connectMock, wallet.connected, wallet.viaZkLogin]);

  const handleDisconnect = () => {
    if (currentWallet.isConnected) {
      disconnect();
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
