/// SuiStream Primitive — Money stream as a transferable Sui object.
///
/// Designed as a reusable DeFi primitive for the Sui Overflow Hackathon.
/// Used by Arthavest for monthly UMKM profit distribution to investors.
///
/// Key Sui-native properties:
/// - Stream is an OBJECT owned by the recipient (transfer_args).
/// - Composable inside Programmable Transaction Blocks (PTB).
/// - Pause / resume / cancel supported via shared capability object.
/// - Withdraw is permissionless for recipient; partial withdraw supported.
module suistream::stream {
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::object::{Self, UID, ID};
    use sui::sui::SUI;
    use sui::timestamp;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// Error codes
    const EStreamExpired: u64 = 0;
    const EStreamPaused: u64 = 1;
    const EUnauthorized: u64 = 2;
    const EZeroAmount: u64 = 3;
    const EInsufficientBalance: u64 = 4;
    const EStreamNotEnded: u64 = 5;

    /// A money stream object. Owned by the recipient.
    public struct Stream<phantom T> has key, store {
        id: UID,
        sender: address,
        recipient: address,
        /// Total amount to be streamed over the lifetime of this stream.
        total_amount: u64,
        /// Rate per second (in units of T).
        rate_per_second: u64,
        /// Start timestamp (ms).
        start_ms: u64,
        /// End timestamp (ms).
        end_ms: u64,
        /// Amount already withdrawn by recipient.
        withdrawn: u64,
        /// Pause flag — when true, accrual halts.
        paused: bool,
        /// Coin balance backing this stream.
        balance: Balance<T>,
    }

    /// Sender capability — controls pause / resume / cancel.
    public struct StreamCap has key, store {
        id: UID,
        stream_id: ID,
        sender: address,
    }

    /// Create a new stream and fund it with `coin`.
    /// Returns the Stream (transferred to recipient) and StreamCap (transferred to sender).
    public entry fun create_stream<T>(
        coin: Coin<T>,
        recipient: address,
        rate_per_second: u64,
        duration_ms: u64,
        ctx: &mut TxContext,
    ) {
        let total = (rate_per_second * duration_ms) / 1000;
        let coin_value = coin::value(&coin);
        assert!(coin_value >= total, EInsufficientBalance);
        assert!(rate_per_second > 0, EZeroAmount);

        let start_ms = timestamp::now_ms(ctx);
        let end_ms = start_ms + duration_ms;

        // Split balance — only `total` goes into the stream
        let (principal, refund) = if (coin_value == total) {
            (coin, coin::zero(ctx))
        } else {
            coin::split(coin, total, ctx)
        };

        let stream = Stream<T> {
            id: object::new(ctx),
            sender: tx_context::sender(ctx),
            recipient,
            total_amount: total,
            rate_per_second,
            start_ms,
            end_ms,
            withdrawn: 0,
            paused: false,
            balance: coin::into_balance(principal),
        };

        let stream_id = object::id(&stream);
        let cap = StreamCap {
            id: object::new(ctx),
            stream_id,
            sender: tx_context::sender(ctx),
        };

        // Refund excess to sender
        if (coin::value(&refund) > 0) {
            transfer::public_transfer(refund, tx_context::sender(ctx));
        };

        // Stream goes to recipient; cap stays with sender.
        transfer::transfer(stream, recipient);
        transfer::transfer(cap, tx_context::sender(ctx));
    }

    /// Compute accrued amount (capped by total_amount and elapsed time).
    public fun accrued<T>(stream: &Stream<T>, now_ms: u64): u64 {
        if (stream.paused) {
            return stream.withdrawn;
        };
        let elapsed = if (now_ms > stream.end_ms) {
            stream.end_ms - stream.start_ms
        } else {
            now_ms - stream.start_ms
        };
        let total_accrued = (stream.rate_per_second * elapsed) / 1000;
        let capped = if (total_accrued > stream.total_amount) stream.total_amount else total_accrued;
        capped - stream.withdrawn
    }

