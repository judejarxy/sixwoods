import { ChildrenProps } from '@/types/ChildrenProps';
import { createContext, useContext, useEffect, useState } from 'react';

export const useGameAudio = () => useContext(GameAudioContext);

interface GameAudioContextProps {
  isPlaying: boolean;
  toggleAudio: () => void;
}

export const GameAudioContext = createContext<GameAudioContextProps>({
  isPlaying: false,
  toggleAudio: () => {}
});

export const GameAudioProvider = ({ children }: ChildrenProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const method = isPlaying ? 'pause' : 'play';
    (document.getElementById('audio') as HTMLAudioElement)[method]();
    localStorage.setItem('audio', `${!isPlaying}`);
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    document.body.addEventListener('click', () => {
      if (localStorage.getItem('audio') === 'false') return;
      toggleAudio();
    });
  }, []);

  return (
    <GameAudioContext.Provider value={{ isPlaying, toggleAudio }}>
      {children}

      <audio id="audio">
        <source src="/assets/forest.mp3" type="audio/mpeg" />
      </audio>
    </GameAudioContext.Provider>
  );
};
