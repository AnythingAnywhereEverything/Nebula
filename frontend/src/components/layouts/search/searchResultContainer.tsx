
import React from 'react';
import style from '@styles/features/searchresult.module.scss';
import SearchResultItem from '@components/ui/NebulaProductItem';
import SearchResultLoading from '@components/features/search/searchResultLoading';

const SearchResultContainer: React.FC = () => {
    
    return (
        <div className={style.searchResultContainer}>
            {/* Example items */}
            <SearchResultItem 
                nsin="NB00000001"
                itemtag="New"
                itemtagcolor='#28A745'
                itemtitle="JOYTOY 1/18 Warhammer 40,000 Action Figure Space Wolves Intercessors, Warhammer 40K, Collection Model 4.2inch"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={42.99}
                itemrating={4.5}
                productLocation="Bangkok"
            />
            <SearchResultItem 
                nsin="NB00000001"
                itemtag="Sale"
                itemtagcolor='#FF5733'
                itemtitle="Wireless Bluetooth Headphones with Noise Cancellation"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={89.99}
                itemrating={4.7}
                productLocation="New York"
            />
            <SearchResultItem 
                nsin="NB00000001"
                itemtag="Bestseller"
                itemtagcolor='#4270c5ff'
                itemtitle="Smartwatch with Heart Rate Monitor and GPS"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={129.99}
                itemrating={4.3}
                productLocation="San Francisco"
            />
            <SearchResultItem 
                nsin="NB00000001"
                itemtag="Limited"
                itemtagcolor='#FF5733'
                itemtitle="4K Ultra HD Action Camera with Waterproof Case"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={59.99}
                itemrating={3.6}
                productLocation="Los Angeles"
            />
            <SearchResultItem 
                nsin="NB00000001"
                itemtag="Featured"
                itemtagcolor='#4270c5ff'
                itemtitle="Portable Bluetooth Speaker with Deep Bass"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={39.99}
                itemrating={2.8}
                productLocation="Chicago"
            />

            <SearchResultLoading/>
        </div>
    )
}

export default SearchResultContainer;