import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from '@nextui-org/react';
import Image from 'next/image';
import SiteLogo from '../public/sajdah.png';
import DefaultUser from '../public/DefaultUser.png';
export default function Footer() {
  return (
    <header className="boxed flex justify-start items-center py-4 w-[100%] xl:px-80 px-24 border-2 m-4 rounded-full border-Primarysajdah">
      <Image
        src={SiteLogo}
        alt="Site Logo"
        width={36}
        height={36}
        className="ring-offset-1 cursor-pointer ring-1 rounded-full ring-Primarysajdah ring-offset-Primarysajdah hover:ring-offset-Primarysajdah ease focus:outline-none"
      />
      <nav className="">
        <ul className="flex gap-4 xl:gap-8 px-2 xl:px-24">
          <li>
            <Link
              href="/quran"
              className="text-base header-menu--link font-semibold header-link text-Primarysajdah"
            >
              Quran
            </Link>
          </li>
          <li>
            <Link
              href="/hadith"
              className="text-base header-menu--link font-semibold header-link text-Primarysajdah"
            >
              Hadith
            </Link>
          </li>
          <li>
            <Link
              href="/tasbeeh"
              className="text-base header-menu--link font-semibold header-link text-Primarysajdah"
            >
              Tasbeeh
            </Link>
          </li>
          <li>
            <Link
              href="/nimaz"
              className="text-base header-menu--link font-semibold header-link text-Primarysajdah"
            >
              Nimaz
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
