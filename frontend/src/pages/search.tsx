import React from "react";
import style from "@styles/layouts/searchlayout.module.scss"
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import FilterBar from "@components/features/search/filterBar";
import AdvanceFilter from "@components/features/search/advanceFilter";
import { ProductField } from "@components/ui/Nebula/product-field";

export default function searchResult(){
    const searchParams = useSearchParams();

    const param = searchParams.get('q') || '';

    return (
        <div className={style.searchPageContainer}>
            <Head> 
                <title>{`Nebula : ${param.toString()}`}</title>
            </Head>
            
            <AdvanceFilter/>
           
            <section className={style.searchResultContainer}>
                <header className={style.searchResult}>
                    <h3>Result of "<span>{param.toString()}</span>"</h3>
                </header>
                <FilterBar/>
                <ProductField/>
            </section>
        </div>
    )
}