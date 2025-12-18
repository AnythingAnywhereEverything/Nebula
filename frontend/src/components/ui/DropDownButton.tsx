// HoverPopButton.tsx
// An a href component that make 
// a circle pop effect on hover or based on text length

import React, { FC, ReactNode } from 'react';
import { NerdFonts } from '../utilities/NerdFonts';
import style from '@styles/ui/HoverPopButton.module.scss';

interface DropDownBtn{
    children: ReactNode,
    minSize?: String,
    maxSize?: String,
    minHeight?: String,
    maxHeight?: String,
    buttonType?: String,
    isIcon?: boolean,
    notificationCount?: number,
}


// HoverPopButton component
const HoverPopButton: FC<DropDownBtn> = ({ children, isIcon, notificationCount }) => {
    isIcon = isIcon === undefined ? false : isIcon;
    
    return (
        <button className={style.hoverPopButton}>
            {notificationCount !== undefined && notificationCount > 0 ? (
                <span className={style.notificationBadge}>{notificationCount}</span>
            ) : null}
            {isIcon ? (<NerdFonts extraClass={style.icon + " icon"}>{children}</NerdFonts>) : children}
        </button>
    );
}

export { HoverPopButton };