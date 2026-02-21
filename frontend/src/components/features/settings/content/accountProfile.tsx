import { requestMailVerification } from "@/api/user";
import { useUser } from "@/hooks/useUser";
import { useUserService } from "@/hooks/useUserService";
import Avatar from "@components/ui/Nebula/avatar";
import { Button, ButtonGroup, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, Icon, Input, Separator } from "@components/ui/NebulaUI";
import style from "@styles/layouts/usersetting.module.scss";
import Form from "next/form";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";


function censorEmail(email: string) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return "Invalid Email";
  }

  const parts = email.split('@');
  const name = parts[0];
  const domain = parts[1];

  if (name.length <= 2) {
    return `${name}@${domain}`;
  }

  const visibleChars = name.slice(-2);
  const censoredPart = '*'.repeat(name.length - 2);

  return `${censoredPart}${visibleChars}@${domain}`;
}

const AccountProfile: React.FC = () => {

    const { data } = useUser();

    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState<string>("");
    const [isEmailRevealed, setIsEmailRevealed] = useState<boolean>(false);

    useEffect(() => {
        setEmail(censorEmail(data?.email ?? "Unknown"))
        setIsEmailRevealed(false)
    }, [data])

    const { updateDisplayName, updateUsername, updateProfilePicture } = useUserService();

    const displayName = data?.display_name ?? "Unknown";
    const username = data?.username ?? "Unknown";
    
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        if (file.size > 8 * 1024 * 1024) {
            setError("File too large. Maximum size is 8MB.");
            return;
        }

        if (!["image/png", "image/jpeg"].includes(file.type)) {
            setError("Only PNG and JPEG images are allowed.");
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        setPreview(objectUrl);
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!selectedFile) return;

        try {
            setLoading(true);
            await updateProfilePicture.mutateAsync(selectedFile);
            setSelectedFile(null);
        } catch (err: any) {
            setError(err?.message || "Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setPreview(null);
        setSelectedFile(null);
        setError(null);
    };

    const hasPendingChange = !!selectedFile;


    return (
    <FieldSet className={style.profileForm}>
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
                        title="Change Username"
                        description="You can only change your username name once a month"
                        defaultValue={username}
                        maxLength={20}
                        error={updateUsername.error?.message}
                        onSave={updateUsername.mutateAsync}
                    />
                </Field>

                <Field orientation={"horizontal"}>
                    <Field orientation={"horizontal"}>
                        <FieldLegend variant="label" style={{margin:0}}>
                            Email:
                        </FieldLegend>
                        <FieldDescription>
                            {isEmailRevealed ? email : censorEmail(email)}
                        </FieldDescription>
                        <Button variant={"ghost"} size={"xs"} onClick={
                            () => {
                                if (!isEmailRevealed){setEmail(data?.email ?? "Unknown");}
                                else{setEmail(censorEmail(data?.email ?? "Unknown"));}
                                setIsEmailRevealed(!isEmailRevealed)
                            }
                        }>
                            Reveal
                        </Button>
                    </Field>
                    <Button variant={"ghost"} size={"sm"} onClick={
                        () => {
                            requestMailVerification()
                        }
                    }>
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
                <FieldLabel htmlFor="profile">
                    <Avatar src={preview ?? data?.profile_picture_url} className={style.avatar} fill/>
                </FieldLabel>

                {!hasPendingChange && (
                    <Button variant="outline" size={"sm"} asChild>
                        <FieldLabel htmlFor="profile">
                            Change
                        </FieldLabel>
                    </Button>
                )}

                {hasPendingChange && (
                    <ButtonGroup>
                        <ButtonGroup>
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading ? "Saving..." : "Save"}
                            </Button>
                        </ButtonGroup>

                        <ButtonGroup>
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </ButtonGroup>
                )}

                {error && (
                    <FieldDescription className={style.error}>
                    {error}
                    </FieldDescription>
                )}

                <Input
                    type="file"
                    id="profile"
                    name="file"
                    accept="image/png, image/jpeg"
                    hidden
                    onChange={handleFileChange}
                />
            </FieldGroup>
        </Field>
        <Button variant={"oppose"} size={"sm"} style={{width:"calc(var(--spacing)*32)"}}>Save</Button>
    </FieldSet>
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
