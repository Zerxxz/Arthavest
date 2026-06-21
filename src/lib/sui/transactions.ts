/**
 * Real Sui PTB (Programmable Transaction Block) helpers.
 *
 * These build real Move call transactions against the deployed Arthavest
 * package on Sui testnet. When the user has a real Sui wallet connected
 * (via @mysten/dapp-kit), the store actions call these to submit real
 * on-chain transactions instead of just simulating.
 *
 * Strategy for demo:
 * - Since real on-chain UMKM objects don't exist yet (would require
 *   `onboard_umkm` first with AdminCap+TreasuryCap), we use a hybrid approach:
 *   1. Build a PTB that does a simple real on-chain action (split SUI + transfer)
 *      — this proves the wallet + testnet integration works end-to-end
 *   2. The tx digest returned is real and viewable on Sui Explorer
 *   3. The mock data in the store updates as before for UX continuity
 *
 * For production (after AdminCap + TreasuryCap distribution), these can be
 * upgraded to call the actual `arthavest::arthavest::buy_shares` etc.
 */

import { Transaction } from "@mysten/sui/transactions";
import { SUI_DECIMALS } from "@mysten/sui/utils";
import { PACKAGE_ID, moveTarget, explorerTxUrl } from "./config";

/**
 * Build a PTB that simulates a "buy shares" action on-chain.
 *
 * Real implementation would call:
 *   ptb.moveCall({
 *     target: moveTarget("ARTHAVEST", "buy_shares"),
 *     arguments: [tx.object(umkmObjectId), tx.pure.u64(shares), paymentCoin, shareCoin],
 *   });
 *
 * But since we don't have real on-chain UMKM objects yet, we do a real
 * but simpler PTB: split 0.001 SUI from gas + transfer to self. This is
 * a real on-chain transaction that:
 *   - Proves wallet + testnet works
 *   - Returns a real tx digest viewable on Sui Explorer
 *   - Costs ~0.001 SUI (negligible)
 */
export function buildBuySharesPTB(opts: {
  umkmName: string;
  shares: number;
  pricePerShare: number;
  investorAddress: string;
}): Transaction {
  const tx = new Transaction();
  // Demo: split 0.001 SUI from gas and transfer to self as proof of tx
  // In production: tx.moveCall({ target: moveTarget("ARTHAVEST", "buy_shares"), ... })
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1_000_000)]); // 0.001 SUI (MIST)
  tx.transferObjects([coin], tx.pure.address(opts.investorAddress));

  // Add a memo via Move event (using system clock for unique timestamp)
  // This makes each tx unique + identifiable on explorer
  tx.moveCall({
    target: `${PACKAGE_ID}::stream::create_stream`,
    typeArguments: ["0x2::sui::SUI"],
    arguments: [
      tx.splitCoins(tx.gas, [tx.pure.u64(1_000_000)]), // tiny stream funding
      tx.pure.address(opts.investorAddress),
      tx.pure.u64(1), // rate per second (1 MIST)
      tx.pure.u64(60_000), // 60 seconds duration
    ],
  });

  return tx;
}

/**
 * Build a PTB for profit distribution (mock real action).
 *
 * Real implementation would call:
 *   ptb.moveCall({
 *     target: moveTarget("ARTHAVEST", "distribute_profit"),
 *     arguments: [umkm, profitReport, payment, investorsVec, sharesVec],
 *   });
 *
 * For demo: split SUI into N coins and transfer to self (simulating bulk distribution)
 */
export function buildDistributeProfitPTB(opts: {
  umkmName: string;
  investorCount: number;
  totalAmount: number;
  ownerAddress: string;
}): Transaction {
  const tx = new Transaction();
  // Demo: split gas into multiple coins (simulating bulk distribution)
  // In production: tx.moveCall({ target: moveTarget("ARTHAVEST", "distribute_profit"), ... })
  const totalMist = 10_000_000; // 0.01 SUI total
  const perInvestor = Math.floor(totalMist / opts.investorCount);
  for (let i = 0; i < Math.min(opts.investorCount, 3); i++) {
    // Limit to 3 iterations to keep gas reasonable
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(perInvestor)]);
    tx.transferObjects([coin], tx.pure.address(opts.ownerAddress));
  }
  return tx;
}

/**
 * Build a PTB for stream withdrawal (mock real action).
 *
 * Real implementation would call:
 *   ptb.moveCall({
 *     target: moveTarget("STREAM", "withdraw"),
 *     typeArguments: ["0x2::sui::SUI"],
 *     arguments: [tx.object(streamObjectId)],
 *   });
 *
 * For demo: just split + transfer tiny SUI to self
 */
export function buildWithdrawPTB(opts: {
  amount: number;
  investorAddress: string;
}): Transaction {
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1_000_000)]); // 0.001 SUI
  tx.transferObjects([coin], tx.pure.address(opts.investorAddress));
  return tx;
}

/**
 * Build a PTB for UMKM onboarding (mock real action).
 *
 * Real implementation would call:
 *   ptb.moveCall({
 *     target: moveTarget("ARTHAVEST", "onboard_umkm"),
 *     arguments: [adminCap, treasuryCap, name, location, docsBlobId, totalShares, pricePerShare],
 *   });
 *
 * For demo: just split + transfer SUI to self
 */
export function buildOnboardPTB(opts: {
  umkmName: string;
  totalShares: number;
  pricePerShare: number;
  ownerAddress: string;
}): Transaction {
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1_000_000)]);
  tx.transferObjects([coin], tx.pure.address(opts.ownerAddress));
  return tx;
}

/**
 * Build a PTB for secondary market buy (mock real action).
 */
export function buildSecondaryBuyPTB(opts: {
  listingId: string;
  shares: number;
  pricePerShare: number;
  buyerAddress: string;
}): Transaction {
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1_000_000)]);
  tx.transferObjects([coin], tx.pure.address(opts.buyerAddress));
  return tx;
}

/**
 * Build a PTB for DAO jury vote (mock real action).
 */
export function buildVotePTB(opts: {
  reportId: string;
  vote: "approve" | "reject";
  jurorAddress: string;
}): Transaction {
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(500_000)]); // 0.0005 SUI
  tx.transferObjects([coin], tx.pure.address(opts.jurorAddress));
  return tx;
}

/**
 * Helper: format MIST to SUI display string.
 */
export function mistToSui(mist: number | bigint): string {
  const sui = Number(mist) / Math.pow(10, SUI_DECIMALS);
  return sui.toFixed(4);
}

/**
 * Helper: build explorer URL for a tx digest.
 */
export function getExplorerTxUrl(digest: string): string {
  return explorerTxUrl(digest);
}
