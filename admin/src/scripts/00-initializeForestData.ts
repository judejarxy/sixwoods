import { SuiClient } from "@mysten/sui.js/client";
import { initializeForestData } from "../helpers/actions/initializeForestData";
import fs from "fs";
import { SUI_NETWORK } from "../config";

const initializeForest = async () => {
  const forestDataId = await initializeForestData({
    suiClient: new SuiClient({ url: SUI_NETWORK }),
  });
  fs.appendFileSync("./.env", `FOREST_DATA_ID=${forestDataId}\n`);
  fs.appendFileSync(
    "../app/.env",
    `NEXT_PUBLIC_FOREST_DATA_ID=${forestDataId}\n`
  );
};

initializeForest();
