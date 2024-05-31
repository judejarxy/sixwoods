import React from 'react';
import Link from 'next/link';

const RulesPage = () => {
  return (
    <div className="p-4 max-w-[480px] mx-auto">
      <div className="bg-white bg-opacity-90 p-[50px] rounded-[24px] items-center space-y-[20px] flex flex-col">
        <div className="text-2xl text-primary font-bold">Rules</div>
        <div className="flex flex-col space-y-[10px] text-black text-opacity-80 text-sm">
          <div>
            SixWoods presents you with six different logs of woods to play.
          </div>
          <div>
            Choose anyone and click play. The game will randomly generate worm
            levels for each wood.
          </div>
          <div>
            If your chosen wood has the least retrieval time (was the fastest to be fetched), you win, and you go
            with six times your stake.
          </div>
          <div>Otherwise, you simply lose your stake and can play again.</div>
        </div>
        <Link
          href="/"
          className="text-sm rounded-full px-12 py-3 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Play
        </Link>
      </div>
    </div>
  );
};

export default RulesPage;
