import { getSuiExplorerLink } from '@/helpers/getSuiExplorerLink';
import { formatAddress } from '@mysten/sui.js/utils';
import Image from 'next/image';
import Link from 'next/link';

interface SuiExplorerLinkProps {
  objectId: string;
  type: 'object' | 'account' | 'module';
  moduleName?: string;
  className?: string;
}

export const SuiExplorerLink = ({
  objectId,
  type,
  moduleName,
  className = ''
}: SuiExplorerLinkProps) => {
  return (
    <Link
      href={getSuiExplorerLink({ objectId, moduleName, type })}
      rel="noopenner noreferrer"
      target="_blank"
      className={`flex space-x-2 items-center text-gray-500 ${className}`}
    >
      <div>{formatAddress(objectId)}</div>
      <Image
        src="/assets/external-link-white.svg"
        alt="Open In New"
        width={16}
        height={16}
      />
    </Link>
  );
};
