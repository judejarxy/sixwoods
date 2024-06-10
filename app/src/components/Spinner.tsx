import { Loader2 } from 'lucide-react';

export const Spinner = () => {
  return (
    <div className="mx-auto w-fit bg-white p-2 rounded-full">
      <Loader2 className="w-12 h-12 font-bold text-red-700 animate-spin" />
    </div>
  );
};
