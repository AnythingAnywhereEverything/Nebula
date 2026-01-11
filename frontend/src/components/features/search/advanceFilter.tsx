import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { NerdFonts } from '../../utilities/NerdFonts';
import style from '@styles/features/advancefilter.module.scss';
import { NebulaButton } from '@components/ui/NebulaBtn';

const AdvanceFilter: React.FC = () => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const currentParams = new URLSearchParams(searchParams.toString());

    return (
        <div className={style.advanceFilter}>
            <h3><NerdFonts>󰈲</NerdFonts> Advance Filter</h3>

            <div className={style.filterWraper}>
                <p className={style.filterHeader}>Based of Category</p>
                <div className={style.categoryOptions}>
                    {/* Examples */}
                    <div>
                        <input type="checkbox" id="books" />
                        <label htmlFor="books">Books</label>
                    </div>
                    <div>
                        <input type="checkbox" id="electronics" />
                        <label htmlFor="electronics">Electronics</label>
                    </div>
                    <div>
                        <input type="checkbox" id="clothing" />
                        <label htmlFor="clothing">Clothing</label>
                    </div>
                    <div>
                        <input type="checkbox" id="furniture" />
                        <label htmlFor="furniture">Furniture</label>
                    </div>
                </div>
            </div>
            <div className={style.filterSeparator}></div>

            <div className={style.filterWraper}>
                <p className={style.filterHeader}>Store Rating</p>
                <div className={style.ratingOptions}>
                    <NebulaButton
                        className={style.starRatingButton}
                        onClick={() => {
                            currentParams.set('rating', '5');
                            router.push(`${pathName}?${currentParams.toString()}`);
                        }}
                        btnValues={<NerdFonts extraClass={style.starRating}>     </NerdFonts>}
                    />
                    <NebulaButton
                        className={style.starRatingButton}
                        onClick={() => {
                            currentParams.set('rating', '4');
                            router.push(`${pathName}?${currentParams.toString()}`);
                        }}
                        btnValues={<p><NerdFonts extraClass={style.starRating}>     </NerdFonts> and up</p>}
                    />
                    <NebulaButton
                        className={style.starRatingButton}
                        onClick={() => {
                            currentParams.set('rating', '3');
                            router.push(`${pathName}?${currentParams.toString()}`);
                        }}
                        btnValues={<p><NerdFonts extraClass={style.starRating}>     </NerdFonts> and up</p>}
                    />
                    <NebulaButton
                        className={style.starRatingButton}
                        onClick={() => {
                            currentParams.set('rating', '2');
                            router.push(`${pathName}?${currentParams.toString()}`);
                        }}
                        btnValues={<p><NerdFonts extraClass={style.starRating}>     </NerdFonts> and up</p>}
                    />
                    <NebulaButton
                        className={style.starRatingButton}
                        onClick={() => {
                            currentParams.set('rating', '1');
                            router.push(`${pathName}?${currentParams.toString()}`);
                        }}
                        btnValues={<p><NerdFonts extraClass={style.starRating}>     </NerdFonts> and up</p>}
                    />
                </div>
            </div>

            <div className={style.filterSeparator}></div>

            <div className={style.filterWraper}>
                <p className={style.filterHeader}>Price Range</p>
                <div className={style.rangeInputs}>
                    <input type="number" name="" id="" placeholder="MIN" min={0} />
                    <div className={style.rangeSeparator}></div>
                    <input type="number" name="" id="" placeholder="MAX" min={0} />
                </div>
                <NebulaButton
                    className={style.applyButton}
                    onClick={() => {
                        let max_price = (document.querySelector('input[placeholder="MAX"]') as HTMLInputElement).value;
                        let min_price = (document.querySelector('input[placeholder="MIN"]') as HTMLInputElement).value;

                        if (min_price)currentParams.set('min_price', min_price);
                        else currentParams.delete('min_price');

                        if (max_price) currentParams.set('max_price', max_price);
                        else currentParams.delete('max_price');

                        router.push(`${pathName}?${currentParams.toString()}`);
                    }}
                    btnValues={"Apply"}
                />
            </div>


        </div>
    )
}

export default AdvanceFilter;