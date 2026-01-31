import { Field, FieldDescription, FieldSet } from '@components/ui/NebulaUI';
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
        <FieldSet className={style.userSettingContainer}>
            <Field orientation={"horizontal"} className={style.header}>
                <Field>
                    <h1>{title}</h1>
                    <FieldDescription>{discription}</FieldDescription>
                </Field>
                
                {extraHeader}
            </Field>
            <div className={style.contentContainer}>
                {children}
            </div>
        </FieldSet>
    );
}

export default UserSettingContainer;