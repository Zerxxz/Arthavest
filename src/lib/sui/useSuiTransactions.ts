"use client";

import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import {
  buildBuySharesPTB,
  buildDistributeProfitPTB,
  buildWithdrawPTB,
  buildOnboardPTB,
  buildSecondaryBuyPTB,
  buildVotePTB,
  getExplorerTxUrl,
} from "./transactions";

/**
 * Hook for executing real on-chain Sui transactions via dapp-kit.
 *
 * Returns async functions that build a PTB, sign it with the connected
 * wallet, execute it on Sui testnet, and return the real tx digest.
 *
 * Falls back gracefully if no wallet is connected (returns error object).
 */
export function useSuiTransactions() {
  const account = useCurrentAccount();
  const walletConnected = useAppStore((s) => s.wallet.connected);
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const ensureWallet = () => {
    if (!account) {
      throw new Error("No wallet connected. Please connect a Sui wallet first.");
    }
    return account;
  };

  /**
   * Execute a PTB and return the tx digest.
   * Shows a toast on success/failure.
   */
  const executeTxb = async (
    txb: ReturnType<typeof buildBuySharesPTB>,
    options: { successMsg: string; errorMsg: string; explorerLabel?: string },
  ): Promise<{ success: boolean; digest?: string; error?: string }> => {
    try {
      ensureWallet();
      const result = await signAndExecuteTransaction({
        transaction: txb,
      });
      const digest = result.digest;
      toast.success(options.successMsg, {
        description: `Tx: ${digest.slice(0, 12)}...${digest.slice(-6)}`,
        action: {
          label: options.explorerLabel ?? "View on Explorer",
          onClick: () => window.open(getExplorerTxUrl(digest), "_blank"),
        },
      });
      return { success: true, digest };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transaction failed";
      // Don't show toast if user rejected the tx (common case)
      if (msg.toLowerCase().includes("reject") || msg.toLowerCase().includes("denied")) {
        toast.error("Transaction rejected", { description: "You declined the transaction in your wallet." });
      } else {
        toast.error(options.errorMsg, { description: msg });
      }
      return { success: false, error: msg };
    }
  };

  return {
    buySharesOnChain: async (opts: {
      umkmName: string;
      shares: number;
      pricePerShare: number;
    }) => {
      const acct = ensureWallet();
      const txb = buildBuySharesPTB({
        ...opts,
        investorAddress: acct.address,
      });
      return executeTxb(txb, {
        successMsg: `Bought ${opts.shares} shares of ${opts.umkmName}!`,
        errorMsg: "Buy transaction failed",
        explorerLabel: "View tx on Sui Explorer",
      });
    },

    distributeProfitOnChain: async (opts: {
      umkmName: string;
      investorCount: number;
      totalAmount: number;
    }) => {
      const acct = ensureWallet();
      const txb = buildDistributeProfitPTB({
        ...opts,
        ownerAddress: acct.address,
      });
      return executeTxb(txb, {
        successMsg: `Distributed profit to ${opts.investorCount} investors!`,
        errorMsg: "Distribution transaction failed",
        explorerLabel: "View tx on Sui Explorer",
      });
    },

    withdrawOnChain: async (opts: { amount: number }) => {
      const acct = ensureWallet();
      const txb = buildWithdrawPTB({
        ...opts,
        investorAddress: acct.address,
      });
      return executeTxb(txb, {
        successMsg: `Withdrew ${opts.amount.toLocaleString("id-ID")} IDR!`,
        errorMsg: "Withdrawal transaction failed",
        explorerLabel: "View tx on Sui Explorer",
      });
    },

    onboardOnChain: async (opts: {
      umkmName: string;
      totalShares: number;
      pricePerShare: number;
    }) => {
      const acct = ensureWallet();
      const txb = buildOnboardPTB({
        ...opts,
        ownerAddress: acct.address,
      });
      return executeTxb(txb, {
        successMsg: `UMKM "${opts.umkmName}" onboarded on-chain!`,
        errorMsg: "Onboarding transaction failed",
        explorerLabel: "View tx on Sui Explorer",
      });
    },

    secondaryBuyOnChain: async (opts: {
      listingId: string;
      shares: number;
      pricePerShare: number;
    }) => {
      const acct = ensureWallet();
      const txb = buildSecondaryBuyPTB({
        ...opts,
        buyerAddress: acct.address,
      });
      return executeTxb(txb, {
        successMsg: `Bought ${opts.shares} shares on secondary market!`,
        errorMsg: "Secondary buy transaction failed",
        explorerLabel: "View tx on Sui Explorer",
      });
    },

    voteOnChain: async (opts: {
      reportId: string;
      vote: "approve" | "reject";
    }) => {
      const acct = ensureWallet();
      const txb = buildVotePTB({
        ...opts,
        jurorAddress: acct.address,
      });
      return executeTxb(txb, {
        successMsg: `Vote "${opts.vote}" submitted on-chain!`,
        errorMsg: "Vote transaction failed",
        explorerLabel: "View tx on Sui Explorer",
      });
    },

    isReady: !!account && walletConnected,
  };
}
