import { updateDisplayName } from "@/api/user";
import { useUser } from "@/hooks/useUser";
import { useUserService } from "@/hooks/useUserService";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, Icon, Input, Separator } from "@components/ui/NebulaUI";
import style from "@styles/layouts/usersetting.module.scss";
import Form from "next/form";
import { useState } from "react";

const AccountProfile: React.FC = () => {

    const { data, isLoading } = useUser();

    const { updateDisplayName, updateUsername} = useUserService();

    const displayName = data?.display_name ?? "Guest";
    const username = data?.username ?? "ERROR";
    
    return (
    <Form action="#" className={style.profileForm}>
        <Field orientation={"horizontal"}>
            <FieldGroup className={style.profileContainer}>
                <Field orientation={"horizontal"} >
                    <Field orientation={"horizontal"}>
                        <FieldLegend variant="label" style={{margin:0}}>
                            Display Name:
                        </FieldLegend>
                        <FieldDescription>
                            {displayName}
                        </FieldDescription>
                    </Field>
                    <EditFieldDialog
                        title="Change Display Name"
                        description="You can only change your display name once a week"
                        defaultValue={displayName}
                        maxLength={20}
                        error={updateDisplayName.isError ? "Yes" : undefined}
                        onSave={updateDisplayName.mutateAsync}
                    />
                </Field>
                <Field orientation={"horizontal"} >
                    <Field orientation={"horizontal"}>
                        <FieldLegend variant="label" style={{margin:0}}>
                            Username:
                        </FieldLegend>
                        <FieldDescription>
                            {username}
                        </FieldDescription>
                    </Field>
                    <EditFieldDialog
                        title="Change Display Name"
                        description="You can only change your display name once a week"
                        defaultValue={username}
                        maxLength={20}
                        error={updateUsername.isError ? "This user is already exist" : undefined}
                        onSave={updateUsername.mutateAsync}
                    />
                </Field>

                <Field orientation={"horizontal"}>
                    <Field orientation={"horizontal"}>
                        <FieldLegend variant="label" style={{margin:0}}>
                            Email:
                        </FieldLegend>
                        <FieldDescription>
                            XY***************@gmail.com
                        </FieldDescription>
                    </Field>
                    <Button variant={"ghost"} size={"sm"}>
                        <Icon value="" />
                        Edit
                    </Button>
                </Field>
                <Field orientation={"horizontal"}>
                    <Field orientation={"horizontal"}>
                        <FieldLegend variant="label" style={{margin:0}}>
                            Phone Number:
                        </FieldLegend>
                        <FieldDescription>
                            ************89
                        </FieldDescription>
                    </Field>
                    <Button variant={"ghost"} size={"sm"}>
                        <Icon value="" />
                        Edit
                    </Button>
                </Field>
                <Field orientation={"horizontal"}>
                    <Field orientation={"horizontal"}>
                        <FieldLegend variant="label" style={{margin:0}}>
                            Date of Birth:
                        </FieldLegend>
                        <FieldDescription>
                            12/12/1990
                        </FieldDescription>
                    </Field>
                    <Button variant={"ghost"} size={"sm"}>
                        <Icon value="" />
                        Edit
                    </Button>
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

interface EditFieldDialogProps {
  title: string;
  description?: string;
  defaultValue?: string;
  maxLength?: number;
  error?: string | undefined;
  onSave: (value: string) => Promise<void>;
}

//NOTE: Move this if reuse
const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
  title,
  description,
  defaultValue = "",
  maxLength,
  onSave,
  error
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave(value);
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Icon value="" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <Field>
          <Input
            value={value}
            maxLength={maxLength}
            onChange={(e) => setValue(e.target.value)}
            aria-invalid = {error ? true : false}
          />
          {maxLength && (
            <DialogDescription>
              {value.length}/{maxLength}
            </DialogDescription>
          )}
          {error && (
            <FieldError>{error}</FieldError>
          )}
        </Field>

        <DialogFooter>
          <Button size="sm" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountProfile;
