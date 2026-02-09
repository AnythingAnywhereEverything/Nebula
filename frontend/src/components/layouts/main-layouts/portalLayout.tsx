import { LayoutProps } from 'src/types/global';
import { Navbar } from '../navbarWraper';
import { ThemeProvider } from 'next-themes';

import s from "@styles/sidebar.module.scss"

const PortalLayout: React.FC<LayoutProps> = ({ children, Sidebar }) => {
    return (
        <ThemeProvider themes={["light", "dark", "midnight"]} attribute={"data-theme"}>
            <Navbar type='portal' />
            <main className={s.sidebarProvider}>
                {Sidebar && <Sidebar/>}
                <div className={s.contentContain}>
                    {children}
                </div>
            </main>
        </ThemeProvider>
    );
};

export default PortalLayout;