/// SahamKita — Marketplace for fractional UMKM ownership in Indonesia.
///
/// Built on top of `suistream::stream` for monthly profit distribution.
/// Each UMKM is an NFT object; each share is a fungible token; each profit
/// distribution is a PTB that creates one SuiStream per shareholder, atomically.
///
/// Designed for the Sui Overflow Hackathon.
module saham_kita::saham_kita {
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::event;
    use sui::object::{Self, UID, ID};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::vec_map::{Self, VecMap};
    use suistream::stream::{Self, Stream};

    // ============ Errors ============
    const ENotAuthorized: u64 = 1;
    const ESharesNotAvailable: u64 = 2;
    const EInsufficientPayment: u64 = 3;
    const EAlreadyVerified: u64 = 4;
    const ENotVerified: u64 = 5;

    // ============ Constants ============
    const SECONDS_30D: u64 = 2_592_000; // 30 days

    // ============ Types ============

    /// The UMKM NFT — owned by the UMKM operator wallet.
    public struct UMKM has key {
        id: UID,
        name: vector<u8>,
        location: vector<u8>,
        /// Walrus blob ID containing legal docs (akta, NPWP, etc.)
        docs_blob_id: vector<u8>,
        /// Total shares minted for this UMKM.
        total_shares: u64,
        /// Price per share in MIST (SUI).
        price_per_share: u64,
        /// KYC verified flag — set by admin DAO.
        verified: bool,
        /// Owner of this UMKM.
        owner: address,
    }

    /// Admin capability — KYC verification.
    public struct AdminCap has key, store {
        id: UID,
    }

    /// Treasury capability for the SAHAM fungible token.
    public struct SAHAM has drop {}

    /// ProfitReport — created by UMKM owner, references Walrus proof.
    public struct ProfitReport has key {
        id: UID,
        umkm_id: ID,
        amount: u64,
        /// Walrus blob ID containing invoice + bank statement PDF.
        proof_blob_id: vector<u8>,
        /// Verified flag — set by jury DAO.
        verified: bool,
        reporter: address,
    }

    /// Distribution receipt — NFT minted after bulk profit distribution.
    public struct Distribution has key {
        id: UID,
        umkm_id: ID,
        investor_count: u64,
        total_distributed: u64,
        /// VecMap of investor address -> stream object ID.
        streams: VecMap<address, ID>,
        timestamp_ms: u64,
    }

    // ============ Events ============
    public struct UMKMOnboarded has copy, drop {
        umkm_id: ID,
        name: vector<u8>,
        total_shares: u64,
    }
    public struct SharesBought has copy, drop {
        umkm_id: ID,
        investor: address,
        shares: u64,
        amount_paid: u64,
    }
    public struct ProfitDistributed has copy, drop {
        umkm_id: ID,
        investor_count: u64,
        total_amount: u64,
    }

    // ============ Module init ============
    fun init(ctx: &mut TxContext) {
        let cap = coin::create_currency<SAHAM>(ctx);
        transfer::share_object(cap);

        // Admin cap to the deployer.
        transfer::transfer(AdminCap { id: object::new(ctx) }, tx_context::sender(ctx));
    }

    // ============ Onboarding ============

    /// Admin onboards a new UMKM. Mints NFT + initial share supply to the UMKM owner.
    public entry fun onboard_umkm(
        _admin: &AdminCap,
        treasury: &TreasuryCap<SAHAM>,
        name: vector<u8>,
        location: vector<u8>,
        docs_blob_id: vector<u8>,
        total_shares: u64,
        price_per_share: u64,
        ctx: &mut TxContext,
    ) {
        let umkm = UMKM {
            id: object::new(ctx),
            name,
            location,
            docs_blob_id,
            total_shares,
            price_per_share,
            verified: false,
            owner: tx_context::sender(ctx),
        };
        let umkm_id = object::id(&umkm);

        // Mint total_shares SAHAM coins — these stay in the UMKM's treasury,
        // to be sold to investors. (In production, use a shared Treasury object.)
        let i = 0;
        while (i < total_shares) {
            let coin = coin::mint(treasury, 1, ctx);
            transfer::public_transfer(coin, tx_context::sender(ctx));
            i = i + 1;
        };

        event::emit(UMKMOnboarded {
            umkm_id,
            name,
            total_shares,
        });

        transfer::transfer(umkm, tx_context::sender(ctx));
    }

    /// KYC verify — admin marks UMKM as verified.
    public entry fun verify_umkm(_admin: &AdminCap, umkm: &mut UMKM) {
        assert!(!umkm.verified, EAlreadyVerified);
        umkm.verified = true;
    }

    // ============ Investor buy ============

