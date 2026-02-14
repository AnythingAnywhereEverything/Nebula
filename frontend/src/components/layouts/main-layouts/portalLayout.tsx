import { LayoutProps } from '@/types/global';
import { Navbar } from '../navbarWraper';

import s from "@styles/sidebar.module.scss"

const PortalLayout: React.FC<LayoutProps> = ({ children, Sidebar }) => {
    return (
        <>
            <Navbar type='portal' />
            <main className={s.sidebarProvider}>
                {Sidebar && <Sidebar/>}
                <div className={s.contentContain}>
                    {children}
                </div>
            </main>
        </>
    );
};

export default PortalLayout;