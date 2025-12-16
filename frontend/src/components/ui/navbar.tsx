// navbar component
import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
        <div className="navbar-logo">
            <Link href="/">Nebula</Link>
        </div>
        <ul className="navbar-links">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
        </ul>
    </nav>
    );
}

export { Navbar };