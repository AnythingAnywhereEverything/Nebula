import { Button, Field, FieldDescription, FieldGroup, FieldLabel, Icon } from "@components/ui/NebulaUI";
import React, {useEffect, useState} from "react";
import s from "@styles/features/profile/session.module.scss"
import { UAParser } from "ua-parser-js";
import { deleteSelectSession, getSessions, SessionResponse } from "@/api/user";
import { formatDateTime } from "@lib/utils";

interface session {
    id: string,
    created_at: string,
    agent: string
}
const UserSession:React.FC = () => {

    function GetUserSession() {
        const [data, setData] = useState<SessionResponse[]>([]);
        
        useEffect(() => {
            const fetchData = async () => {
                const sessions = await getSessions();
                setData(sessions);
            };

            fetchData();
        }, []);
        const informationLoader = (parser:string, date: string)=> {
            const converted = UAParser(parser);
            return (
            <>
                <FieldLabel>{`${converted.os}`}</FieldLabel>
                <FieldDescription>{`${converted.browser.name}`} | {`${formatDateTime(date)}`}</FieldDescription>
            </>
            )
        }
        
        return(
            <>
            {data.map((session) => (
                <Field key={session.id} className={s.sessionContainer} orientation={'horizontal'}>
                    <Field orientation={'horizontal'}>
                        <Icon style=
                        {{fontSize:"32px",
                        padding: "0 calc(var(--spacing)*2)"
                        }}>󰍹</Icon>
                        <Field>
                            {informationLoader(session.agent, session.created_at)}
                        </Field>
                    </Field>
                    <Button onClick={() => deleteSelectSession(session.id)} size={'sm'} variant={'destructive'}>Delete</Button>
                </Field>
            ))}
            </>
        )
    }
    
    return(
        <GetUserSession/>
    )
}

export default UserSession