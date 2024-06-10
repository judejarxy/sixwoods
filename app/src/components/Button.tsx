import { Loader2 } from 'lucide-react';
import Image from 'next/image';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  altText?: string;
  isLoading?: boolean;
  svg: string;
  text: string;
}

export const Button = ({
  isLoading = false,
  onClick,
  svg,
  text,
  altText = '',
  ...props
}: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className="w-fit p-2 pl-4 mb-4 sm:pl-6 sm:mb-12 rounded-full bg-red-700 flex disabled:bg-red-400"
    {...props}
  >
    <span className="mr-4 text-lg sm:text-xl">{text}</span>
    <div className="bg-white p-1.5 rounded-full">
      {isLoading ? (
        <Loader2 className="w-4 h-4 text-red-700 animate-spin" />
      ) : (
        <Image
          src={`/assets/${svg}.svg`}
          alt={altText}
          width={16}
          height={16}
        />
      )}
    </div>
  </button>
);
