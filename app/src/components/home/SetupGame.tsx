import React from "react";
import { CreateCounter } from "./CreateCounter";
import { RequestSUI } from "./RequestSUI";
import BigNumber from "bignumber.js";
import { Spinner } from "../general/Spinner";

interface SetupGameProps {
  balance: BigNumber;
  counterId: string | null;
  handleCreateCounter: () => void;
  isCreateCounterLoading: boolean;
  isLoading: boolean;
}

const BALANCE_LIMIT = BigNumber(0.5);

export const SetupGame = ({
  balance,
  counterId,
  handleCreateCounter,
  isCreateCounterLoading,
  isLoading,
}: SetupGameProps) => {
  const renderStep = () => {
    if (balance.isLessThan(BALANCE_LIMIT)) return <RequestSUI />;
    if (!counterId) {
      return (
        <CreateCounter
          handleCreateCounter={handleCreateCounter}
          isLoading={isCreateCounterLoading}
          counterId={counterId}
        />
      );
    }
    return isLoading ? <Spinner /> : <></>;
  };

  return (
    <div className="flex flex-col max-w-[480px] w-full mx-auto">
      {renderStep()}
    </div>
  );
};
