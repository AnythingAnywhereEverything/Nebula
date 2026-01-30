import React, { FC, ReactNode, useRef, useState } from 'react';
import { Icon } from '@components/ui/NebulaUI';
import nb from '@styles/ui/nebulaButton.module.scss'
import Link from 'next/link';

type BaseProps = {
    btnValues: ReactNode;
    btnComponent?: ReactNode;
    componentClassName?: string;
    className?: string;
    isIcon?: boolean;
    relative?: boolean;
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

    const closeTimeout = useRef<number | undefined>(undefined);

    if ('href' in props) {
        return (
            <div
            ref={wrapperRef}
            className={props.relative ? nb.containRelativeComponent : ""}
            onMouseLeave={() => {
            if (!isCoarse && hasDropdown) {
                closeTimeout.current = window.setTimeout(() => setOpen(false), 150);
            }
            }}

            onMouseEnter={() => {
            if (!isCoarse && hasDropdown) {
                clearTimeout(closeTimeout.current);
                setOpen(true);
            }
            }}
            >
            <Link
                href={props.href || "#"}
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
                <Icon>{props.btnValues}</Icon>
                ) : (
                props.btnValues
                )}
                {nCount > 1 && <span id={nb.notificationBadge}>{nCount}</span>}
            </Link>

            {hasDropdown && open && (
                <div className={props.componentClassName}>
                    {props.btnComponent}
                </div>
            )}
            </div>
        );
    }


    return (
    <div ref={wrapperRef} className={props.relative ? nb.containRelativeComponent : ""}>
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

