import { CounterNFT } from '@/types/CounterNFT';
import { SuiClient, SuiMoveObject } from '@mysten/sui.js/client';

interface GetCounterObjectProps {
  suiClient: SuiClient;
  counterId: string;
}
export const getCounterObject = async ({
  suiClient,
  counterId
}: GetCounterObjectProps): Promise<CounterNFT> => {
  const res = await suiClient.getObject({
    id: counterId,
    options: { showContent: true }
  });
  const gameObject = res?.data?.content as SuiMoveObject;
  const { fields } = gameObject;
  return fields as unknown as CounterNFT;
};
