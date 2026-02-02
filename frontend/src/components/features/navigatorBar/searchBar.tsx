import React from 'react';
import style from '@styles/features/searchbar.module.scss';
import Form from 'next/form';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, Icon } from '@components/ui/NebulaUI';

const SearchBar: React.FC = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const input = form.elements.namedItem('q') as HTMLInputElement;

        if (!input.value.trim()) {
            e.preventDefault();
            input.focus();
        }
    };
    return (
        <Form
            className={style.navSearchBox}
            action="/search"
            onSubmit={handleSubmit}>
            <InputGroup className={style.navInput}>
                <InputGroupInput name='q' id="inline-start-input" placeholder="Search..." style={{color: "#000"}} />
                <InputGroupAddon align="inline-start">
                    <Icon value="" />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    <InputGroupButton type="submit" className={style.navSearch} variant="default" size={"sm"}>Search</InputGroupButton>
                </InputGroupAddon>
            </InputGroup>
        </Form>
    )
};

export default SearchBar;
