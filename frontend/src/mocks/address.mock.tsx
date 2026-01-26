import { AddressInfo } from "src/types/address";

export const userAddresses: AddressInfo[] =[
    {
        name: "John Doe",
        internationalPrefix: "+66",
        phoneNumber: "812345678",
        addressLocal: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร",
        addressInter: "123 Sukhumvit Rd, Khlong Toei, Bangkok, Thailand",
        postalCode: "10110"
    },
    {
        name: "Jane Doe",
        internationalPrefix: "+1",
        phoneNumber: "4155550198",
        addressLocal: "456 Market Street, San Francisco, CA",
        addressInter: "456 Market Street, San Francisco, CA, United States",
        postalCode: "94105"
    }
];

export const noAddresses: AddressInfo[] = [];