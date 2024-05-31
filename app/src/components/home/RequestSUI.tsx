import React from 'react';
import { LoadingButton } from '../general/LoadingButton';
import Image from 'next/image';
import { useRequestSui } from '@/hooks/useRequestSui';

export const RequestSUI = () => {
  const { handleRequestSui, isLoading } = useRequestSui();

  return (
    <div className="p-4 max-w-[480px] mx-auto">
      <div className="bg-white bg-opacity-90 flex flex-col p-[50px] w-full rounded-[24px] items-center space-y-[50px]">
        <div className="text-[25px] text-primary font-semibold">
          First time here?
        </div>
        {/* TODO: Consider display image here */}
        {/* <Image
        src="/assets/welcome.svg"
        alt=""
      /> */}
        <div className="text-sm text-center text-[#4F4F4F]">
          Looks like your Testnet SUI balance is less than 1 SUI. You need some
          Testnet SUI to play. Request some below. Its free.
        </div>
        <LoadingButton
          onClick={handleRequestSui}
          isLoading={isLoading}
          className="!px-[14px] !py-[14px] h-14 md:h-9 rounded-full flex items-center space-x-2"
          spinnerClassName="text-white !w-5 !h-5 mr-2"
        >
          <Image src="/assets/plus.svg" alt="plus" width={20} height={20} />
          <div>Request Testnet SUI Tokens</div>
        </LoadingButton>
      </div>
    </div>
  );
};
