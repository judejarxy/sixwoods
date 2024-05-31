import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useZkLogin } from '@mysten/enoki/react';
import { UserProfileMenu } from '../general/UserProfileMenu';
import { Balance } from '../general/Balance';

export const TopNavbar = () => {
  const { address } = useZkLogin();

  return (
    <div className="backdrop-blur-md md:backdrop-blur-none sticky top-0 flex w-full h-full bg-inherit p-5 space-x-2 md:space-x-4 justify-between items-center z-10">
      <Link href="/" className="flex items-center">
        <Image
          src="/assets/sixwoods.svg"
          alt="SixWoods"
          width={48}
          height={48}
          className="mr-2"
        />
        <span className="text-2xl font-bold text-white">SixWoods</span>
      </Link>
      <div className="flex flex-1 justify-end items-center space-x-1">
        {!!address && (
          <div className="flex space-x-2 items-center">
            <Balance />
            <UserProfileMenu />
          </div>
        )}
      </div>
    </div>
  );
};