    /// Investor buys `shares` shares of `umkm` by paying SUI.
    /// In production this would split from a shared UMKM treasury object;
    /// for demo, the sender's SAHAM coin is used as input.
    public entry fun buy_shares(
        umkm: &UMKM,
        shares: u64,
        payment: Coin<SUI>,
        share_coin: coin::Coin<SAHAM>,
        ctx: &mut TxContext,
    ) {
        assert!(umkm.verified, ENotVerified);
        assert!(coin::value(&share_coin) >= shares, ESharesNotAvailable);

        let cost = umkm.price_per_share * shares;
        assert!(coin::value(&payment) >= cost, EInsufficientPayment);

        // Refund excess payment.
        let refund = if (coin::value(&payment) > cost) {
            let r = coin::split(payment, coin::value(&payment) - cost, ctx);
            transfer::public_transfer(r, tx_context::sender(ctx));
            true
        } else {
            false
        };

        // Payment goes to UMKM owner.
        transfer::public_transfer(payment, umkm.owner);

        // Share coin goes to investor.
        transfer::public_transfer(share_coin, tx_context::sender(ctx));

        event::emit(SharesBought {
            umkm_id: object::id(umkm),
            investor: tx_context::sender(ctx),
            shares,
            amount_paid: cost,
        });

        // refund; // suppress unused
    }

    // ============ Profit reporting ============

    /// UMKM owner reports monthly profit + uploads proof to Walrus.
    public entry fun report_profit(
        umkm: &UMKM,
        amount: u64,
        proof_blob_id: vector<u8>,
        ctx: &mut TxContext,
    ) {
        assert!(umkm.owner == tx_context::sender(ctx), ENotAuthorized);
        let report = ProfitReport {
            id: object::new(ctx),
            umkm_id: object::id(umkm),
            amount,
            proof_blob_id,
            verified: false,
            reporter: tx_context::sender(ctx),
        };
        transfer::share_object(report);
    }

    /// Jury DAO verifies the profit report.
    public entry fun verify_profit_report(_admin: &AdminCap, report: &mut ProfitReport) {
        assert!(!report.verified, EAlreadyVerified);
        report.verified = true;
    }

    // ============ Distribution via SuiStream PTB ============

    /// Distribute profit to all shareholders via SuiStream primitive.
    /// Caller must provide a vector of (recipient, shares_owned) pairs.
    /// The total payment coin must equal the verified profit amount.
    ///
    /// For each investor, a Stream<SUI> is created with rate_per_second
    /// = (amount * investor_shares) / (total_shares * SECONDS_30D).
    /// All streams are created in 1 PTB → atomic.
    public entry fun distribute_profit(
        umkm: &UMKM,
        report: &ProfitReport,
        payment: Coin<SUI>,
        /// Vec of investor addresses, parallel to shares_vec.
        investors: vector<address>,
        /// Vec of share counts, parallel to investors.
        shares_vec: vector<u64>,
        ctx: &mut TxContext,
    ) {
        assert!(umkm.owner == tx_context::sender(ctx), ENotAuthorized);
        assert!(report.verified, ENotVerified);
        assert!(report.umkm_id == object::id(umkm), ENotAuthorized);
        assert!(coin::value(&payment) == report.amount, EInsufficientPayment);

        let total_shares = umkm.total_shares;
        let amount = report.amount;
        let mut remaining = payment;
        let mut streams = vec_map::empty<address, ID>();
        let mut i = 0;
        let investor_count = vector::length(&investors);

        while (i < investor_count) {
            let investor = *vector::borrow(&investors, i);
            let shares = *vector::borrow(&shares_vec, i);
            let stream_amount = (amount * shares) / total_shares;
            let rate = stream_amount / SECONDS_30D;

            // Split coin for this stream.
            let stream_coin = coin::split(&mut remaining, stream_amount, ctx);

            // Create SuiStream — atomic, composable.
            stream::create_stream<SUI>(
                stream_coin,
                investor,
                rate,
                SECONDS_30D * 1000,
                ctx,
            );

            // Note: in a real PTB, the returned Stream object would be
            // captured and recorded. For demo, we log the investor.
            vec_map::insert(&mut streams, investor, object::id_from_address(investor));

            i = i + 1;
        };

        // Mint Distribution receipt NFT to UMKM owner.
        let receipt = Distribution {
            id: object::new(ctx),
            umkm_id: object::id(umkm),
            investor_count,
            total_distributed: amount,
            streams,
            timestamp_ms: sui::timestamp::now_ms(ctx),
        };

        event::emit(ProfitDistributed {
            umkm_id: object::id(umkm),
            investor_count,
            total_amount: amount,
        });

        transfer::transfer(receipt, tx_context::sender(ctx));
    }

    // ============ Read helpers ============
    public fun umkm_name(umkm: &UMKM): &vector<u8> { &umkm.name }
    public fun umkm_verified(umkm: &UMKM): bool { umkm.verified }
    public fun umkm_price_per_share(umkm: &UMKM): u64 { umkm.price_per_share }
    public fun umkm_total_shares(umkm: &UMKM): u64 { umkm.total_shares }
    public fun umkm_owner(umkm: &UMKM): address { umkm.owner }
}
