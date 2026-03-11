import React, { useEffect, useState } from "react";
import style from "@styles/layouts/searchlayout.module.scss"
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import FilterBar from "@components/features/search/filterBar";
import AdvanceFilter from "@components/features/search/advanceFilter";
import { ProductField } from "@components/ui/Nebula/product-field";
import { ProductDatas, ProductSearchResponse, searchProductDatas } from "@/api/search";

export default function searchResult(){
    const searchParams = useSearchParams();

    const query = searchParams.get('q');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const rating = searchParams.get('rating');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');

    const [result, setResult] = useState<ProductSearchResponse>();

    useEffect(() => {
        if (!query) return;

        const load = async () => {
            const data = await searchProductDatas(
                query,
                page,
                limit,
                rating,
                min_price,
                max_price
            )
            setResult(data)
        }
        load()
    }, [query, page, limit, rating, min_price, max_price])

    return (
        <div className={style.searchPageContainer}>
            <Head> 
                <title>{`Nebula : ${query ? query.toString() : ""}`}</title>
            </Head>
            
            <AdvanceFilter/>
           
            <section className={style.searchResultContainer}>
                <header className={style.searchResult}>
                    <h3>Result of "<span>{query ? query.toString() : ""}</span>"</h3>
                </header>
                <FilterBar page={result?.page || 0} totalPages={result?.total_pages || 1}/>
                <ProductField max_rows={-1} item_display={result?.data}/>
            </section>
        </div>
    )
}