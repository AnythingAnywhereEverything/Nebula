import { CardInfo } from "src/types/card";

export const hasCard: CardInfo[] = [
    {
        card_type: "mastercard",
        last_four_digits: "1234",
        expireDate: new Date(2026, 5, 30),
        is_default: true,
    },
    {
        card_type: "visa",
        last_four_digits: "5678",
        expireDate: new Date(2025, 10, 30),
        is_default: false,
    },
    {
        card_type: "visa",
        last_four_digits: "9012",
        expireDate: new Date(2027, 2, 31),
        is_default: false,
    },
    {
        card_type: "Unknown",
        last_four_digits: "3456",
        expireDate: new Date(2024, 8, 30),
        is_default: false,
    },
];

export const noCard: CardInfo[] = [];
