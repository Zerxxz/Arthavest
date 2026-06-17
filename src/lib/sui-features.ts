import type { SuiFeature } from "./types";

// Showcase Sui features yang dipakai di SahamKita
export const SUI_FEATURES: SuiFeature[] = [
  {
    id: "object-model",
    name: "Object-Centric Model",
    icon: "Boxes",
    description:
      "Setiap UMKM, kepemilikan saham, dan stream adalah object Move terpisah dengan ID unik. Bisa dipindahkan, di-fractionalize, atau dijadikan jaminan tanpa kontrak perantara.",
    usedIn: "UMKM NFT, Share Token, Stream Object",
    benefit: "Ownership langsung, tidak butuh registry mapping",
  },
  {
    id: "ptb",
    name: "Programmable Transaction Blocks",
    icon: "Workflow",
    description:
      "Distribusi profit ke ratusan investor dieksekusi dalam 1 transaksi atomik. Tidak ada window di mana sebagian investor sudah dibayar dan sebagian belum.",
    usedIn: "Bulk profit distribution, Buy shares + mint receipt",
    benefit: "Atomic, gas-efisien, no partial failure",
  },
  {
    id: "zklogin",
    name: "zkLogin",
    icon: "Fingerprint",
    description:
      "Investor pemula login pakai Google/Twitch — tidak perlu install wallet atau backup seed phrase. Zero-knowledge proof menjaga privasi alamat on-chain.",
    usedIn: "Onboarding investor & UMKM",
    benefit: "UX web2, keamanan web3",
  },
  {
    id: "sponsored-tx",
    name: "Sponsored Transactions",
    icon: "Gift",
    description:
      "Transaksi pertama investor (beli saham pertama, withdraw pertama) disponsori platform. User tidak perlu SUI untuk mulai.",
    usedIn: "First-time buy & withdraw",
    benefit: "Zero gas barrier untuk user baru",
  },
  {
    id: "walrus",
    name: "Walrus Storage",
    icon: "Database",
    description:
      "Dokumen legal UMKM (Akta, NPWP, laporan keuangan) disimpan permanen di Walrus dengan blob ID tercatat on-chain. Tidak bisa dihapus, tidak bisa diubah.",
    usedIn: "UMKM document verification",
    benefit: "Audit trail permanen, onboarding transparan",
  },
  {
    id: "deepbook",
    name: "DeepBook Integration",
    icon: "LineChart",
    description:
      "Saham UMKM yang sudah list bisa dipasar sekunder via DeepBook central limit orderbook. Likuiditas investor tanpa harus menunggu exit window.",
    usedIn: "Secondary market (roadmap)",
    benefit: "Likuiditas sekunder, price discovery",
  },
];

export const SUISTREAM_PRIMITIVE_DESCRIPTION = {
  name: "SuiStream Primitive",
  tagline: "Money stream sebagai object Move — composable, transferable, fractionalizable",
  description:
    "SuiStream adalah lapisan primitive di bawah SahamKita. Setiap stream pembayaran adalah object Move yang dimiliki penerima. Stream bisa dijual ke pihak ketiga (resell sisa profit), dijadikan jaminan, atau di-fractionalize untuk diwariskan. PTB memungkinkan create + fund + start dalam 1 tx atomik.",
  capabilities: [
    {
      label: "Rate per detik",
      value: "Configurable, presisi ms",
    },
    {
      label: "Cliff & vesting",
      value: "Milestone unlock via PTB",
    },
    {
      label: "Transferable",
      value: "Object bisa di-kirim ke address lain",
    },
    {
      label: "Cancellable",
      value: "Refund sisa dana ke sender",
    },
    {
      label: "Composable",
      value: "Bisa di-pack jadi NFT / collateral",
    },
  ],
};
