import React, { useMemo, useState } from "react";
import {
    Button,
    ButtonGroup,
    Checkbox,
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    Label,
} from "@components/ui/NebulaUI";

import s from "@styles/ui/Nebula/dialogue.module.scss";
import {
    Country,
    State,
    City,
    ICountry,
    IState,
    ICity,
} from "country-state-city";
import Form from "next/form";
import {AddressResponse } from "@/api/address";
import { useAddressService } from "@/hooks/useAddressService";

const countries = Country.getAllCountries();

const CustomOverlay = ({ state }: { state: boolean }) => (
    <div
        data-state={state ? "open" : "close"}
        className={s.overlay}
    />
);

interface AddressButtonProps {
    type: "new" | "edit";
    addressData?: AddressResponse;
}

const AddressButton: React.FC<AddressButtonProps> = ({ type, addressData }) => {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
    };

    const { 
        addAddress: addAddressService, 
        editAddress: editAddressService,
        addAddressSuccess,
        editAddressSuccess } = useAddressService();

    React.useEffect(() => {
        if (addAddressSuccess || editAddressSuccess) {
            setOpen(false);
        }
    }, [addAddressSuccess, editAddressSuccess]);


    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
            modal={false}
        >
            <DialogTrigger asChild>
                {type === "new" ? 
                    <Button variant="oppose">
                        Add new address
                    </Button>
                    :
                    <Button size={"sm"} variant="outline">
                        Edit
                    </Button>
                }
            </DialogTrigger>

            {open && <CustomOverlay state={open} />}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {type === "new" ? "Add new address" : "Edit address"}
                    </DialogTitle>
                    <DialogDescription>
                        {type === "new"
                            ? "Adding a new address for your delivery"
                            : "Edit your existing address details"}
                    </DialogDescription>
                </DialogHeader>
                {type === "new" ?
                <AddressForm initialData={addressData} submitAction={addAddressService} />
                :
                <AddressForm initialData={addressData!} submitAction={editAddressService} />
                }
            </DialogContent>
        </Dialog>
    );
}

interface AddressFormProps {
    initialData?: AddressResponse;
    submitAction: (data: any) => Promise<AddressResponse>;
}

