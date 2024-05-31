# SixWoods

Enter the enchanted forest, where magical trees have been splitted into logs of wood with eternal spells. Play against the forest by retrieving magical woods.

You win when your wood had the shortest retrieval time. To play, predict the fastest wood (out of a pack of 6) and stake your SUI. If you win, you get 6 times your stake.

## Sui SixWoods Modules

A **Game** in SixWoods is an object that holds data about an "instance" of play by a user.
The shared **ForestData** object track of a global counter of SixWoods games and balances for forest stakes and winnings.

### `single_player_sixwoods.move`

This module defines the `play` function that players call with their guessed wood index.<br />
The function uses the current global count of games, the user's guessed wood index and their CounterNFT to generate randommess. <br />
This randommess is used to generate six woods. The generated values are compared. <br/>s
The player is a winner if their guessed index is the index of the lowest wood.

### `counter_nft.move`

This module defines the Counter NFT object and provides methods to create and increment it.<br/>
The Counter NFT is used as the VRF input for every game that a player plays.<br/>
The count always increases after use, ensuring a unique input for every game.<br/>
A player is required to create a Counter NFT before playing their first game.<br/>
The UI can seemlessly create the Counter NFT for the user by including the counter creation along with the game creation function in the same PTB.

## Admin

1. cd into the setup/ directory: `cd admin/`
2. install the npm dependencies with: `npm i`
3. initialize your `environmental variables` based on the `Environment variables` section of the `admin/README.md` file
4. Run the following:
5. Publish the contracts with: `./publish.sh testnet`
6. Initialize the forest data with: `npm run init-forest` (admin account needs to have at least 10 SUI + gas, to top-up the initial forest funds)
7. cd back into the app/ directory: `cd ../app/`
8. install the pnpm dependencies with `pnpm i`
9. start the development server with `pnpm run dev`

## Gameplay

- This is a 1-1 version of the game, where the player plays against the forest.
- Forest has a public BLS key.
- Player predicts the wood that will have the shortest value and sends the index of that wood in the play function.
- Randomness is generated with:
  - The current global count of games,
  - The player's wood index, and
  - The player's CounterNFT.
- The frontend calls the API to sign and send the randomness. This BLS signed hash is part of the play Move function's parameters.
- During play, the generated randomness is used to obtain six random wood values. They are compared and if the player's index has the shortest wood, the player is a winner and wins six times their stake.

**_Stake is fixed at 0.2 SUI_**

### Source Code Directories structure

- move:

  - Contains the Move code of the smart contracts
  - Contains a move package named `sixwoods` which contains the Move code of the smart contracts.

- app

  - Contains The frontend code of the app.
    - React.js
    - Next.js Framework
    - Tailwind CSS

- admin
  - A Typescript project, with a ready-to-use:
    - environment variable (.env) file reading
    - Sui SDK integration
    - [publish shell script](./setup/publish.sh)
