/**
 * Sui Network Configuration — Arthavest
 *
 * Move contracts published to Sui Testnet.
 * Verified on Sui Explorer: https://suiexplorer.com/tx/Hfi6skP6j1nbDDjyZbM7TaLzzp9cWpJV4sJ22WB4F5iF?network=testnet
 */

export const SUI_NETWORK = "testnet" as const;
export const SUI_RPC_URL = "https://fullnode.testnet.sui.io:443";
export const SUI_EXPLORER_TX = "https://suiexplorer.com/tx";
export const SUI_EXPLORER_OBJECT = "https://suiexplorer.com/object";
export const SUI_EXPLORER_PACKAGE = "https://suiexplorer.com/package";

/** Published package ID from `sui move publish`. */
export const PACKAGE_ID =
  "0x271298465a97fc009872c8708c438325f7f6e65c729e41909860cad598e41fbc";

/** Publish transaction digest (proof of deployment) */
export const PUBLISH_TX_DIGEST = "Hfi6skP6j1nbDDjyZbM7TaLzzp9cWpJV4sJ22WB4F5iF";

/** Gas used for publish tx */
export const PUBLISH_GAS_USED = "0.0495 SUI";

/** Deployer wallet address (owns AdminCap + TreasuryCap) */
export const DEPLOYER_ADDRESS =
  "0xb414f18de36546d4e3035e8443168cb49b18fc9627be5dcd8d3e5d15e5525e7c";

/**
 * Object IDs created during publish (from `sui_getTransactionBlock`).
 * These are REAL on-chain objects on Sui testnet.
 */
export const OBJECT_IDS = {
  ADMIN_CAP: "0x95c01ea5c2d2c068b7c21479ba31490c3715bae0005f99d3474ca19ea9da9157",
  TREASURY_CAP: "0xa1c8fac839e97972f0469138cdf26c19f441cef5b31c3d95a879de43a12e1050",
  COIN_METADATA: "0xec44ec3f98e829234fdd5a79043a9e5e3dccbcd7a92505709ff4f4e802d0000a",
  UPGRADE_CAP: "0x3df3ad9b1f1e19cb78200a6ff35291961654dc1b3feeae948265f0c00e5d12a6",
} as const;

/** Token symbol (matches Move struct name in published package) */
export const TOKEN_SYMBOL = "ARTHAVEST";

/** Full coin type string for ARTHAVEST token */
export const ARTHAVEST_COIN_TYPE = `${PACKAGE_ID}::arthavest::ARTHAVEST`;

/** Module names inside the package */
export const MODULES = {
  ARTHAVEST: "arthavest",
  STREAM: "stream",
} as const;

/** Build fully-qualified Move target string for `moveCall`. */
export function moveTarget(
  module: keyof typeof MODULES,
  fn: string,
): `${typeof PACKAGE_ID}::${string}::${string}` {
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
