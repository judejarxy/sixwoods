'use client';

import { Header } from '@/components/Header';
import { BalanceProvider } from '@/contexts/BalanceContext';
import { GameAudioProvider } from '@/contexts/GameAudioContext';
import { ChildrenProps } from '@/types/ChildrenProps';
import { EnokiFlowProvider } from '@mysten/enoki/react';
import { Chakra_Petch } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

const RootLayout = ({ children }: ChildrenProps) => (
  <html lang="en">
    <head>
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/assets/sixwoods.png"></link>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>SixWoods - Enter the Enchanted Forest</title>
    </head>
    <body className={chakraPetch.className}>
      <GameAudioProvider>
        <EnokiFlowProvider apiKey={process.env.NEXT_PUBLIC_ENOKI_API_KEY!}>
          <BalanceProvider>
            <main className="min-h-screen w-screen text-white relative pt-20 px-8 pb-8 flex flex-col">
              <video
                autoPlay
                muted
                loop
                poster="/assets/forest.jpg"
                id="forest"
                className="fixed bottom-0 right-0 min-w-full min-h-full  object-cover"
                style={{ zIndex: -1 }}
              >
                <source src="/assets/forest.mp4" type="video/mp4"></source>
              </video>
              <Header />
              <div className="flex-1 flex flex-col justify-center items-start w-full max-w-screen-lg mx-auto">
                {children}
              </div>
              <p className="text-right md:text-xl w-full max-w-screen-lg mx-auto">
                PREDICT&nbsp;.&nbsp;STAKE&nbsp;.&nbsp;WIN&nbsp;.&nbsp;
              </p>
              <Toaster
                position="bottom-center"
                toastOptions={{ duration: 5000 }}
              />
            </main>
          </BalanceProvider>
        </EnokiFlowProvider>
      </GameAudioProvider>
    </body>
  </html>
);

export default RootLayout;