const AddressForm: React.FC<AddressFormProps> = (props) => {


    // If initialData is provided, this form will be used for editing an existing address. Otherwise, it will be used for adding a new address. The submitAction function will handle both adding and editing based on the context in which the form is used.
    const { initialData, submitAction } = props;

    // This is a new address form
    const [countryId, setCountryId] = useState(initialData?.country ? countries.find(c => c.name === initialData.country)?.isoCode || "" : "");
    const [stateId, setStateId] = useState(initialData?.state ? State.getStatesOfCountry(countryId).find(s => s.name === initialData.state)?.isoCode || "" : "");
    const [city, setCity] = useState<ICity | null>(initialData?.city && stateId && countryId ? City.getCitiesOfState(countryId, stateId).find(c => c.name === initialData.city) || null : null);
    
    const [countryQuery, setCountryQuery] = useState("");
    const [stateQuery, setStateQuery] = useState("");
    const [cityQuery, setCityQuery] = useState("");
    
    const [phone, setPhone] = useState(initialData?.phone_number || "");

    const filteredCountries = useMemo(() => {
        if (!countryQuery) return countries;
        
        return countries.filter((c) =>
            c.name.toLowerCase().includes(countryQuery.toLowerCase())
        );
    }, [countryQuery]);
    
    const states = useMemo(() => {
        if (!countryId) return [];
        return State.getStatesOfCountry(countryId);
    }, [countryId]);
    
    const filteredStates = useMemo(() => {
        if (!stateQuery) return states;
        
        return states.filter((s) =>
            s.name.toLowerCase().includes(stateQuery.toLowerCase())
        );
    }, [stateQuery, states]);

    const cities = useMemo(() => {
        if (!countryId || !stateId) return [];
        return City.getCitiesOfState(countryId, stateId);
    }, [countryId, stateId]);
    
    const filteredCities = useMemo(() => {
        if (!cityQuery) return cities;
        
        return cities.filter((c) =>
            c.name.toLowerCase().includes(cityQuery.toLowerCase())
        );
    }, [cityQuery, cities]);

    const selectedCountry = countries.find((c) => c.isoCode === countryId) || null;

    const selectedState = states.find((s) => s.isoCode === stateId) || null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);

        //format phone number into international format with country code
        const rawPhone = formData.get("phone") as string;
        const digits = rawPhone.replace(/\D/g, "");
        // Remove leading zeros from the phone number
        const trimmedDigits = digits.replace(/^0+/, "");
        const intlPhone = selectedCountry?.phonecode
            ? (selectedCountry.phonecode.startsWith('+')
                ? selectedCountry.phonecode
                : '+' + selectedCountry.phonecode) + trimmedDigits
            : trimmedDigits;
            
        let payload = {
            full_name: formData.get("full_name")?.toString() ?? null,
            address_line1: formData.get("address-line1")?.toString() ?? null,
            address_line2: formData.get("address-line2")?.toString() ?? null,
            city: city?.name ?? null,
            country: selectedCountry?.name ?? null,
            state: selectedState?.name ?? null,
            zip_code: formData.get("postal")?.toString() ?? null,
            phone_number: intlPhone,
            is_default: formData.get("default") === "on",
        };

        if (props.initialData) {
            console.log("Editing address with payload:", payload);
            submitAction({
                address_id: props.initialData.id,
                payload
            });
        } else {
            submitAction(payload);
        }
    };

    return (
        <Form action={"#"} onSubmit={(e) => {e.preventDefault(); handleSubmit(e)}}>
            <FieldGroup>
                <FieldGroup>
                    <Field orientation="horizontal">
                        <Field>
                            <FieldLabel htmlFor="full_name">
                                Full Name
                            </FieldLabel>
                            <Input
                                name="full_name"
                                id="full_name"
                                placeholder="John"
                                defaultValue={initialData?.full_name || ""}
                            />
                        </Field>

                        <FieldSeparator />

                        <Field>
                            <FieldLabel htmlFor="phone">
                                Phone Number
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupAddon align="inline-start">
                                    <InputGroupText>
                                        {selectedCountry?.phonecode
                                            ? (selectedCountry.phonecode.startsWith('+')
                                            ? selectedCountry.phonecode
                                            : '+' + selectedCountry.phonecode)
                                            : "XX"
                                        } 
                                    </InputGroupText>
                                </InputGroupAddon>
                                <InputGroupInput
                                    id="phone"
                                    name="phone"
                                    inputMode="tel"
                                    placeholder={`XXX XXX XXXX`}
                                    onChange={(e) => {
                                        const digits = e.target.value.replace(/\D/g, "");
                                        setPhone(digits);
                                    }}
                                    onBlur={() => {
                                        setPhone(phone.replace(/\D/g, ""));
                                    }}
                                    defaultValue={initialData?.phone_number ? initialData.phone_number.replace(/\D/g, "") : ""}
                                />
                            </InputGroup>
                        </Field>
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="address-line1">
                            Street Address
                        </FieldLabel>
                        <Input
                            name="address-line1"
                            id="address-line1"
                            placeholder="123 Main St."
                            defaultValue={initialData?.address_line1 || ""}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="address-line2">
                            Apt, suite, etc. (Optional)
                        </FieldLabel>
                        <Input
                            name="address-line2"
                            id="address-line2"
                            placeholder="Building C, Fl 3"
                            defaultValue={initialData?.address_line2 || ""}
                        />
                    </Field>

                    <Field orientation={"horizontal"}>
                        <SearchCombobox<ICountry>
                            id="country"
                            name="country"
                            label="Country"
                            placeholder="Search countries..."
                            items={countries}
                            filteredItems={filteredCountries}
                            value={selectedCountry}
                            query={countryQuery}
                            onQueryChange={setCountryQuery}
                            onValueChange={(country) => {
                                setCountryId(country?.isoCode || "");
                                setCountryQuery("");
                                setStateId("");
                                setStateQuery("");
                                setCity(null);
                                setCityQuery("");
                            }}
                            itemKey={(c) => c.isoCode}
                            itemToString={(c) => c.name}
                        />

                        <SearchCombobox<IState>
                            id="state"
                            name="state"
                            label="State / Province"
                            placeholder="Search states..."
                            disabled={!countryId}
                            items={states}
                            filteredItems={filteredStates}
                            value={selectedState}
                            query={stateQuery}
                            onQueryChange={setStateQuery}
                            onValueChange={(state) => {
                                setStateId(state?.isoCode || "");
                                setStateQuery("");
                                setCity(null);
                                setCityQuery("");
                            }}
                            itemKey={(s) => s.isoCode}
                            itemToString={(s) => s.name}
                        />
                    </Field>
                    <Field orientation={"horizontal"}>
                        <SearchCombobox<ICity>
                            id="city"
                            name="city"
                            label="City"
                            placeholder="Search cities..."
                            disabled={!stateId}
                            items={cities}
                            filteredItems={filteredCities}
                            value={city}
                            query={cityQuery}
                            onQueryChange={setCityQuery}
                            onValueChange={(value) => {
                                setCity(value);
                                setCityQuery("");
                            }}
                            itemKey={(c) =>
                                `${c.countryCode}-${c.stateCode}-${c.name}`
                            }
                            itemToString={(c) => c.name}
                        />
                        <Field>
                            <FieldLabel htmlFor="postal">
                                Postal / Zip Code
                            </FieldLabel>
                            <Input name="postal" id="postal" placeholder="12345" />
                        </Field>
                    </Field>
                    <Field orientation={"horizontal"}>
                        <Checkbox name="default" id="default" />
                        <Label htmlFor="default">Set as Default Address</Label>
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <ButtonGroup>
                        <ButtonGroup>
                            <Button variant={"outline"}>
                                Cancel
                            </Button>
                        </ButtonGroup>
                        <ButtonGroup>
                            <Button variant={"default"}>
                                Submit
                            </Button>
                        </ButtonGroup>
                    </ButtonGroup>
                </DialogFooter>
            </FieldGroup>
        </Form>
    );
}

