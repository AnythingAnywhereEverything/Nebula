import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldGroup,
    FieldLabel,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@components/ui/NebulaUI";
import { CardBadge } from "@lib/getCardBadge";
import valid from "card-validator";
import Form from "next/form";

const SUPPORTED_CARD_TYPES = ["visa", "mastercard"] as const;

type CardState = {
    number: string;
    expiry: string;
    expDate: {
        month: string,
        year: string
    } | null
    cvc: string;
    name: string;
    cardType: string | null;
    gaps: number[] | null;
    code: {name:string, size:number} | null
};

const AddPaymentMethod: React.FC = () => {
    const [card, setCard] = useState<CardState>({
        number: "",
        expiry: "",
        cvc: "",
        name: "",
        cardType: null,
        gaps: null,
        code: null,
        expDate: null
    });

    const [cardValid, setValid] = useState<{valid: boolean, potential:boolean}>({
        potential: true,
        valid: false,
    })
    
    const [expValid, setExpValid] = useState<{valid: boolean, potential:boolean}>({
        potential: true,
        valid: false,
    })
    

    const [errors, setErrors] = useState<Record<string, string>>({});

    /* ----------------------------- helpers ----------------------------- */

    const formatCardNumber = (value: string): string => {
        const cleanedValue = value.replace(/\D/g, "");

        if (!card.gaps || card.gaps.length === 0) {
            return cleanedValue
                .replace(/(.{4})/g, "$1 ")
                .trim();
        }

        let formattedValue = "";
        let lastIndex = 0;

        for (let i = 0; i < card.gaps.length; i++) {
            const gap = card.gaps[i];

            if (gap > cleanedValue.length) {
                formattedValue += cleanedValue.substring(lastIndex);
                lastIndex = cleanedValue.length;
                break;
            }

            formattedValue += cleanedValue.substring(lastIndex, gap);

            if (gap < cleanedValue.length) {
                formattedValue += " ";
            }

            lastIndex = gap;
        }

        if (lastIndex < cleanedValue.length) {
            formattedValue += cleanedValue.substring(lastIndex);
        }
        return formattedValue.trim();
    };


    const handleCardNumberChange = (value: string) => {
        const digits = value.replace(/\D/g, "");
        const cardValidation = valid.number(digits);
        const detectedType = cardValidation.card?.type ?? null;

        const gaps = cardValidation.card?.gaps;

        const isPotentiallyValid = cardValidation.isPotentiallyValid
        const isValid = cardValidation.isValid

        if (!SUPPORTED_CARD_TYPES.includes(detectedType as any) && detectedType != null ){
            setValid({
                potential: false,
                valid: false
            })
        } else {
            setValid({
                potential: isPotentiallyValid,
                valid: isValid
            })
        }

        setCard(prev => ({
            ...prev,
            number: digits,
            cardType: detectedType,
            gaps:gaps ?? [],
            code: cardValidation.card?.code ?? null,
        }));
    };

    const handleExpiryChange = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);

        let month = "";
        let year = "";

        if (digits.length === 0) {
            setCard(prev => ({ ...prev, expiry: "" }));
            return;
        }

        if (digits.length === 1) {
            const d = digits[0];

            if (d > "1") {
                month = `0${d}`;
            } else {
                month = d;
            }
        }

        if (digits.length >= 2) {
            const m = digits.slice(0, 2);
            const mNum = Number(m);

            if (mNum >= 1 && mNum <= 12) {
                month = m;
                year = digits.slice(2);
            } else {
                month = month.length < 2 ? `0${digits[0]}` : digits[0];
                year = digits.slice(1);
            }
            if (month === "00") {
                return;
            }
        }

        let formatted = month;

        if (year.length >= 1) {
            formatted += " / ";
        }

        if (year) {
            formatted += year.slice(0, 2);
        }

        const validExp = valid.expirationDate(formatted)
        setExpValid({
            valid: validExp.isValid,
            potential: validExp.isPotentiallyValid
        })

        setCard(prev => ({
            ...prev,
            expiry: formatted,
        }));
    };


    const validateForm = (): boolean => {
        const nextErrors: Record<string, string> = {};

        const numberValidation = valid.number(card.number);
        const detectedType = numberValidation.card?.type ?? null;

        if (!numberValidation.isValid) {
            nextErrors.number = "Invalid card number";
        }

        if (!detectedType || !SUPPORTED_CARD_TYPES.includes(detectedType as any)) {
            nextErrors.number =
                "Only Visa and Mastercard are supported";
        }

        const expiryValidation = valid.expirationDate(card.expiry);
        if (!expiryValidation.isValid) {
            nextErrors.expiry = "Invalid expiration date";
        }

        const cvcValidation = valid.cvv(
            card.cvc,
            numberValidation.card?.code.size
        );
        if (!cvcValidation.isValid) {
            nextErrors.cvc = "Invalid CVC";
        }

        if (!card.name.trim()) {
            nextErrors.name = "Name is required";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const payload = {
            cardType: card.cardType,
            last4: card.number.slice(-4),
            expiry: card.expiry,
            name: card.name,
        };

        console.log("Ready to send to backend:", payload);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add payment method</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new payment method</DialogTitle>
                </DialogHeader>

                <Form action={"#"} onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <Field orientation={"horizontal"}>
                                <FieldLabel>Card Number</FieldLabel>
                                <CardBadge cardType={"mastercard"} scale={1.2}/>
                                <CardBadge cardType={"visa"} scale={1.2} />
                            </Field>

                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <CardBadge
                                        cardType={card.cardType ?? "Unknown"}
                                    />
                                </InputGroupAddon>

                                <InputGroupInput
                                    aria-invalid={!cardValid.potential && !cardValid.valid}
                                    type="tel"
                                    placeholder="Card Number"
                                    value={formatCardNumber(card.number)}
                                    onChange={(e) =>
                                        handleCardNumberChange(e.target.value)
                                    }
                                    required
                                />
                            </InputGroup>

                            {errors.number && (
                                <span>{errors.number}</span>
                            )}
                        </Field>

                        <Field orientation="horizontal">
                            <Field>
                                <FieldLabel>Expiration Date</FieldLabel>
                                <Input
                                    aria-invalid={!expValid.potential && !expValid.valid}
                                    placeholder="MM / YY"
                                    value={card.expiry}
                                    onChange={(e) =>
                                        handleExpiryChange(e.target.value)
                                    }
                                    maxLength={7}
                                    required
                                />
                                {errors.expiry && (
                                    <span>{errors.expiry}</span>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>{card.code?.name ?? "CVC"}</FieldLabel>
                                <Input
                                    aria-invalid={
                                        !valid.cvv(card.cvc, card.code?.size).isPotentiallyValid &&
                                        !valid.cvv(card.cvc, card.code?.size).isValid
                                    }
                                    value={card.cvc}
                                    onChange={(e) =>
                                        setCard(prev => ({
                                            ...prev,
                                            cvc: e.target.value.replace(
                                                /\D/g,
                                                ""
                                            ),
                                        }))
                                    }
                                    maxLength={card.code?.size ?? 3}
                                    placeholder="123"
                                    required
                                />
                                {errors.cvc && (
                                    <span>{errors.cvc}</span>
                                )}
                            </Field>
                        </Field>

                        <Field>
                            <FieldLabel>Name on Card</FieldLabel>
                            <Input
                                value={card.name}
                                onChange={(e) =>
                                    setCard(prev => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Name"
                                required
                            />
                            {errors.name && (
                                <span>{errors.name}</span>
                            )}
                        </Field>

                        <Button
                            type="submit"
                            disabled={
                                !cardValid.valid ||
                                !SUPPORTED_CARD_TYPES.includes(card.cardType as any) ||
                                !valid.cvv(card.cvc, card.code?.size ?? 3).isValid ||
                                !(card.name.length >= 3)
                            }
                        >
                            Save payment method
                        </Button>

                    </FieldGroup>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddPaymentMethod;
