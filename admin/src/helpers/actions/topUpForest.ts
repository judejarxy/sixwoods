import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { PACKAGE_ADDRESS } from "../../config";
import { getKeypair } from "../keypair/getKeyPair";

interface TopUpForestDataProps {
  adminSecretKey: string;
  suiClient: SuiClient;
  forestDataId: string;
}

export const topUpForestData = async ({
  adminSecretKey,
  forestDataId,
  suiClient,
}: TopUpForestDataProps) => {
  const tx = new TransactionBlock();

  const coin = tx.splitCoins(tx.gas, [tx.pure(1000_000_000_000)]);
  tx.moveCall({
    target: `${PACKAGE_ADDRESS}::single_player_sixwoods::top_up`,
    arguments: [tx.object(forestDataId), coin],
  });

  return suiClient
    .signAndExecuteTransactionBlock({
      signer: getKeypair(adminSecretKey),
      transactionBlock: tx,
      requestType: "WaitForLocalExecution",
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    })
    .then((resp) => {
      const status = resp?.effects?.status.status;
      if (status !== "success") {
        throw new Error("ForestData not topped up");
      }
      console.log("ForestData topped up successfully");
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });
};
