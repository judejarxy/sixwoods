'use client';

import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  return (
    <>
      <h2 className="text-3xl sm:text-5xl font-medium mb-2 sm:mb-6">
        404 - Page Not Found
      </h2>
      <p className="text-lg max-w-sm sm:text-xl sm:max-w-lg mb-4 sm:mb-8">
        Looks like you&apos;ve hit an invalid page. No Worries. Enter the Enchanted Forest.
      </p>
      <Button
        onClick={() => router.push('/play')}
        svg="arrow-right-black"
        text="PLAY NOW"
      />
    </>
  );
};

export default NotFound;
