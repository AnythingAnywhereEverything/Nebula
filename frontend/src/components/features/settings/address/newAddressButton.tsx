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

const countries = Country.getAllCountries();

const CustomOverlay = ({ state }: { state: boolean }) => (
    <div
        data-state={state ? "open" : "close"}
        className={s.overlay}
    />
);


const NewAddressBtn: React.FC = () => {
    const [open, setOpen] = useState(false);
    
    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [city, setCity] = useState<ICity | null>(null);
    
    const [countryQuery, setCountryQuery] = useState("");
    const [stateQuery, setStateQuery] = useState("");
    const [cityQuery, setCityQuery] = useState("");
    
    const [phone, setPhone] = useState("");

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

        const payload = {
            full_name: formData.get("full_name"),
            phonecode: Country.getCountryByCode(countryId)?.phonecode,
            phone: formData.get("phone"),
            address_line1: formData.get("address-line1"),
            address_line2: formData.get("address-line2"),
            postal: formData.get("postal"),
            is_default: formData.get("default") === "on",
            
            country: selectedCountry?.name ?? null,
            countryCode: countryId,
            
            state: selectedState?.name ?? null,
            stateCode: stateId,

            city: city?.name ?? null,
        };

        console.log("SUBMIT PAYLOAD:", JSON.stringify(payload));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
            modal={false}
        >
            <DialogTrigger asChild>
                <Button variant="oppose">
                    Add new address
                </Button>
            </DialogTrigger>

            {open && <CustomOverlay state={open} />}

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add new address
                    </DialogTitle>
                    <DialogDescription>
                        Adding a new address for your delivery
                    </DialogDescription>
                </DialogHeader>

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
            </DialogContent>
        </Dialog>
    );
};

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

                <ComboboxContent keepMount>
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



export default NewAddressBtn;
