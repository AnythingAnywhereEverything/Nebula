
import React from 'react';
import style from '@styles/features/searchresult.module.scss';
import NebulaProductItem from '@components/ui/NebulaProductItem';
import SearchResultLoading from '@components/features/search/searchResultLoading';

import { ProductItemExamples } from 'src/mocks/productItem.mock';

const SearchResultContainer: React.FC = () => {
    
    const ProductItems = ProductItemExamples;

    return (
        <div className={style.searchResultContainer}>
            {/* Example items */}
            <NebulaProductItem {...ProductItems[0]}/>
            <NebulaProductItem {...ProductItems[1]}/>
            <NebulaProductItem {...ProductItems[2]}/>
            <NebulaProductItem {...ProductItems[3]}/>
            <NebulaProductItem {...ProductItems[4]}/>
            <NebulaProductItem {...ProductItems[5]}/>
            <NebulaProductItem {...ProductItems[6]}/>
            <SearchResultLoading/>
        </div>
    )
}

export default SearchResultContainer;