import Link from 'next/link';

export default function Footer() {
  return (
    <nav className="flex justify-center items-center flex-row  text-WhiteSalahSync">
      <ul className="flex gap-8">
        <li>
          <a href="/">About</a>
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
