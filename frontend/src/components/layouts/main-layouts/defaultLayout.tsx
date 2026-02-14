import { LayoutProps } from '@/types/global';
import { Navbar } from '../navbarWraper';

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="footer">Standard Footer</footer>
    </>
  );
};

export default DefaultLayout;