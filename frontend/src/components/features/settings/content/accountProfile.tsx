import { NebulaTextField } from "@components/ui/NebulaTextField";
import style from "@styles/layouts/usersetting.module.scss";
import Form from "next/form";

const AccountProfile: React.FC = () => {
    return (
        <Form action="#" className={style.profileForm}>
            <div className={style.section}>
                <div className={style.row}>
                    <label htmlFor="username" className={style.label}>
                        Username
                    </label>
                    <NebulaTextField name="username" id="username" placeholder="Username" />
                </div>

                <div className={style.row}>
                    <label htmlFor="displayname" className={style.label}>
                        Display Name
                    </label>
                    <NebulaTextField name="displayname" id="displayname" placeholder="Display Name" />
                </div>

                <div className={style.row}>
                    <span className={style.label}>Email</span>
                    <p className={style.readonly}>XY***************@gmail.com</p>
                </div>

                <div className={style.row}>
                    <span className={style.label}>Phone Number</span>
                    <p className={style.readonly}>*********89</p>
                </div>

                <div className={style.row}>
                    <span className={style.label}>Date of Birth</span>
                    <p className={style.readonly}>12/12/1990</p>
                </div>

                <button type="submit">Save</button>
            </div>
            <div className={style.imageContainer}>
                <label htmlFor="profile" className={style.profilePicture}>
                    <img src="https://placehold.co/400" alt='PlaceHolder'/>
                </label>
                <div className={style.selector}>
                    <input type="file" name="profile" id="profile" accept="image/png, image/jpeg" hidden/>
                    <label htmlFor="profile" className={style.imageinput}>Change Profile</label>
                    <p className={style.readonly}>File size: maximum 8 MB</p>
                    <p className={style.readonly}>File extension: .png, .jpeg</p>
                </div>
            </div>
        </Form>
    );
};

export default AccountProfile;
