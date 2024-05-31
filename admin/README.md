# Admin

## Description

This is the Typescript admin project of the SixWoods game. It contains:

- environment variable (`.env`) file reading
- Sui SDK integration
- shell script to publish the smart contracts and populate the `.env` file

## Environment variables

- Create a `.env` file following the format of the `.env.example` file, to insert the target sui network and other .env variables.
- `.env` file is not tracked by Git
- Add the corresponding export statements in the `src/config.ts` file
- Create an environment variable `ADMIN_SECRET_KEY` (OS Variable, not inside the `.env` file) to hold the **secret key** of the **_admin (Forest) account._**
- The format for the env variables is : `VAR_NAME="your_secret_key_here"`

## Warning!

DO NOT ADD THE ADMIN SECRET KEY IN ANY PLACE INSIDE THE CODE BASE!

## Quickstart

- cd into the admin/ directory: `cd admin/`
- install the npm dependencies with: `npm i`
- initialize `environmental variables` based on the previous section of the README.md file
- Publish the contracts with: `./publish.sh testnet`
- Initialize the forest data with: `npm run init-forest` (admin account needs to have at least 10 SUI + gas, to top-up the initial forest funds)
- When needed, top-up or withdraw with the appropriate commands too.

## NPM Scripts

NPM Scripts for admin actions

> - `npm run init-forest`
> - `npm run topup`
> - `npm run withdraw-stakes`
> - `npm run withdraw-winnings`

## Project structure

- `publish.sh`: the publish script
- `src/`:
  - `config.ts`: retrieves and exports the specified environmental variables of the .env file (and the host machine)
  - `helpers/`:
    - `actions/`: various helper functions to isolate the reusable steps of the process 
    - `bls/`: helper functions for the bls signatures 
    - `keypair/`: helper functions for handling the keypairs
  - `scripts/`: typescript scripts for admin actions (initialize, topup, and withdraw).
    - `00-initializeForestData`: Invokes the `initialize_forest_data` Move function that initializes the game. Should only run once.
    - `01-TopUpForest`: Adds 1K SUI to the stakes balance of the FOREST_DATA object
    - `02-WithDrawStakes`: **Forest** Withdraws all the available stakes balance from the FOREST_DATA
    - `02-WithDrawWinnings`: **Forest** Withdraws all the available winnings balance from the FOREST_DATA

## Local Deployment

- Run the deployment script: `./publish.sh`

## Testnet Deployment

- Switch your local cli to _testnet_ env first:

```shell
sui client switch --env testnet
cd setup
./publish testnet
```
