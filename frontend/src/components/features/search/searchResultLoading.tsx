
import React, { FC, JSX } from 'react';
import style from '@styles/features/searchresult.module.scss';

const SearchResultLoading: React.FC = () => {

    const [titleSkeleton, settitleSkeleton] = React.useState<JSX.Element>(<></>);

    React.useEffect(() => {
        const generateTitleSkeleton = () => {
            const randomWidths = []
            for (let i = 0; i < 3; i++) {
                let min = 50;
                if (i === 0) min = 60;
                const width = Math.floor(Math.random() * (100 - min + 1)) + min;
                randomWidths.push(width);
            }

            return (
                <div className={style.itemTitle}>
                    <div className={`${style.lineA} ${style.loading}`} style={{width: `${randomWidths[0]}%`}}></div>
                    {randomWidths[1] < randomWidths[0] + 10 && <div className={`${style.lineB} ${style.loading}`} style={{width: `${randomWidths[1]}%`}}></div>}
                    {randomWidths[2] < randomWidths[1] + 10 && <div className={`${style.lineC} ${style.loading}`} style={{width: `${randomWidths[2]}%`}}></div>}
                </div>
            )
        }
        settitleSkeleton(generateTitleSkeleton());
    }, []);

    return (
        <div className={style.searchResultLoading}>
            <div className={style.imageContainer}>
                <div className={`${style.itemImage} ${style.loading}`}></div>
            </div>
            <div className={style.itemDetails}>
                {titleSkeleton}
                <p className={`${style.itemPrice} ${style.loading}`}></p>
                <div className={`${style.itemRating} ${style.loading}`}></div>
            </div>
        </div>
    )
}

export default SearchResultLoading;