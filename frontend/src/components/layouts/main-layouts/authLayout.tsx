import React, { FC } from 'react';
import { LayoutProps } from 'src/types/global'; // Import the type
import { Navbar } from '../navbarWraper';

const AuthLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
        <Navbar type="auth"/>
        <main>{children}</main>
        <footer className="footer">Standard Footer</footer>
    </>
  );
};

export default AuthLayout;