    /// Recipient withdraws whatever has accrued.
    public entry fun withdraw<T>(
        stream: Stream<T>,
        ctx: &mut TxContext,
    ): Coin<T> {
        let Stream<T> { id, sender, recipient, total_amount, rate_per_second, start_ms, end_ms, withdrawn: old_withdrawn, paused, mut balance } = stream;
        let now_ms = timestamp::now_ms(ctx);
        let accrued_amt = accrue_internal(total_amount, rate_per_second, start_ms, end_ms, old_withdrawn, paused, now_ms);
        assert!(accrued_amt > 0, EZeroAmount);

        let coin = coin::from_balance(balance_split(&mut balance, accrued_amt), ctx);

        // Re-construct stream with updated state and re-transfer to recipient.
        let updated = Stream<T> {
            id,
            sender,
            recipient,
            total_amount,
            rate_per_second,
            start_ms,
            end_ms,
            withdrawn: old_withdrawn + accrued_amt,
            paused,
            balance,
        };
        transfer::transfer(updated, recipient);
        coin
    }

    /// Sender pauses the stream (no accrual while paused).
    public entry fun pause<T>(cap: &StreamCap, stream: &mut Stream<T>, ctx: &TxContext) {
        assert!(cap.sender == tx_context::sender(ctx), EUnauthorized);
        assert!(cap.stream_id == object::id(stream), EUnauthorized);
        stream.paused = true;
    }

    public entry fun resume<T>(cap: &StreamCap, stream: &mut Stream<T>, ctx: &TxContext) {
        assert!(cap.sender == tx_context::sender(ctx), EUnauthorized);
        assert!(cap.stream_id == object::id(stream), EUnauthorized);
        stream.paused = false;
    }

    /// Cancel stream: refund remaining balance to sender.
    public entry fun cancel<T>(cap: StreamCap, stream: Stream<T>, ctx: &mut TxContext) {
        let StreamCap { id: cap_id, stream_id, sender } = cap;
        let Stream<T> { id, sender: stream_sender, recipient, total_amount: _, rate_per_second: _, start_ms: _, end_ms: _, withdrawn, paused: _, balance } = stream;
        assert!(sender == tx_context::sender(ctx), EUnauthorized);
        assert!(stream_id == id, EUnauthorized);

        // Refund remaining balance to sender.
        let refund_coin = coin::from_balance(balance, ctx);
        transfer::public_transfer(refund_coin, sender);

        object::delete(id);
        object::delete(cap_id);
        //recipient;  // suppress unused warning
        //withdrawn;   // suppress unused warning
        //stream_sender;
    }

    // ====== Internal helpers ======

    fun accrue_internal(
        total: u64,
        rate: u64,
        start_ms: u64,
        end_ms: u64,
        withdrawn: u64,
        paused: bool,
        now_ms: u64,
    ): u64 {
        if (paused) return 0;
        let elapsed = if (now_ms > end_ms) end_ms - start_ms else now_ms - start_ms;
        let total_accrued = (rate * elapsed) / 1000;
        let capped = if (total_accrued > total) total else total_accrued;
        if (capped > withdrawn) capped - withdrawn else 0
    }

    fun balance_split<T>(b: &mut Balance<T>, amount: u64): Balance<T> {
        balance::split(b, amount)
    }

    // ====== Display / inspection ======

    public fun stream_id<T>(s: &Stream<T>): ID { object::id(s) }
    public fun sender<T>(s: &Stream<T>): address { s.sender }
    public fun recipient<T>(s: &Stream<T>): address { s.recipient }
    public fun total_amount<T>(s: &Stream<T>): u64 { s.total_amount }
    public fun rate_per_second<T>(s: &Stream<T>): u64 { s.rate_per_second }
    public fun withdrawn<T>(s: &Stream<T>): u64 { s.withdrawn }
    public fun is_paused<T>(s: &Stream<T>): bool { s.paused }
}
