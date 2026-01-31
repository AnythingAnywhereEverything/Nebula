export interface AddressInfo {
    full_name : string;
    phonecode : string;
    phone: string;

    address_line1:string;
    address_line2:string;

    postal: string;

    city: string;
    state: string;
    state_code: string;
    country: string;
    country_code: string;

    is_default: boolean;
}