'use client';

import React, { useEffect } from 'react';
import { useSixWoodsGame } from '@/hooks/useSixWoodsGame';
import { Spinner } from '../components/general/Spinner';
import { SignInWelcome } from '../components/home/SignInWelcome';
import { useZkLogin } from '@mysten/enoki/react';
import { useBalance } from '@/contexts/BalanceContext';
import BigNumber from 'bignumber.js';
import { SetupGame } from '@/components/home/SetupGame';
import { PlayGame } from '@/components/home/PlayGame';

const HomePage = () => {
  const { address } = useZkLogin();
  const { balance, handleRefreshBalance } = useBalance();
  const {
    game,
    isLoading,
    isPlaying,
    counterId,
    isCounterIdLoading,
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

  if (!address) {
    return <SignInWelcome />;
  }

  if (isCounterIdLoading) {
    return <Spinner />;
  }

  if (balance.isLessThan(BigNumber(0.5)) || !counterId) {
    return (
      <SetupGame
        balance={balance}
        counterId={counterId}
        handleCreateCounter={handleCreateCounter}
        isCreateCounterLoading={isCreateCounterLoading}
        isLoading={isLoading}
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

export default HomePage;
