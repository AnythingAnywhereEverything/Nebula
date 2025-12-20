
import React, { FC } from 'react';
import { NerdFonts } from '../../utilities/NerdFonts';
import style from '@styles/features/searchbar.module.scss';

const SearchBar: React.FC = () => {
    return (
        <form className={style.navSearchBox} action="/search" method="GET">
            <input type="text" placeholder="What you are looking for?" />
            <button type="submit">
                <NerdFonts> </NerdFonts>
                <p>Search</p>
            </button>
        </form>
    )
}

export default SearchBar;