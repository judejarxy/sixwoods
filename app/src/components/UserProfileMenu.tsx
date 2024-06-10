import { useBalance } from '@/contexts/BalanceContext';
import { formatSUIAmount } from '@/helpers/formatSUIAmount';
import { formatString } from '@/helpers/formatString';
import { getSuiExplorerLink } from '@/helpers/getSuiExplorerLink';
import { useRequestSui } from '@/hooks/useRequestSui';
import {
  useEnokiFlow,
  useZkLogin,
  useZkLoginSession
} from '@mysten/enoki/react';
import { formatAddress } from '@mysten/sui.js/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { jwtDecode } from 'jwt-decode';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react';
import toast from 'react-hot-toast';

export const UserProfileMenu = () => {
  const { address } = useZkLogin();
  const enokiFlow = useEnokiFlow();
  const zkLoginSession = useZkLoginSession();
  const { balance } = useBalance();
  const { handleRequestSui, isLoading: isRequestingSui } = useRequestSui();

  const decodedJWT = useMemo(() => {
    if (!zkLoginSession?.jwt) return null;
    const decoded: any = jwtDecode(zkLoginSession?.jwt!);
    return decoded;
  }, [zkLoginSession?.jwt]);

  const handleCopyAddress = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address!);
    toast.success('Address copied to clipboard');
  };

  if (!address) return null;
  return (
    <DropdownMenu.Root>
      {!!decodedJWT?.picture && (
        <DropdownMenu.Trigger asChild>
          <button>
            <span className="sm:hidden">ACCOUNT</span>
            <Image
              src={decodedJWT?.picture}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full hidden sm:block"
            />
          </button>
        </DropdownMenu.Trigger>
      )}

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-60 p-4 border mr-8 text-white rounded backdrop-blur-lg"
          sideOffset={20}
        >
          <DropdownMenu.Label className="mb-4 flex">
            <Image
              src={decodedJWT?.picture}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full mr-2 sm:hidden"
            />
            <div className="flex-1">
              <div className="font-medium">
                {decodedJWT?.given_name} {decodedJWT?.family_name}
              </div>
              <div className="text-xs">
                {decodedJWT?.email ? formatString(decodedJWT?.email, 25) : ''}
              </div>
            </div>
          </DropdownMenu.Label>

          <DropdownMenu.Separator className="h-px bg-white mb-4 opacity-30" />

          <DropdownMenu.Item className="flex items-center justify-between w-full mb-2">
            <p
              className="flex-1 mr-2 hover:underline flex"
              title="View on Explorer"
            >
              <Link
                className="mr-2"
                href={getSuiExplorerLink({
                  type: 'account',
                  objectId: address
                })}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>{formatAddress(address)}</div>
              </Link>
              <Image
                src="/assets/external-link-white.svg"
                alt=""
                width={16}
                height={16}
              />
            </p>
            <button onClick={handleCopyAddress}>
              <Image
                src="/assets/copy-white.svg"
                alt="Copy Address"
                title="Copy Address"
                width={16}
                height={16}
              />
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex items-center justify-between w-full mb-2">
            <div
              className="flex space-x-2 items-center bg-[inherit]"
              title="Balance"
            >
              <Image src="/assets/sui.svg" alt="plus" width={10} height={16} />
              <p>{formatSUIAmount(balance)} SUI</p>
            </div>
            <button
              onClick={handleRequestSui}
              disabled={isRequestingSui}
              title="GET SUI"
            >
              {isRequestingSui ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Image
                  src="/assets/plus-white.svg"
                  alt="GET SUI"
                  width={16}
                  height={16}
                />
              )}
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => enokiFlow.logout()}
            className="flex items-center justify-between w-full cursor-pointer hover:bg-red-700"
            title="Log Out"
          >
            <div>Log Out</div>
            <Image
              src="/assets/exit-white.svg"
              alt="Log Out"
              width={16}
              height={16}
            />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
