module sixwoods::single_player_sixwoods {

    // Imports
    use sui::bls12381::bls12381_min_pk_verify;
    use sui::balance::{Self, Balance};
    use sui::bcs::{Self};
    use sui::coin::{Self, Coin};
    use sui::hash::{blake2b256};
    use sui::event::{Self};
    use sui::sui::SUI;
    use sui::address;
    use sixwoods::counter_nft::Counter;


    // Constants
    const STAKE: u64 = 200000000;

    // Game statuses
    const PLAYER_WON_STATUS: u8 = 0;
    const FOREST_WON_STATUS: u8 = 1;
    const TIE_STATUS: u8 = 2;


    // Errors
    const EInvalidBlsSig: u64 = 10;
    const EInsufficientBalance: u64 = 11;
    const EInsufficientForestBalance: u64 = 12;
    const EInvalidPlayerStakeAmount: u64 = 13;
    const ECallerNotForest: u64 = 14;

    // Events
    public struct GamePlayedEvent has copy, drop {
        game_id: ID,
        game_status: u8,
        global_game_count: u64,
        winner_address: address,
        message: vector<u8>,
    }


    // Structs
    public struct ForestAdminCap has key {
        id: UID
    }

    public struct ForestData has key {
        id: UID,
        stakes_balance: Balance<SUI>,
        winnings_balance: Balance<SUI>,
        forest: address,
        public_key: vector<u8>,
        global_counter: u64,
    }

    public struct Game has key {
        id: UID,
        total_stake: Balance<SUI>,
        player: address,
        player_wood_index: u8, // 0 to 5
        woods: vector<u8>, // generated wood numbers
        status: u8,
        global_count: u64,
    }

    // Functions
    fun init(ctx: &mut TxContext) {
        let forest_cap = ForestAdminCap {
            id: object::new(ctx)
        };

        transfer::transfer(forest_cap, ctx.sender())
    }


    /// Initializer function that should only be called once and by the creator of the contract.
    /// Initializes the forest data object. This object is involed in all games created by the same instance of this package.
    /// @param forest_cap: The ForestCap object
    /// @param coin: The coin object that will be used to initialize the forest balance. Acts as a treasury
    /// @param public_key: The public key of the forest
    public entry fun initialize_forest_data(
        forest_cap: ForestAdminCap,
        coin: Coin<SUI>,
        public_key: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(coin::value(&coin) > 0, EInsufficientBalance);

        let forest_data = ForestData {
            id: object::new(ctx),
            stakes_balance: coin.into_balance(),
            winnings_balance: balance::zero(),
            forest: ctx.sender(),
            public_key,
            global_counter: 0,
        };

        let ForestAdminCap { id } = forest_cap;
        object::delete(id);

        transfer::share_object(forest_data);
    }

    /// Function used to top up the forest's stakes balance. Can be called by anyone.
    /// @param forest_data: The ForestData object
    /// @param coin: The coin object that will be used to top up the forest balance. The entire coin is consumed
    public entry fun top_up(forest_data: &mut ForestData, coin: Coin<SUI>, _: &mut TxContext) {
        let balance = coin.into_balance();
        forest_data.stakes_balance.join(balance);
    }

    /// Forest can withdraw the entire stakes balance of the forest object
    /// @param forest_data: The ForestData object
    public entry fun withdraw_stakes(forest_data: &mut ForestData, ctx: &mut TxContext) {
        // only the forest address can withdraw funds
        assert!(ctx.sender() == forest_data.forest, ECallerNotForest);
        let total_balance = forest_data.stakes_balance.value();
        let coin = coin::take(&mut forest_data.stakes_balance, total_balance, ctx);
        transfer::public_transfer(coin, forest_data.forest);
    }

    /// Forest can withdraw the entire winnings balance of the forest object
    /// @param forest_data: The ForestData object
    public entry fun withdraw_winnings(forest_data: &mut ForestData, ctx: &mut TxContext) {
        // only the forest address can withdraw funds
        assert!(ctx.sender() == forest_data.forest, ECallerNotForest);
        let total_balance = forest_data.winnings_balance.value();
        let coin = coin::take(&mut forest_data.winnings_balance, total_balance, ctx);
        transfer::public_transfer(coin, forest_data.forest);
    }

