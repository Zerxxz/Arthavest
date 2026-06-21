/**
 * Sui Network Configuration — Arthavest
 *
 * Move contracts published to Sui Testnet.
 * Verified on Sui Explorer: https://suiexplorer.com/tx/2oRV6K595Y1SQkMNtCkRSkFYAq4kRjM1ey8edg57xZ36?network=testnet
 */

export const SUI_NETWORK = "testnet" as const;
export const SUI_RPC_URL = "https://fullnode.testnet.sui.io:443";
export const SUI_EXPLORER_TX = "https://suiexplorer.com/tx";
export const SUI_EXPLORER_OBJECT = "https://suiexplorer.com/object";
export const SUI_EXPLORER_PACKAGE = "https://suiexplorer.com/package";

/**
 * Published package ID from `sui move publish`.
 * Contains two modules: arthavest (marketplace) + stream (SuiStream primitive).
 */
export const PACKAGE_ID =
  "0x271298465a97fc009872c8708c438325f7f6e65c729e41909860cad598e41fbc";

/** Publish transaction digest (proof of deployment) */
export const PUBLISH_TX_DIGEST = "2oRV6K595Y1SQkMNtCkRSkFYAq4kRjM1ey8edg57xZ36";

/** Gas used for publish tx */
export const PUBLISH_GAS_USED = "0.0495 SUI";

/** Module names inside the package */
export const MODULES = {
  ARTHAVEST: "arthavest",
  STREAM: "stream",
} as const;

/** Build fully-qualified Move target string for `moveCall`. */
export function moveTarget(module: keyof typeof MODULES, fn: string): `${typeof PACKAGE_ID}::${string}::${string}` {
  return `${PACKAGE_ID}::${MODULES[module]}::${fn}`;
}

/** Build explorer URL for a tx digest */
export function explorerTxUrl(digest: string): string {
  return `${SUI_EXPLORER_TX}/${digest}?network=testnet`;
}

/** Build explorer URL for an object ID */
export function explorerObjectUrl(objectId: string): string {
  return `${SUI_EXPLORER_OBJECT}/${objectId}?network=testnet`;
}

/** Build explorer URL for the package */
export function explorerPackageUrl(): string {
  return `${SUI_EXPLORER_PACKAGE}/${PACKAGE_ID}?network=testnet`;
}
