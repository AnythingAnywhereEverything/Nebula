import React from 'react';
import Link from 'next/link';
import style from '@styles/layouts/navbarDesktop.module.scss';
import { Hamburger } from '@components/features/navigatorBar/hamburger';
import { NerdFonts } from '@components/utilities/NerdFonts';
import ActionWraper from '@components/features/navigatorBar/actionWraper';
import SearchBar from '@components/features/navigatorBar/searchBar';

const NavDesktop: React.FC = () => {
    return (
    <nav className={style.navbar}>
        <div className={style.navTop}>
            <div className={style.navLogo}>
                <Hamburger></Hamburger>
                {/* Logo here later */}
                <Link href="/">Nebula</Link>
            </div>

            <SearchBar/>
            <ActionWraper/>
        </div>
        <div className={style.navBottom}>
            <ul className="navbar-promotions">
                <li><Link href="/features/gifts">Gifts</Link></li>
                <li><Link href="/market/bestsellers">Best Sellers</Link></li>
                <li><Link href="/deals">Today Deals</Link></li>
                <li><Link href="/giftcards">Gift Cards</Link></li>
            </ul>
        </div>
    </nav>
    )
}

export default NavDesktop;