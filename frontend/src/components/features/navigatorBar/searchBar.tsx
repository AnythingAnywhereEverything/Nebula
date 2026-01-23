import React from 'react';
import { useSearchParams } from 'next/navigation';
import { NerdFonts } from '../../utilities/NerdFonts';
import style from '@styles/features/searchbar.module.scss';
import Form from 'next/form';

const SearchBar: React.FC = () => {
    const searchParams = useSearchParams();

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
            onSubmit={handleSubmit}
        >
            <input
                type="text"
                name="q"
                placeholder="What you are looking for?"
                defaultValue={searchParams.get('q') || ''}
            />
            <button type="submit">
                <NerdFonts></NerdFonts>
                <p>Search</p>
            </button>
        </Form>
    );
};

export default SearchBar;
