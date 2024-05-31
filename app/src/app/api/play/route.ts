import { SuiClient } from '@mysten/sui.js/client';
import { bytesToHex } from '@noble/hashes/utils';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentGlobalCount } from '../helpers/getCurrentGlobalCount';
import { getBLSSecreyKey } from '../helpers/getBLSSecretKey';
import { bls12_381 } from '@noble/curves/bls12-381';
import { getCounterObject } from '../helpers/getCounterObject';

// Returns the signed hash by the forest for the player's wood index choice
export const POST = async (req: NextRequest) => {
  const { counterId, player_wood_index } = await req.json();
  if (!counterId) throw new Error('Invalid counterId');
  if (typeof player_wood_index != 'number') {
    throw new Error('Invalid player_wood_index');
  }

  const suiClient = new SuiClient({
    url: process.env.NEXT_PUBLIC_SUI_NETWORK!
  });

  const globalCount = await getCurrentGlobalCount(suiClient);
  const globalCountHex = bytesToHex(Uint8Array.from([globalCount]));
  const playerWoodIndexHex = bytesToHex(Uint8Array.from([player_wood_index]));
  const counter = await getCounterObject({ suiClient, counterId });
  counter
  const counterHex = bytesToHex(Uint8Array.from([counter as any]));

  return NextResponse.json(
    Array.from(
      bls12_381.sign(
        globalCountHex.concat(playerWoodIndexHex).concat(counterHex),
        getBLSSecreyKey(process.env.ADMIN_SECRET_KEY!)
      )
    )
  );
};
