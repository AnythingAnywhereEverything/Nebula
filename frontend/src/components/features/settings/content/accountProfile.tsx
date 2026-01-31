import { Button, Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, Input, Separator } from "@components/ui/NebulaUI";
import style from "@styles/layouts/usersetting.module.scss";
import Form from "next/form";

const AccountProfile: React.FC = () => {
    return (
    <Form action="#" className={style.profileForm}>
        <Field orientation={"horizontal"}>
            <FieldGroup className={style.profileContainer}>
                <Field>
                    <FieldLabel htmlFor="username">
                        Username
                    </FieldLabel>
                    <Input name="username" id="username" placeholder="Username" />
                </Field>
                <Field>
                    <FieldLabel htmlFor="display_name">
                        Display Name
                    </FieldLabel>
                    <Input name="display_name" id="display_name" placeholder="Display Name" />
                </Field>

                <Field>
                    <FieldLabel>
                        Email
                    </FieldLabel>
                    <FieldDescription>
                        XY***************@gmail.com
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel>
                        Phone Number
                    </FieldLabel>
                    <FieldDescription>
                        *********89
                    </FieldDescription>
                </Field>
                <Field>
                    <FieldLabel>
                        Date of Birth
                    </FieldLabel>
                    <FieldDescription>
                        12/12/1990
                    </FieldDescription>
                </Field>
            </FieldGroup>
            <Separator orientation="vertical" />
            <FieldGroup className={style.avatarContainer}>
                <FieldLabel htmlFor="profile" className={style.avatar}>
                    <img src="https://placehold.co/400" alt='PlaceHolder'/>
                </FieldLabel>
                <Button variant={"outline"} asChild>
                    <FieldLabel htmlFor="profile">
                        Upload
                    </FieldLabel>
                </Button>
                <FieldDescription>
                    File size: maximum 8 MB
                </FieldDescription>
                <FieldDescription>
                    File extension: .png, .jpeg
                </FieldDescription>
                <Input type="file" id="profile" name="profile" hidden/>
            </FieldGroup>
        </Field>
        <Button variant={"oppose"} size={"sm"} style={{width:"calc(var(--spacing)*32)"}}>Save</Button>
    </Form>
    );
};

export default AccountProfile;
