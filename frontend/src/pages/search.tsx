import React from "react";
import style from "@styles/layouts/searchlayout.module.scss"
import Head from "next/head";
import SearchResultContainer from "@components/layouts/search/searchResultContainer";
import { useSearchParams } from "next/navigation";
import FilterBar from "@components/features/search/filterBar";
import AdvanceFilter from "@components/features/search/advanceFilter";

export default function searchResult(){
    const searchParams = useSearchParams();

    const param = searchParams.get('q') || '';

    return (
        <div className={style.searchPageContainer}>
            <Head> 
                <title>{`Nebula : ${param.toString()}`}</title>
            </Head>
            
            {/* Component filter */}
            <AdvanceFilter/>
           
            
            {/* Result */}
            <section className={style.searchResultContainer}>
                <div className={style.searchResult}>
                    <h3>Result of "<span>{param.toString()}</span>"</h3>
                </div>
                <FilterBar/>
                <SearchResultContainer/>
            </section>
        </div>
    )
}