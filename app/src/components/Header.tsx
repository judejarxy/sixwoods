import { UserProfileMenu } from '@/components/UserProfileMenu';
import { useGameAudio } from '@/contexts/GameAudioContext';
import { useZkLogin } from '@mysten/enoki/react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Header = () => {
  const { isPlaying, toggleAudio } = useGameAudio();
  const router = useRouter();
  const pathname = usePathname();
  const { address } = useZkLogin();

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('header')!;
      const headerHeight = header.clientHeight;
      const scrolledHeight = window.scrollY;
      if (scrolledHeight > headerHeight) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }, []);

  return (
    <header className="fixed h-fit top-0 left-0 right-0 px-8 bg-inherit py-4  z-10">
      <div className="w-full max-w-screen-lg mx-auto flex items-center">
        <Link href="/" className="text-2xl font-bold grow">
          SIXWOODS
        </Link>

        <nav className="hidden sm:flex justify-end items-center  space-x-4 md:space-x-8 md:text-xl">
          <Link
            href="/"
            className={`link ${pathname === '/' ? 'underline' : ''}`}
          >
            HOME
          </Link>
          <Link
            href="/about"
            className={`link ${pathname === '/about' ? 'underline' : ''}`}
          >
            ABOUT
          </Link>
          <Link
            href="/play"
            className={`link ${pathname === '/play' ? 'underline' : ''}`}
          >
            PLAY
          </Link>

          {!!address && <UserProfileMenu />}
        </nav>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button aria-label="Menu" className="sm:hidden">
              <Image
                src="/assets/layers-white.svg"
                alt="Menu"
                width={24}
                height={24}
              />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="text-white border rounded p-4 mr-8 backdrop-blur-lg sm:hidden cursor-pointer"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className="text-xl mb-4"
                role="link"
                onSelect={() => router.push('/')}
              >
                HOME
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="text-xl mb-4"
                role="link"
                onSelect={() => router.push('/about')}
              >
                ABOUT
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className={`text-xl ${address ? ' mb-4' : ''}`}
                role="link"
                onSelect={() => router.push('/play')}
              >
                PLAY
              </DropdownMenu.Item>

              {!!address && (
                <DropdownMenu.Item className="text-xl" role="menu">
                  <UserProfileMenu />
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <button
          className="ml-4 md:ml-8"
          aria-label={`${isPlaying ? 'Pause' : 'Play'} Audio`}
          onClick={toggleAudio}
        >
          <Image
            src={`/assets/audio-${isPlaying ? 'muted' : 'playing'}.svg`}
            alt={`${isPlaying ? 'Pause' : 'Play'} Audio`}
            width={24}
            height={24}
          />
        </button>
      </div>
    </header>
  );
};
