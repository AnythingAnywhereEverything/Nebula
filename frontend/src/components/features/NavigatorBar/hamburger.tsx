// this file display a hamburger menu icon using nerd font

import React, { FC } from 'react';
import { NerdFonts } from '../../utilities/NerdFonts';
import style from '../../../styles/features/hamburger.module.scss';

// the menu after click here
const HamburgerMenu: FC = () => {
    return (
        <div className={style.hamburgerMenu}>
            <ul>
                <li><a href="/profile">Profile</a></li>
                <li><a href="/orders">Orders</a></li>
                <li><a href="/settings">Settings</a></li>
                <li><a href="/logout">Logout</a></li>
            </ul>
        </div>
    );
}


// Hamburger component
const Hamburger: FC = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

    // Implement menu for testing
    const menu = isOpen ? <HamburgerMenu /> : null;

    return (
        <button className={style.hamburgerButton} aria-label="Menu" onClick={toggleMenu}>
            {menu}
            <NerdFonts></NerdFonts>
        </button>
    );
}

export { Hamburger };