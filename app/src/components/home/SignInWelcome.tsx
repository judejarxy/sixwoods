import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useEnokiFlow } from '@mysten/enoki/react';
import { useRouter } from 'next/navigation';
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
    <div className="flex flex-col items-center space-y-[20px]">
      <div className="p-4 max-w-[512px] mx-auto space-y-[60px]">
        <div className="bg-white bg-opacity-90 flex flex-col px-4 py-8 sm:p-12 rounded-[24px] items-center">
          <div className="flex flex-col space-y-[30px] items-center">
            <div className="flex flex-col space-y-[20px] items-center">
              <div className="text-2xl text-primary font-bold">
                Welcome to SixWoods
              </div>
              <div className="text-center text-opacity-90 text-[14px] text-[#4F4F4F]">
                Enter the enchanted forest, where magical trees have been
                splitted into logs of wood with eternal spells. Play against the
                forest by retrieving magical woods. <br />
                <br /> You win when your wood had the shortest retrieval time.
                To play, predict the fastest wood (out of a pack of 6) and stake
                your SUI. If you win, you get 6 times your stake.
                <br />
                <br />
                Sign In to start playing.
              </div>
            </div>
            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-[64px] h-[64px] bg-[inherit] rounded-[10px] border-[1px] border-[#CCCCCC] hover:bg-gray-100"
            >
              <Image
                src="/assets/google.svg"
                alt="Google"
                width={32}
                height={32}
              />
            </Button>
          </div>
        </div>
        <div className="text-center text-white text-[12px]">
          Powered by{' '}
          <Link
            href="https://sui.io"
            target="_blank"
            rel="noopenner noreferrer"
            className="underline"
          >
            Sui
          </Link>
        </div>
      </div>
    </div>
  );
};
