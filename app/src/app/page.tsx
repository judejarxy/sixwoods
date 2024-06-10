'use client';

import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  return (
    <>
      <div className="text-5xl sm:text-7xl mb-4 leading-snug sm:leading-tight sm:mb-8">
        Enter
        <br />
        the Enchanted
        <br /> Forest
      </div>
      <Button
        onClick={() => router.push('/play')}
        svg="arrow-right-black"
        text="PLAY NOW"
      />
    </>
  );
};

export default HomePage;
