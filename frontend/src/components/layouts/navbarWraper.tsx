// navbar component
import React from 'react';
import NavDesktop from './navbars/navbarDesktop';
import NavAuth from './navbars/navbarLogin';

interface NavProps {
  type?: string;
}

const Navbar: React.FC<NavProps> = ({type}) => {
    if (type === "auth"){
        return (
            <NavAuth/>
        )
    }
    return (
        <NavDesktop/>
    );
}

export { Navbar };