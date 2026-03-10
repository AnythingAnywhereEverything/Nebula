import React from 'react';
import style from '@styles/features/searchbar.module.scss';
import Form from 'next/form';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, Icon, FieldSeparator, Button, ButtonGroup } from '@components/ui/NebulaUI';
import { QueryProductValues, searchOnType } from '@/api/search';
import Link from 'next/link';

const SearchBar: React.FC = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const input = form.elements.namedItem('q') as HTMLInputElement;

        if (!input.value.trim()) {
            e.preventDefault();
            input.focus();
        }
    };

    const [results, setResults] = React.useState<QueryProductValues[]>([]);
    const [open, setOpen] = React.useState(false);
    const [current, setCurrent] = React.useState("");

    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setCurrent(value)

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            if (value.trim().length < 2) {
                setResults([]);
                setOpen(false);
                return;
            }

            const data = await searchOnType(value);

            setResults(data);
            setOpen(true);
        }, 300);
    };

    return (
        <Form
            className={style.navSearchBox}
            action="/search"
            onSubmit={handleSubmit}>
            <InputGroup className={style.navInput}>
                <InputGroupInput
                    name="q"
                    placeholder="Search..."
                    onChange={handleChange}
                    onFocus={() => setOpen(true)}
                    onBlur={() => {
                        setTimeout(() => setOpen(false), 150);
                    }}
                    value={current}
                    style={{ color: "#000" }}
                    autoComplete='off'
                />
                <InputGroupAddon align="inline-start">
                    <Icon style={{color:"#474747"}} value="" />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    <InputGroupButton type="submit" className={style.navSearch} variant="default" size={"sm"}>Search</InputGroupButton>
                </InputGroupAddon>
            </InputGroup>

            {open && results.length > 0 && (
                <ButtonGroup orientation={"vertical"} style={{width: "100%"}} className={style.resultBox}>
                    {results.map((r) => (
                        <Button asChild style={{width: "100%", justifyContent:"start"}} variant={"ghost"} key={r.id}>
                            <Link href={`/search?q=${r.name}`}>
                                {r.name}
                            </Link>
                        </Button>
                    ))}

                    <FieldSeparator/>

                    <Button asChild style={{width: "100%", justifyContent:"start"}} variant={"link"}>
                        <Link href={`/search?q=${current}`}>
                            View all results
                        </Link>
                    </Button>
                </ButtonGroup>
            )}
        </Form>
    )
};

export default SearchBar;
