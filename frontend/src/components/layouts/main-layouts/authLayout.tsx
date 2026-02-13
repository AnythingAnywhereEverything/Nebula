import React, { FC } from 'react';
import { LayoutProps } from '@/types/global';
import { Navbar } from '../navbarWraper';
import { ThemeProvider } from 'next-themes';

const AuthLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider themes={["light", "dark", "midnight"]} attribute={"data-theme"}>
        <Navbar type="auth"/>
        <main>{children}</main>
        <footer className="footer">Standard Footer</footer>
    </ThemeProvider>
  );
};

export default AuthLayout;