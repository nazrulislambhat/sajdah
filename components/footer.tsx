import Link from 'next/link';

export default function Footer() {
  return (
    <nav className="flex h-16 xl:h-48 justify-center items-center flex-col bg-PrimarySalahSync boxed text-WhiteSalahSync">
      <ul className="flex gap-8 text-xs">
        <li>
          <Link href="/" className="underline-left-to-right">
            About
          </Link>
        </li>
        <li>
          <Link href="/" className="underline-left-to-right">
            Privacy
          </Link>
        </li>
        <li>
          <Link href="/" className="underline-left-to-right">
            Terms
          </Link>
        </li>
        <li>
          <Link href="/" className="underline-left-to-right">
            Contact
          </Link>
        </li>
        <li>
          <Link href="/" className="underline-left-to-right">
            Community
          </Link>
        </li>
      </ul>
    </nav>
  );
}
