import React from 'react';
import style from '@styles/features/searchbar.module.scss';
import Form from 'next/form';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, Icon, FieldSeparator } from '@components/ui/NebulaUI';
import { QueryProductValues, searchOnType } from '@/api/search';

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

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.length < 2) {
            setOpen(false);
            return;
        }

        const res = await searchOnType(value)

        console.log(res)

        setResults(res);
        setOpen(true);
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
                <div className={style.resultBox}>
                    {results.map((r) => (
                        <div key={r.id} className={style.resultItem}>
                            {r.name}
                        </div>
                    ))}

                    <FieldSeparator/>

                    <div className={style.resultFooter}>
                        View all results
                    </div>
                </div>
            )}
        </Form>
    )
};

export default SearchBar;
