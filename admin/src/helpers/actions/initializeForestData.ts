import { SuiClient, SuiObjectChangeCreated } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair } from "../keypair/getKeyPair";
import { getBLSPublicKey } from "../bls/getBLSPublicKey";
import {
  PACKAGE_ADDRESS,
  FOREST_ADMIN_CAP,
  ADMIN_SECRET_KEY,
} from "../../config";
import { MIST_PER_SUI } from "@mysten/sui.js/utils";

interface InitializeForestBalanceProps {
  suiClient: SuiClient;
}

export const initializeForestData = async ({
  suiClient,
}: InitializeForestBalanceProps): Promise<string | undefined> => {
  console.log("Initializing ForestData...");
  const tx = new TransactionBlock();

  const forestCoin = tx.splitCoins(tx.gas, [
    tx.pure(10 * Number(MIST_PER_SUI)),
  ]);
  let adminBLSPublicKey = getBLSPublicKey(ADMIN_SECRET_KEY!);

  tx.moveCall({
    target: `${PACKAGE_ADDRESS}::single_player_sixwoods::initialize_forest_data`,
    arguments: [
      tx.object(FOREST_ADMIN_CAP),
      forestCoin,
      tx.pure(Array.from(adminBLSPublicKey)),
    ],
  });

  return suiClient
    .signAndExecuteTransactionBlock({
      signer: getKeypair(ADMIN_SECRET_KEY!),
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    })
    .then((resp) => {
      const status = resp?.effects?.status.status;
      console.log("executed! status = ", status);
      if (status !== "success") {
        throw new Error("ForestData not created");
      }
      if (status === "success") {
        const createdObjects = resp.objectChanges?.filter(
          ({ type }) => type === "created"
        ) as SuiObjectChangeCreated[];
        const createdForestData = createdObjects.find(({ objectType }) =>
          objectType.endsWith("single_player_sixwoods::ForestData")
        );
        if (!createdForestData) {
          throw new Error("ForestData not created");
        }
        const { objectId: forestDataId } = createdForestData;
        console.log({ forestDataId });
        return forestDataId;
      }
    })
    .catch((err) => {
      console.error("Error = ", err);
      return undefined;
    });
};
