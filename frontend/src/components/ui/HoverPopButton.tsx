// HoverPopButton.tsx
// An a href component that make 
// a circle pop effect on hover or based on text length

import React, { FC, ReactNode } from 'react';
import { NerdFonts } from '../utilities/NerdFonts';
import style from '../../styles/ui/HoverPopButton.module.scss';


// Props for HoverPopButton
interface HoverPopButtonProps {
  href: string;
  children: ReactNode;
  isIcon?: boolean;
  notificationCount?: number;
}



// HoverPopButton component
const HoverPopButton: FC<HoverPopButtonProps> = ({ href, children, isIcon, notificationCount }) => {
    isIcon = isIcon === undefined ? false : isIcon;
    
    return (
        <a href={href} className={style.hoverPopButton}>
            {notificationCount !== undefined && notificationCount > 0 ? (
                <span className={style.notificationBadge}>{notificationCount}</span>
            ) : null}
            {isIcon ? (<NerdFonts extraClass={style.icon + " icon"}>{children}</NerdFonts>) : children}
        </a>
    );
}

export { HoverPopButton };