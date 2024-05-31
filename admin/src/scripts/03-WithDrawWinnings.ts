import { SuiClient } from "@mysten/sui.js/client";
import { ADMIN_SECRET_KEY, FOREST_DATA_ID, SUI_NETWORK } from "../config.ts";
import { withdrawFromForest } from "../helpers/actions/withdrawFromForest.ts";

const withdrawStakes = async () => {
  const suiClient = new SuiClient({ url: SUI_NETWORK });
  await withdrawFromForest({
    suiClient,
    forestDataId: FOREST_DATA_ID,
    adminSecretKey: ADMIN_SECRET_KEY,
    withdrawalSource: "winnings",
  });
};

withdrawStakes();
