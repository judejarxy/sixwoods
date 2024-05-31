import { useEffect, useState } from 'react';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { GameOnChain } from '@/types/GameOnChain';
import { usePlayerCounter } from './usePlayerCounter';
import { useZkLogin } from '@mysten/enoki/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSui } from './useSui';
import { SuiObjectChangeCreated } from '@mysten/sui.js';
import { useEnokiFlow } from '@mysten/enoki/react';

import { getGameObject } from '@/utils/getGameObject';

export const useSixWoodsGame = () => {
  const { suiClient, enokiSponsorExecute } = useSui();
  const { address } = useZkLogin();
  const enokiFlow = useEnokiFlow();
  const [game, setGame] = useState<GameOnChain | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    counterId,
    handleCreateCounter,
    isLoading: isCounterIdLoading,
    isCreateLoading: isCreateCounterLoading
  } = usePlayerCounter();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (player_wood_index: number): Promise<void> => {
    if (!counterId) {
      toast.error('Counter NFT not created');
      return;
    }

    console.log('Playing ...');
    setIsPlaying(true);
    try {
      console.log('Obtaining hash from API...');
      const apiResp = await axios.post('/api/play', {
        counterId,
        player_wood_index
      });
      const hash = apiResp.data;
      console.log('Hash obtained from API ... ');
      if (!hash) throw new Error('Invalid hash from API');

      console.log('Playing with Sui ...');
      const tx = new TransactionBlock();
      tx.setGasBudget(300000000);
      const stake = tx.splitCoins(tx.gas, [tx.pure('200000000')]);
      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::single_player_sixwoods::play`,
        arguments: [
          tx.pure(player_wood_index),
          tx.object(counterId),
          stake,
          tx.pure(Array.from(hash), 'vector<u8>'),
          tx.object(process.env.NEXT_PUBLIC_FOREST_DATA_ID!)
        ]
      });

      const signer = await enokiFlow.getKeypair({ network: 'testnet' });
      const suiResp = await suiClient.signAndExecuteTransactionBlock({
        signer: signer as any,
        transactionBlock: tx,
        requestType: 'WaitForLocalExecution',
        options: {
          showObjectChanges: true,
          showEffects: true,
          showEvents: true
        }
      });

      // const suiResp = await enokiSponsorExecute({
      //   transactionBlock: tx,
      //   options: {
      //     showEffects: true,
      //     showEvents: true,
      //     showObjectChanges: true
      //   }
      // });

      console.log(suiResp);
      const status = suiResp?.effects?.status.status;
      console.log(`status: ${status}`);

      await suiClient.waitForTransactionBlock({
        digest: suiResp.effects?.transactionDigest!,
        timeout: 10_000
      });

      if (status !== 'success') throw new Error('Transaction failed');
      const createdObjects = suiResp.objectChanges?.filter(
        ({ type }) => type === 'created'
      ) as SuiObjectChangeCreated[];
      const createdGame = createdObjects.find(({ objectType }) =>
        objectType.endsWith('single_player_sixwoods::Game')
      );

      if (!createdGame) throw new Error('Game not created');
      const { objectId } = createdGame;
      console.log('Created Game ID:', objectId);

      const fetched = await getGameObject({ suiClient, gameId: objectId });
      setGame(fetched);
    } catch (e) {
      console.log(e);
      toast.error(`${e}`);
      setGame(null);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    setGame(null);
    setIsLoading(false);
  };

  useEffect(() => {
    handleRestart();
  }, [address]);

  return {
    game,
    isLoading,
    counterId,
    isCounterIdLoading,
    isCreateCounterLoading,
    isPlaying,
    handleCreateCounter,
    canPlay: !isLoading && !isCounterIdLoading,
    handlePlay,
    handleRestart
  };
};
