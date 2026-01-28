import { CardInfo } from "src/types/card";

export const hasCard: CardInfo[] =[
    {
        cardType: "Master Card",
        cardNumber: "**** **** **** 1234",
        expireDate: new Date(2026, 5, 30),
    },
    {
        cardType: "Visa",
        cardNumber: "**** **** **** 5678",
        expireDate: new Date(2025, 10, 30),
    },
    {
        cardType: "American Express",
        cardNumber: "**** **** **** 9012",
        expireDate: new Date(2027, 2, 31),
    },
    {
        cardType: "JCB",
        cardNumber: "**** **** **** 3456",
        expireDate: new Date(2024, 8, 30),
    },
];

export const noCard: CardInfo[] = [];