    /// Function used to play the game. The player must provide their wood index (position in 6).
    /// Stake is taken from the player's coin and added to the game's stake. The forest's stake is also added to the game's stake.
    /// The game is played by generating 6 random numbers (woods) and selecting the lowest one. If the player's selected wood is the lowest, they win the game.
    /// @param player_wood_index: The wood number selected by the player
    /// @param player_counter: A player counter object that serves as additional source of randomness.
    /// @param player_stake: The coin object that will be used to take the player's stake
    /// @param bls_sig: The bls signature of the global game counter and the player's randomn bytes and the counter appended together
    /// @param forest_data: The ForestData object
    public entry fun play(
        player_wood_index: u8,
        player_counter: &mut Counter,
        player_stake: Coin<SUI>,
        bls_sig: vector<u8>,
        forest_data: &mut ForestData,
        ctx: &mut TxContext
    ) {
        // Ensure that the forest has enough balance to play for this game
        assert!(forest_data.stakes_balance() >= STAKE * 5, EInsufficientForestBalance);

        // Ensure the player stake is as expected
        assert!(player_stake.value() == STAKE, EInvalidPlayerStakeAmount);

        // get the forest balance
        let forest_stake = forest_data.stakes_balance.split(STAKE);

        // get game's total stake
        let mut total_stake = player_stake.into_balance();
        total_stake.join(forest_stake);

        // increment the global game counter
        let global_count = next_game_count(forest_data);

        // create the randomness vector
        let mut randomness_vector = vector[];
        randomness_vector.append(bcs::to_bytes(&global_count));
        randomness_vector.push_back(player_wood_index);
        randomness_vector.append(player_counter.increment_and_get());

        // Verify the BLS signature by admin
        let is_sig_valid = bls12381_min_pk_verify(&bls_sig, &forest_data.public_key, &randomness_vector);
        assert!(is_sig_valid, EInvalidBlsSig);

        // The woods that will be randomly gotten 
        let mut woods = vector[];

        // Hash the signature before using it
        let mut hashed_sign = blake2b256(&bls_sig);

        // shuffle and obtain six woods
        while (woods.length() < 6) {
            let (wood, last_hashed_sign) = g(&hashed_sign);
            //update the last_hash so we get a different wood next time
            hashed_sign = last_hashed_sign;
            woods.push_back(wood);
        };

        // compute winners
        let mut winner_wood_index: u8 = 0;
        let mut winners_indices = vector[]; // for ties  
        winners_indices.push_back(0);
        let mut i = 0;
        while (i < woods.length()) {
            if (woods[i] < woods[winner_wood_index as u64]) {
                winners_indices = vector[];
                winner_wood_index = i as u8;
                winners_indices.push_back(i as u8);
            } else if (winner_wood_index > 0 && woods[i] == woods[winner_wood_index as u64]) {
                winners_indices.push_back(i as u8);
            };
            i = i + 1;
        };

        let player = ctx.sender();
        let total_stake_value = total_stake.value();
        let sixth_stake = total_stake_value / 6;
        let five_sixth_stake = total_stake_value - sixth_stake;

        let status;
        let winner_address;
        let message;
        if (winners_indices.length() == 1 && winner_wood_index == player_wood_index) {
            // set game variables based on condition
            status = PLAYER_WON_STATUS;
            winner_address = player;
            message = b"Player won!";

            // transfer tokens based on condition
            let coin = coin::take(&mut total_stake, total_stake_value, ctx);
            transfer::public_transfer(coin, player);
        } else if (winners_indices.length() > 1 && winners_indices.contains(&player_wood_index)) {
            // set game variables based on condition
            status = TIE_STATUS;
            winner_address = @0x0;
            message = b"Tie!";

            // transfer tokens based on condition
            let player_coin = coin::take(&mut total_stake, sixth_stake, ctx);
            let forest_coin = coin::take(&mut total_stake, five_sixth_stake, ctx);
            transfer::public_transfer(player_coin, player);
            forest_data.stakes_balance.join(forest_coin.into_balance());
        } else {
            // set game variables based on condition
            status = FOREST_WON_STATUS;
            winner_address = forest_data.forest;
            message = b"Forest won!";

            // transfer tokens based on condition
            // re-save the five_sixth into stake and the won sixth into winnings
            let stakes_coin = coin::take(&mut total_stake, five_sixth_stake, ctx);
            let winnings_coin = coin::take(&mut total_stake, sixth_stake, ctx);
            forest_data.stakes_balance.join(stakes_coin.into_balance());
            forest_data.winnings_balance.join(winnings_coin.into_balance());
        };

        let new_game = Game {
            id: object::new(ctx),
            total_stake,
            player,
            player_wood_index,
            woods,
            status,
            global_count
        };
    
        event::emit(GamePlayedEvent {
            game_id: object::id(&new_game),
            game_status: status,
            global_game_count: global_count,
            winner_address,
            message
        });

        transfer::share_object(new_game);
    }



    /// HELPER FUNCTIONS 
    
    /// Internal function to increment global game count on forest 
    fun next_game_count(forest_data: &mut ForestData): u64 {
        forest_data.global_counter = forest_data.global_counter + 1;
        forest_data.global_counter
    }

    /// Returns next wood from the hashed byte array after re-hashing it
    ///
    /// @param hashed_byte_array: The hashed byte array
    /// @return: The next random wood (number from 0 to 99)
    /// --------------------------------
    public fun g(input_hash: &vector<u8>): (u8, vector<u8>) {
        // re-hash for taking next random number
        let rehash = blake2b256(input_hash);

        let temp_address = address::from_bytes(rehash);
        let value = temp_address.to_u256();

        // TODO: Review the modulo operation
        let randomWood = ((value % 99) as u8);
        (randomWood, rehash)
    }

    // --------------- Accessors ---------------

    /// Returns the stakes balance of the forest
    /// @param forest_data: The ForestData object
    public fun stakes_balance(forest_data: &ForestData): u64 {
        forest_data.stakes_balance.value()
    }

    /// Returns the winnings balance of the forest
    /// @param forest_data: The ForestData object
    public fun winnings_balance(forest_data: &ForestData): u64 {
        forest_data.stakes_balance.value()
    }

    /// Returns the address of the forest
    /// @param forest_data: The ForestData object
    public fun forest(forest_data: &ForestData): address {
        forest_data.forest
    }

    /// Returns the public key of the forest
    /// @param forest_data: The ForestData object
    public fun public_key(forest_data: &ForestData): vector<u8> {
        forest_data.public_key
    }

    /// Returns the global counter of games
    /// @param forest_data: The ForestData object
    public fun global_counter(forest_data: &ForestData): u64 {
        forest_data.global_counter
    }

    /// Game accessors

    public fun total_stake(game: &Game): u64 {
        game.total_stake.value()
    }

    public fun player(game: &Game): address {
        game.player
    }

    public fun player_wood_index(game: &Game): u8 {
        game.player_wood_index
    }

    public fun woods(game: &Game): vector<u8> {
        game.woods
    }

    public fun status(game: &Game): u8 {
        game.status
    }

    public fun global_count(game: &Game): u64 {
        game.global_count
    }
}