type SearchComboboxProps<T> = {
    id:string,
    name:string,
    label: string;
    placeholder: string;
    disabled?: boolean;
    items: T[];
    filteredItems: T[];
    value: T | null;
    query: string;
    onQueryChange: (value: string) => void;
    onValueChange: (value: T | null) => void;
    itemKey: (item: T) => React.Key;
    itemToString: (item: T) => string;
};

function SearchCombobox<T>({
    name,
    id,
    label,
    placeholder,
    disabled,
    items,
    filteredItems,
    value,
    query,
    onQueryChange,
    onValueChange,
    itemKey,
    itemToString,
}: SearchComboboxProps<T>) {
    return (
        <Field>
            <FieldLabel htmlFor={id}>
                {label}
            </FieldLabel>

            <Combobox
                name={name}
                id={id}
                items={items}
                itemToStringValue={(item) =>
                    item ? itemToString(item) : ""
                }
                onValueChange={onValueChange}
            >
                <ComboboxInput
                    placeholder={placeholder}
                    disabled={disabled}
                    value={value ? itemToString(value) : query}
                    onChange={(e) => {
                        if (value) {
                            onValueChange(null);
                        }

                        onQueryChange(e.target.value);
                    }}
                />

                <ComboboxContent>
                    <ComboboxEmpty>
                        No results found.
                    </ComboboxEmpty>

                    <ComboboxList>
                        {filteredItems.map((item) => (
                            <ComboboxItem
                                key={itemKey(item)}
                                value={item}
                            >
                                {itemToString(item)}
                            </ComboboxItem>
                        ))}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </Field>
    );
}

export default AddressButton;
