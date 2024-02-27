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
    <header className="boxed">
      <Navbar className="header bg-LightSalahSync border-b-2 border-PrimarySalahSync">
        <NavbarBrand>
          <Image
            src={SiteLogo}
            alt="Site Logo"
            width={36}
            height={36}
            className="ring-offset-1 cursor-pointer ring-1 rounded-full ring-PrimarySalahSync ring-offset-PrimarySalahSync hover:ring-offset-PrimarySalahSync ease focus:outline-none"
          />
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="#">
              Quran
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Hadith
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              href="#"
              aria-current="page"
              className="text-PrimarySalahSync"
            >
              Tasbeeh
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Nimaz
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Community
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Image
                src={DefaultUser}
                alt="Site Logo"
                width={36}
                height={36}
                className="cursor-pointer"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">nazrul@salahsync.com</p>
              </DropdownItem>
              <DropdownItem key="settings">My Settings</DropdownItem>
              <DropdownItem key="team_settings">Team Settings</DropdownItem>
              <DropdownItem key="analytics">Analytics</DropdownItem>
              <DropdownItem key="system">System</DropdownItem>
              <DropdownItem key="configurations">Configurations</DropdownItem>
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </header>
  );
}
