import Link from 'next/link';

export default function Footer() {
  return (
    <nav className="flex h-16 xl:h-48 justify-center items-center flex-col bg-PrimarySalahSync boxed text-WhiteSalahSync">
      <ul className="flex gap-8 text-xs">
        <li>
          <a href="/" className="underline-left-to-right">
            About
          </a>
        </li>
        <li>
          <a href="/" className="underline-left-to-right">
            Privacy
          </a>
        </li>
        <li>
          <a href="/" className="underline-left-to-right">
            Terms
          </a>
        </li>
        <li>
          <a href="/" className="underline-left-to-right">
            Contact
          </a>
        </li>
        <li>
          <a href="/" className="underline-left-to-right">
            Community
          </a>
        </li>
      </ul>
    </nav>
  );
}
