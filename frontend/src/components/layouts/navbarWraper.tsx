// navbar component
import React from 'react';
import NavDesktop from './navbars/navbarDesktop';

interface UserLocation {
  city: string;
  country_name: string;
}

const Navbar: React.FC = () => {
    return (
        <nav>
            <NavDesktop/>
        </nav>
    );
}

export { Navbar };