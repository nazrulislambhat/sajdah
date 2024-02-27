import Link from 'next/link';

export default function Footer() {
  return (
    <nav className="flex h-48 justify-center items-center flex-row bg-PrimarySalahSync py-8 boxed text-WhiteSalahSync">
      <ul className="flex gap-8">
        <li>
          <a href="/" className="underline-left-to-right">
            About
          </a>
        </li>
        <li>
          <a href="/">Privacy</a>
        </li>
        <li>
          <a href="/">Terms</a>
        </li>
        <li>
          <a href="/">Contact</a>
        </li>
        <li>
          <a href="/">Community</a>
        </li>
      </ul>
    </nav>
  );
}
