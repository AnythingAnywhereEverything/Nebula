import React, { ReactNode } from 'react';
import style from '@styles/features/profile/usersettingoption.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NebulaSettingListItemProps = {
    title: ReactNode;
    main_link: string;
    sub_lists?: {
        title: ReactNode;
        link: string;
    }[];
}

const NebulaSettingListItem: React.FC<NebulaSettingListItemProps> = ({ title, main_link, sub_lists }) => {
    const pathname = usePathname(); // current path
    const mainPath = `/user${main_link}`;
    console.log(pathname)

    // check if any sublink is active
    const activeSubLink = sub_lists?.find(sub => pathname === `/user${sub.link}`);

    const dropdownClass = [
        style.settingDropDown,
        !sub_lists && pathname === mainPath ? style.active : ''
    ].join(' ');

    return (
        <div className={style.settingOptionItem}>
            <Link href={mainPath} className={dropdownClass}>
                {title}
            </Link>

            {sub_lists && (
                <div className={`${style.sublinkContainer} ${activeSubLink && style.dropdownActive}`}>
                    {sub_lists.map((item) => {
                        const isActive = pathname === `/user${item.link}`;
                        return (
                            <Link
                                key={item.link}
                                href={`/user${item.link}`}
                                className={isActive ? style.active : ''}
                            >
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default NebulaSettingListItem;
