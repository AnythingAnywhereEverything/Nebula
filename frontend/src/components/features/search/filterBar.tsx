import React, { FC } from 'react';
import { NerdFonts } from '../../utilities/NerdFonts';
import style from '@styles/features/filterbar.module.scss';
import { NebulaButton } from '@components/ui/NebulaBtn';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const FilterBar: FC = () => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(searchParams.toString());
    const sortType = searchParams.get('sort') || 'relevance';
    

    return (
        <div className={style.filterBar}>
            <div className={style.filterItem}>
                <p>Sorted By</p>
                <NebulaButton
                    className={`
                        ${style.filterButton}
                        ${sortType === 'relevance' ? style.active : ''}`}
                    onClick={() => {
                        currentParams.set('sort', 'relevance');
                        router.push(`${pathName}?${currentParams.toString()}`);
                    } }
                    btnValues={"Relevance"}
                />
                <NebulaButton
                    className={`
                        ${style.filterButton} 
                        ${sortType === 'recent' ? style.active : ''}
                        `}
                    onClick={() => {
                        currentParams.set('sort', 'recent');
                        router.push(`${pathName}?${currentParams.toString()}`);
                    } }
                    btnValues={"Most Recent"}
                />
                <NebulaButton
                    className={`
                        ${style.priceFilterButton}
                        ${sortType === 'price_asc' || sortType === 'price_desc' ? style.active : ''}
                    `}
                    onClick={() => {} }
                    btnValues={(
                        <>
                            <p>Price Range</p>
                            <span>
                                {
                                    sortType === 'price_asc' ? (" : Low to High") : sortType === 'price_desc' ? (" : High to Low") : ""
                                }
                                <NerdFonts children={""}/>
                            </span>
                        </>
                    )}
                    relative={true}
                    btnComponent={
                        <>
                            <button onClick={() => {
                                currentParams.set('sort', 'price_asc');
                                router.push(`${pathName}?${currentParams.toString()}`);
                            }}>Low to High</button>
                            <button onClick={() => {
                                currentParams.set('sort', 'price_desc');
                                router.push(`${pathName}?${currentParams.toString()}`);
                            }}>High to Low</button>
                        </>
                    }
                    componentClassName={style.dropdownContent}
                />
            </div>
            <div className={style.filterPages}>
                <p>Page 1 of 7</p>
                <div className={style.pageButtons}>
                    <NebulaButton
                        className={style.pageButton}
                        onClick={() => {} }
                        btnValues={NerdFonts({ children: "" })}
                    />
                    <NebulaButton
                        className={style.pageButton}
                        onClick={() => {} }
                        btnValues={NerdFonts({ children: "" })}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;