import {Button }from '@/components/Button';
import { useEnokiFlow } from '@mysten/enoki/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const SignInWelcome = () => {
  const enokiFlow = useEnokiFlow();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const protocol = window.location.protocol;
    const host = window.location.host;
    const redirectUrl = `${protocol}//${host}/auth`;
    try {
      const url = await enokiFlow.createAuthorizationURL({
        provider: 'google',
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirectUrl,
        network: 'testnet',
        extraParams: {
          scope: ['openid', 'email', 'profile']
        }
      });
      router.push(url);
    } catch (e) {
      console.error(e);
      toast.error('Failed to redirect to Google Sign In. Please try again.');
      toast.error(`${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl sm:text-5xl font-medium mb-2 sm:mb-6">Welcome</h2>
      <div className="text-lg max-w-sm sm:text-xl sm:max-w-lg">
        <p className="mb-4">
          Enter the enchanted forest, where magical trees have been splitted
          into logs of wood with eternal spells. Play against the forest by
          retrieving magical woods.
        </p>
        <p className="mb-4">
          You win when your wood had the shortest retrieval time. To play,
          predict the fastest wood (out of a pack of 6) and stake your SUI. If
          you win, you get 6 times your stake.
        </p>
        <p className="mb-8">Sign In to start playing.</p>
      </div>
      <Button
        onClick={handleSignIn}
        isLoading={isLoading}
        svg="google"
        text="SIGN IN"
      />
    </>
  );
};
