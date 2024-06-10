import { getNetworkName } from './getNetworkName';

interface GetSuiExplorerLinkProps {
  type: 'module' | 'object' | 'account';
  objectId: string;
  moduleName?: string;
}

export const getSuiExplorerLink = ({
  type,
  objectId,
  moduleName
}: GetSuiExplorerLinkProps) =>
  `https://suiscan.xyz/${getNetworkName()}/${
    type === 'module' ? 'object' : type
  }/${objectId}${type === 'module' ? `?module=${moduleName}` : ''}`;
