import { LayoutProps } from '@/types/global';
import { Navbar } from '../navbarWraper';
import { ThemeProvider } from 'next-themes';

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider themes={["light", "dark", "midnight"]} attribute={"data-theme"}>
        <Navbar />
        <main>{children}</main>
        <footer className="footer">Standard Footer</footer>
    </ThemeProvider>
  );
};

export default DefaultLayout;