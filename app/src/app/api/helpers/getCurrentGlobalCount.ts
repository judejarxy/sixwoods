import { SuiClient, SuiMoveObject } from '@mysten/sui.js/client';

export const getCurrentGlobalCount = async (
  suiClient: SuiClient
): Promise<number> => {
  const res = await suiClient.getObject({
    id: process.env.NEXT_PUBLIC_FOREST_DATA_ID!,
    options: { showContent: true }
  });
  const gameObject = res?.data?.content as SuiMoveObject;
  const { fields } = gameObject;
  return (fields as any)['global_counter'];
};
