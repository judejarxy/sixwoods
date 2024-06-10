import { Button } from '@/components/Button';

interface CreateCounterProps {
  handleCreateCounter: () => void;
  isLoading: boolean;
  counterId: string | null;
}

export const CreateCounter = ({
  handleCreateCounter,
  isLoading,
  counterId
}: CreateCounterProps) => {
  return (
    <>
      <h2 className="text-3xl sm:text-5xl font-medium mb-2 sm:mb-6">
        Just This Once
      </h2>
      <p className="text-lg max-w-sm sm:text-xl sm:max-w-lg mb-4 sm:mb-8">
        To play, you need a <span className="font-bold">Counter NFT </span>
        before playing. It will keep track of your games. It will also ensure
        randomness for the woods during play.
      </p>
      <Button
        onClick={handleCreateCounter}
        isLoading={isLoading}
        disabled={!!counterId}
        svg="lightning-bolt-black"
        text="GET NFT"
      />
    </>
  );
};
