'use client';

import { CreateCounter } from '@/components/CreateCounter';
import { PlayGame } from '@/components/PlayGame';
import { RequestSUI } from '@/components/RequestSUI';
import { SignInWelcome } from '@/components/SignInWelcome';
import { Spinner } from '@/components/Spinner';
import { useBalance } from '@/contexts/BalanceContext';
import { useSixWoodsGame } from '@/hooks/useSixWoodsGame';
import { useZkLogin } from '@mysten/enoki/react';
import BigNumber from 'bignumber.js';
import { useEffect } from 'react';

const BALANCE_LIMIT = BigNumber(0.5);

const PlayPage = () => {
  const { address } = useZkLogin();
  const { balance, handleRefreshBalance } = useBalance();
  const {
    game,
    canPlay,
    isPlaying,
    counterId,
    isCreateCounterLoading,
    handleCreateCounter,
    handlePlay,
    handleRestart
  } = useSixWoodsGame();

  useEffect(() => {
    setTimeout(() => {
      handleRefreshBalance();
    }, 2000);
  }, [game?.status]);

  if (!address) return <SignInWelcome />;

  if (!canPlay) return <Spinner />;

  if (balance.isLessThan(BALANCE_LIMIT)) return <RequestSUI />;

  if (!counterId) {
    return (
      <CreateCounter
        handleCreateCounter={handleCreateCounter}
        isLoading={isCreateCounterLoading}
        counterId={counterId}
      />
    );
  }

  return (
    <PlayGame
      game={game}
      play={handlePlay}
      isPlaying={isPlaying}
      restart={handleRestart}
    />
  );
};

export default PlayPage;
