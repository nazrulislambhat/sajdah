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
import SiteLogo from '../public/SalahSync.png';
import DefaultUser from '../public/DefaultUser.png';
export default function Footer() {
  return (
    <header className="boxed flex justify-start items-center py-4 w-[100%] xl:px-80 px-24 border-2 m-4 rounded-full border-PrimarySalahSync">
      <Image
        src={SiteLogo}
        alt="Site Logo"
        width={36}
        height={36}
        className="ring-offset-1 cursor-pointer ring-1 rounded-full ring-PrimarySalahSync ring-offset-PrimarySalahSync hover:ring-offset-PrimarySalahSync ease focus:outline-none"
      />
      <nav className="">
        <ul className="flex gap-4 xl:gap-8 px-2 xl:px-24">
          <li>
            <Link
              href="/quran"
              className="text-base header-menu--link font-semibold header-link text-PrimarySalahSync"
            >
              Quran
            </Link>
          </li>
          <li>
            <Link
              href="/hadith"
              className="text-base header-menu--link font-semibold header-link text-PrimarySalahSync"
            >
              Hadith
            </Link>
          </li>
          <li>
            <Link
              href="/tasbeeh"
              className="text-base header-menu--link font-semibold header-link text-PrimarySalahSync"
            >
              Tasbeeh
            </Link>
          </li>
          <li>
            <Link
              href="/nimaz"
              className="text-base header-menu--link font-semibold header-link text-PrimarySalahSync"
            >
              Nimaz
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
