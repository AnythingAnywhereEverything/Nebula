import NebulaSettingListItem from '@components/ui/NebulaSettingListOption';
import { Button, Field, FieldDescription, FieldLegend, Icon } from '@components/ui/NebulaUI';
import style from '@styles/features/profile/usersettingoption.module.scss';
import Link from 'next/link';

const UserSettingsOptions: React.FC = () => {
    return (
        <div className={style.userSettingsOptionsContainer}>
            <Button variant={"ghost"} asChild className={style.profile}>
                <Link href={"/user/account/profile"}>
                    <div className={style.profilePicture}>
                        <img src="https://placehold.co/400x800" alt='PlaceHolder'/>
                    </div>

                    <Field className={style.profileName}>
                        <FieldLegend style={{textAlign: "start"}}>Username</FieldLegend>
                        <FieldDescription><Icon> </Icon>Edit Profile</FieldDescription>
                    </Field>
                </Link>
            </Button>

            <div className={style.linkContainer}>
                <NebulaSettingListItem
                    title = {(
                        <p>Account</p>
                    )}
                    main_link="/account/profile"
                    sub_lists={[
                        {title:"Profile", link:"/account/profile"},
                        {title:"Banks & Cards", link:"/account/payment"},
                        {title:"Address", link:"/account/address"},
                        {title:"Change Password", link:"/account/password"},
                        {title:"Privacy Settings", link:"/account/privacy"},
                        {title:"Notification", link:"/account/notification"},
                    ]}
                />

                <NebulaSettingListItem
                    title = {(
                        <p>My Purchaes</p>
                    )}
                    main_link="/purchaes"
                />
                
                <NebulaSettingListItem
                    title = {(
                        <p>Notifications</p>
                    )}
                    main_link="/notification/order"
                    sub_lists={[
                        {title:"Order Updates", link:"/notification/order"},
                        {title:"Promotions", link:"/notification/promotion"},
                        {title:"Finance Updates", link:"/notification/finance"},
                        {title:"Nebula Updates", link:"/notification/nebula"},
                    ]}
                />
            </div>
        </div>
    );
}

export default UserSettingsOptions;