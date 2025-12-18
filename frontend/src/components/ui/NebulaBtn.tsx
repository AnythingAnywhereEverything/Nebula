import React, { FC, ReactNode, useRef, useState } from 'react';
import { useOutsideClick } from '@components/utilities/OutsideClick';
import { NerdFonts } from '@components/utilities/NerdFonts';

type BaseProps = {
    btnValues: ReactNode;
    btnComponent?: ReactNode;
    componentClassName?: string;
    className?: string;
    isIcon?: boolean;
    notificationCount?: number;
};

type LinkProps = BaseProps & {
    href: string;
    onClick?: never;
};

type ButtonProps = BaseProps & {
    href?: never;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

type NebulaBtnProps = LinkProps | ButtonProps;

function useCoarsePointer() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches;
}

export const NebulaButton: FC<NebulaBtnProps> = (props) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isCoarse = useCoarsePointer();
    const [open, setOpen] = useState(false);

    const hasDropdown = Boolean(props.btnComponent);
    const isIcon = props.isIcon ? true : false
    const nCount = props.notificationCount ? props.notificationCount : 0;

    useOutsideClick(wrapperRef as React.RefObject<HTMLElement>, () => {
        if (open) setOpen(false);
    });

    if ('href' in props) {
        return (
            <div
            ref={wrapperRef}
            className="relative inline-block"
            onMouseEnter={() => !isCoarse && hasDropdown && setOpen(true)}
            onMouseLeave={() => !isCoarse && hasDropdown && setOpen(false)}
            >
            <a
                href={props.href}
                className={props.className}
                onClick={(e) => {
                if (!isCoarse || !hasDropdown) return;

                if (!open) {
                    e.preventDefault();
                    setOpen(true);
                }
                }}
            >
                {isIcon ? (
                <NerdFonts>{props.btnValues}</NerdFonts>
                ) : (
                props.btnValues
                )}
                {nCount > 1 && <span>{nCount}</span>}
            </a>

            {hasDropdown && open && (
                <div className={props.componentClassName}>
                {props.btnComponent}
                </div>
            )}
            </div>
        );
    }


    return (
    <div ref={wrapperRef} className="relative inline-block">
        <button
        className={props.className}
        onClick={(e) => {
            props.onClick(e);
            if (props.btnComponent) {
            setOpen((v) => !v);
            }
        }}
        >
        {props.btnValues}
        </button>

        {props.btnComponent && open && (
        <div className={props.componentClassName}>
            {props.btnComponent}
        </div>
        )}
    </div>
    );

};
