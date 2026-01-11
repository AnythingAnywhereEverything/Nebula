import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NerdFonts } from '../../utilities/NerdFonts';
import style from '@styles/features/searchbar.module.scss';

const SearchBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchQuery = formData.get('search') as string;
    if (searchQuery.trim() === ''){
      router.push('/')
      return;
    };
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&sort=relevance`);
  };

  return (
    <form className={style.navSearchBox} onSubmit={handleSearch}>
      <input
        type="text"
        name="search"
        placeholder="What you are looking for?"
        defaultValue={searchParams.get('q') || ''}
      />
      <button type="submit">
        <NerdFonts> </NerdFonts>
        <p>Search</p>
      </button>
    </form>
  );
};

export default SearchBar;
