# SahamKita + SuiStream — Sui Testnet Deployment Guide

This guide covers deploying the Move contracts to Sui testnet and wiring up the Next.js app with real wallet integration.

## Prerequisites

1. **Install Sui CLI**:
   ```bash
   # macOS
   brew install sui

   # Linux (via apt)
   curl https://releases.sui.io/sui-latest-linux-x86_64.tgz | tar -xzv -C /usr/local/bin/

   # Verify
   sui --version
   ```

2. **Configure Sui testnet**:
   ```bash
   sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
   sui client switch --env testnet
   ```

3. **Get testnet SUI** from faucet:
   ```bash
   # Option A: CLI faucet (requires Discord verification)
   sui client faucet

   # Option B: Web faucet
   # Visit https://docs.sui.io/guides/developer/get-to-sui/cli-client#faucet
   ```

## Deploy Move Contracts

### 1. Build the contracts

```bash
cd contracts/

# Initialize Sui Move package structure
sui move new sahamkita
cd sahamkita/

# Copy our source files
cp ../stream.move sources/
cp ../saham_kita.move sources/

# Update Move.toml to declare suistream dependency
cat > Move.toml << 'EOF'
[package]
name = "sahamkita"
edition = "2024.beta"
published-at = "TBD"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
saham_kita = "0x0"
suistream = "0x0"
EOF

# Build
sui move build
```

### 2. Publish to testnet

```bash
# Publish (this returns a PACKAGE_ID — record it!)
sui move publish --skip-dependency-verification

# Expected output:
# ┌── Transaction Digest ────────────────────────────────────────────────
# │  <DIGEST>
# └──
# ...
# Created Objects:
#   ID: 0x...  -- AdminCap
#   ID: 0x...  -- TreasuryCap<SAHAM>
#   ID: 0x...  -- Package

# Save the PACKAGE_ID, AdminCap ID, and TreasuryCap ID to .env.local
```

### 3. Configure Next.js environment

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_PACKAGE_ID=0x<your-package-id-from-step-2>
NEXT_PUBLIC_ADMIN_CAP_ID=0x<your-admin-cap-id>
NEXT_PUBLIC_TREASURY_CAP_ID=0x<your-treasury-cap-id>
NEXT_PUBLIC_SUISTREAM_PACKAGE_ID=0x<same-as-package-id-for-now>
```

### 4. Onboard first UMKM (sample)

```bash
# Call onboard_umkm entry function
sui client call \
  --package $NEXT_PUBLIC_PACKAGE_ID \
  --module saham_kita \
  --function onboard_umkm \
  --type-args \
  --args $ADMIN_CAP_ID $TREASURY_CAP_ID \
        "Kopi Senja" \
        "Bandung, Jawa Barat" \
        "walrus_blob_id_xxx" \
        1800 \
        1000000000 \
  --gas-budget 100000000

# Verify the UMKM NFT was minted
sui client objects --address <your-address>
```

## Walrus Storage Setup (for UMKM document uploads)

### 1. Run Walrus client

```bash
# Install walrus
curl https://storage.googleapis.com/mysten-walrus-binaries/walrus-latest-linux-x86_64.tar.gz | tar -xzv -C /usr/local/bin/

# Configure for testnet
walrus --config testnet info
```

### 2. Upload a document & get blob ID

```bash
# Upload legal document
walrus --config testnet store legal-docs.pdf --epochs 50

# Returns: blob_id: 0x...
# This blob ID is passed to onboard_umkm() as docs_blob_id
```

### 3. Replace mock Walrus in production

In `src/lib/store.ts`, replace `uploadWalrusDoc`:

```typescript
uploadWalrusDoc: async (docType) => {
  // Production: POST file to Walrus aggregator
  // const formData = new FormData();
  // formData.append('file', file);
  // const res = await fetch('https://aggregator.walrus-testnet.nodes.sui.io/v1/store', {
  //   method: 'POST',
  //   body: formData,
  // });
  // const { blob_id } = await res.json();
  // return { success: true, blobId: blob_id };
}
```

## Real Sui Wallet Integration

The app uses `@mysten/dapp-kit` for wallet connection. Current state:

- **Hybrid mode**: If user has Sui wallet extension (Sui Wallet, Ethos, etc.), real wallet is used.
- **Demo mode**: If no extension, falls back to mock wallet (auto-connect as Google zkLogin user) so the demo is always explorable.

### To enable real transaction submission

Replace the mock action handlers in `src/lib/store.ts` with real PTB submissions:

```typescript
import { Transaction } from '@mysten/sui/transactions';
import { useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';

// Example: real buyShares implementation
buyShares: async (umkmId, shares) => {
  const tx = new Transaction();
  // Pay SUI
  const [coin] = tx.splitCoins(tx.gas, [cost]);
  // Call buy_shares
  tx.moveCall({
    target: `${PACKAGE_ID}::saham_kita::buy_shares`,
    arguments: [
      tx.object(umkmObjectId),
      tx.pure.u64(shares),
      coin,
      shareCoin,
    ],
  });
  // Sign & execute
  const result = await signAndExecuteTransaction({ transaction: tx });
  return { success: true, message: 'Bought!', txDigest: result.digest };
}
```

## Sui Overflow Hackathon Submission Checklist

- [x] Move contracts written (`contracts/stream.move`, `contracts/saham_kita.move`)
- [x] Build passes (`sui move build`)
- [ ] Published to testnet (run the steps above)
- [ ] At least 1 UMKM onboarded on-chain
- [ ] Demo video showing real wallet connection (install Sui Wallet extension)
- [ ] README links to testnet package ID
- [ ] Smart contract audit notes (or self-audit doc)

## Network Information

- **Sui Testnet RPC**: `https://fullnode.testnet.sui.io:443`
- **Sui Explorer**: `https://suiexplorer.com/?network=testnet`
- **Walrus Testnet Aggregator**: `https://aggregator.walrus-testnet.nodes.sui.io`
- **Sui Faucet (Discord)**: `#testnet-faucet` channel in Discord Sui server
