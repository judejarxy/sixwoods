'use client';

import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

const AboutPage = () => {
  const router = useRouter();

  return (
    <>
      <h2 className="text-3xl sm:text-5xl font-medium mb-2 sm:mb-6">
        How It Works
      </h2>
      <ul className="pl-6 list-image-[url(/assets/arrow-right-white.svg)]  text-xl mb-4 sm:text-2xl">
        <li className="mb-2">At play, Forest presents you 6 woods.</li>
        <li className="mb-2">Predict and Choose any Wood.</li>
        <li className="mb-2">You stake 0.2 SUI to play.</li>
        <li className="mb-2">At play, if your wood is fastest, you win.</li>
        <li className="mb-2">If you win, you get 6 times your stake.</li>
      </ul>
      <Button
        onClick={() => router.push('/play')}
        svg="arrow-right-black"
        text="PLAY NOW"
      />
    </>
  );
};

export default AboutPage;
