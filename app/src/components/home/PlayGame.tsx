import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { LoadingButton } from '../general/LoadingButton';
import Link from 'next/link';
import { GameOnChain } from '@/types/GameOnChain';
import { Button } from '@/components/ui/button';
import { SuiExplorerLink } from '@/components/general/SuiExplorerLink';

const message = (status: number) =>
  status == 0 ? 'You won!' : status == 1 ? 'Unlucky!' : 'Draw!';

interface PlayGameProps {
  game: GameOnChain | null;
  play: (player_wood_index: number) => Promise<void>;
  isPlaying: boolean;
  restart: () => void;
}

export const PlayGame = ({ game, play, isPlaying, restart }: PlayGameProps) => {
  const [player_wood_index, setPlayerWoodIndex] = useState<number | null>(null);

  useEffect(() => {
    if (game) {
      setPlayerWoodIndex(null);
    }
  }, [game]);

  return (
    <div className="flex flex-col p-[50px] w-full rounded-[24px] items-center space-y-[50px]">
      <div className="text-[25px] font-semibold text-center">
        {game ? message(game.status) : 'Which will be fastest?'}
      </div>
      <div className="flex space-x-4">
        {(game ? game.woods : [0, 1, 2, 3, 4, 5]).map((wood, index) => (
          <div
            key={index}
            className={`rounded p-1 flex items-center justify-center ${
              game?.player_wood_index == index || player_wood_index == index
                ? 'bg-stone-800 '
                : ''
            }${game ? '' : 'cursor-pointer'}`}
            onClick={() => (game ? null : setPlayerWoodIndex(index))}
          >
            <Image
              src={`/assets/wood.svg`}
              alt={`Wood ${index}${game ? ` - ${wood}` : ''}`}
              width={30}
              height={80}
            />
            {game && (
              <div className="text-xs">
                {wood}
                {game.player_wood_index == index && (
                  <>
                    <br />
                    <span>(Yours)</span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {game ? (
        <>
          <div className="flex space-x-1 items-center">
            <div className="text-gray-100 text-sm">Object on Sui Explorer:</div>
            <SuiExplorerLink
              objectId={game.id.id}
              type="object"
              className="!text-gray-300 text-sm"
            />
          </div>
          <Button className="rounded-full py-[10px] px-12" onClick={restart}>
            Play Again
          </Button>
        </>
      ) : (
        <>
          <div className="text-center text-muted text-opacity-90 text-[14px] text-[#4F4F4F] max-w-md">
            <div>
              Predict the fastest wood to be fetched and play. This will stake{' '}
              <b>0.2 SUI</b> from your wallet. The forest will also put stakings
              for each other wood. If your wood was the fastest, you win all the
              staked SUI (x6).
            </div>
            <Link
              href="/rules"
              target="_blank"
              rel="noopenner noreferrer"
              className="flex items-center space-x-1 justify-center mt-3 underline"
            >
              <div>Game Rules</div>
              <Image
                src="/assets/arrow-top-right.svg"
                alt="Game Rules"
                width={8}
                height={8}
              />
            </Link>
          </div>
          <LoadingButton
            className="rounded-full py-[10px] px-12"
            spinnerClassName="text-white !w-5 !h-5 mr-2"
            disabled={player_wood_index === null || isPlaying}
            onClick={() => play(player_wood_index!)}
            isLoading={isPlaying}
          >
            {isPlaying ? 'Playing' : 'Play'}
          </LoadingButton>
        </>
      )}
    </div>
  );
};
