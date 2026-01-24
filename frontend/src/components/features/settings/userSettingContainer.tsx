import style from '@styles/features/profile/usersettingcontainer.module.scss';
import { ReactNode } from 'react';

type UserSettingContainerProps = {
    children: ReactNode;
    title: string;
    discription: string;
    extraHeader?: ReactNode;
}

const UserSettingContainer: React.FC<UserSettingContainerProps> = ({
    children,
    title,
    discription,
    extraHeader
}) => {
    return (
        <div className={style.userSettingContainer}>
            <div className={style.header}>
                <div className={style.title}>
                    <h1>{title}</h1>
                    <p>{discription}</p>
                </div>
                
                {extraHeader}
            </div>
            <div className={style.contentContainer}>
                {children}
            </div>
        </div>
    );
}

export default UserSettingContainer;