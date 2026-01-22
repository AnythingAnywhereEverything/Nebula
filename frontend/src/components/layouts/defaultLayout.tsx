// components/layouts/DefaultLayout.tsx
import React, { FC } from 'react';
import { LayoutProps } from 'src/types/global'; // Import the type

import { Navbar } from './navbarWraper';

const DefaultLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
        <Navbar />
        <main>{children}</main>
        <footer className="footer">Standard Footer</footer>
    </>
  );
};

export default DefaultLayout;