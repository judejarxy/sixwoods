import { Button } from '@/components/Button';
import { useRequestSui } from '@/hooks/useRequestSui';

export const RequestSUI = () => {
  const { handleRequestSui, isLoading } = useRequestSui();

  return (
    <>
      <h2 className="text-3xl sm:text-5xl font-medium mb-2 sm:mb-6">
        Let&apos;s Get Sui
      </h2>
      <p className="text-lg max-w-sm sm:text-xl sm:max-w-lg mb-4 sm:mb-8">
        Looks like your Testnet SUI balance is less than 1 SUI. You need Testnet
        SUI to play. Get some below. Its free.
      </p>
      <Button
        onClick={handleRequestSui}
        isLoading={isLoading}
        svg="lightning-bolt-black"
        text="GET SUI"
      />
    </>
  );
};
