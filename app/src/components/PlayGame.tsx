import { Button } from '@/components/Button';
import { SuiExplorerLink } from '@/components/SuiExplorerLink';
import { GameOnChain } from '@/types/GameOnChain';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
    <>
      <h2 className="text-3xl sm:text-5xl font-medium mb-4 sm:mb-6">
        {game ? message(game.status) : 'Which will be fastest?'}
      </h2>
      <div className="flex space-x-4 mb-12 items-start">
        {(game ? game.woods : [0, 1, 2, 3, 4, 5]).map((wood, index) => (
          <div
            key={index}
            className={`rounded p-1 flex flex-col items-center justify-center ${
              game?.player_wood_index == index || player_wood_index == index
                ? 'bg-red-700 '
                : ''
            }${game ? '' : 'cursor-pointer'}`}
            onClick={() => (game ? null : setPlayerWoodIndex(index))}
          >
            <Image
              src={`/assets/wood.svg`}
              alt={`Wood ${index}${game ? ` - ${wood}` : ''}`}
              width={50}
              height={120}
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
        <div className="flex space-x-1 items-center">
          <div className="text-gray-100 text-sm">View on Sui Explorer:</div>
          <SuiExplorerLink
            objectId={game.id.id}
            type="object"
            className="!text-gray-300 text-sm"
          />
        </div>
      ) : (
        <></>
      )}

      <Button
        disabled={player_wood_index === null || isPlaying}
        onClick={game ? restart : () => play(player_wood_index!)}
        isLoading={isPlaying}
        svg="lightning-bolt-black"
        text={`PLAY ${game ? 'AGAIN' : ''}`}
      />
    </>
  );
};
