import { Button, Field, FieldDescription, FieldGroup, FieldLabel, Icon } from "@components/ui/NebulaUI";
import React, {useEffect, useState} from "react";
import s from "@styles/features/profile/session.module.scss"
import { UAParser } from "ua-parser-js";
import { deleteSelectSession, getSessions, SessionResponse } from "@/api/user";
import { formatDateTime } from "@lib/utils";

const UserSession: React.FC = () => {

    const [data, setData] = useState<SessionResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const sessions = await getSessions();
            setData(sessions);
        };

        fetchData();
    }, []);

    const deleteSessionLocal = async (id: string) => {
        await deleteSelectSession(id);

        setData(prev => prev.filter(session => session.id !== id));
        // * remove the deleted session locally without refetch
    };

    const informationLoader = (parser: string, date: string) => {
        const converted = UAParser(parser);

        return (
            <>
                <FieldLabel>{`${converted.os}`}</FieldLabel>
                <FieldDescription>
                    {`${converted.browser.name}`} | {`${formatDateTime(date)}`}
                </FieldDescription>
            </>
        );
    };

    return (
        <FieldGroup>
            {data.map((session) => (
                <Field key={session.id} className={s.sessionContainer} orientation={'horizontal'}>
                    <Field orientation={'horizontal'}>
                        <Icon
                            style={{
                                fontSize: "32px",
                                padding: "0 calc(var(--spacing)*2)"
                            }}
                        >
                            󰍹
                        </Icon>

                        <Field>
                            {informationLoader(session.agent, session.created_at)}
                        </Field>
                    </Field>

                    <Button
                        onClick={() => deleteSessionLocal(session.id)}
                        size={'sm'}
                        variant={'destructive'}
                    >
                        Delete
                    </Button>
                </Field>
            ))}
        </FieldGroup>
    );
};export default UserSession