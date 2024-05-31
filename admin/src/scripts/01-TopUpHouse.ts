import { SuiClient } from "@mysten/sui.js/client";
import { SUI_NETWORK, ADMIN_SECRET_KEY, FOREST_DATA_ID } from "../config";
import { topUpForestData } from "../helpers/actions/topUpForest";

const forestTopUp = async () => {
  const suiClient = new SuiClient({ url: SUI_NETWORK });
  await topUpForestData({
    adminSecretKey: ADMIN_SECRET_KEY,
    forestDataId: FOREST_DATA_ID,
    suiClient,
  });
};

forestTopUp();
