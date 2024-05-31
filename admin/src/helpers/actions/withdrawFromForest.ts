import { SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { PACKAGE_ADDRESS } from "../../config";
import { getKeypair } from "../keypair/getKeyPair";

type WithdrawalSource = "stakes" | "winnings";

interface DrawFromForest {
  suiClient: SuiClient;
  forestDataId: string;
  adminSecretKey: string;
  withdrawalSource: WithdrawalSource;
}

export const withdrawFromForest = async ({
  suiClient,
  forestDataId,
  adminSecretKey,
  withdrawalSource,
}: DrawFromForest) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ADDRESS}::single_player_blackjack::withdraw_${withdrawalSource}`,
    arguments: [tx.object(forestDataId)],
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
        throw new Error(`Could not withdraw ${withdrawalSource} from forest`);
      }
      console.log(`Withdrawn ${withdrawalSource} from forest successfully`);
    })
    .catch((err) => {
      console.log(err);
    });
};
