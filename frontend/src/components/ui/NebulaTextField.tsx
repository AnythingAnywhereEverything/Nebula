import { NerdFonts } from "@components/utilities/NerdFonts";
import React, { FC, ReactNode, useRef, useState } from "react";

type BaseProps = {
    btnValues?: ReactNode;
    type?: "text" | "number" | "email";
    className?: string;
    id: string;
    require?: boolean;
    placeholder?: string;

    value?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
};


type NumberProps = BaseProps & {
    type: "number";
    min?: number;
    max?: number;
};

type TextProps = BaseProps & {
    type?: "text";
    minlength?: number;
    maxlength?: number;
    sensitiveInfo?: boolean;
};

type EmailProps = BaseProps & {
    type: "email";
    minlength?: number;
    maxlength?: number;
};

type NebulaTextFieldProps = TextProps | NumberProps | EmailProps;

export const NebulaTextField: FC<NebulaTextFieldProps> = (props) => {
    const {
        id,
        type = "text",
        className,
        placeholder,
        require,
        btnValues,
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const [reveal, setReveal] = useState(false);

    const isSensitive =
        type === "text" &&
        "sensitiveInfo" in props &&
        props.sensitiveInfo;

    const inputType =
        isSensitive && !reveal ? "password" : type;

    return (
        <div className={className}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                    ref={inputRef}
                    id={id}
                    type={inputType}
                    placeholder={placeholder}
                    required={require}
                    min={"min" in props ? props.min : undefined}
                    max={"max" in props ? props.max : undefined}
                    minLength={"minlength" in props ? props.minlength : undefined}
                    maxLength={"maxlength" in props ? props.maxlength : undefined}
                />

                {isSensitive && (
                    <button
                        type="button"
                        onClick={() => setReveal((v) => !v)}
                    >
                        {reveal ? <NerdFonts></NerdFonts> : <NerdFonts></NerdFonts>}
                    </button>
                )}

                {btnValues && <div>{btnValues}</div>}
            </div>
        </div>
    );
};
