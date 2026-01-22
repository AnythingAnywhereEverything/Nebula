import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';

interface ProductTitleProps {
    name: string;
    tag?: string;
    tag_color?: string;
}

const ProductTitle: React.FC<ProductTitleProps> = ({name, tag, tag_color}) => {
    

    return (
        <h2 className={style.productTitle}>
            <span className={style.productTag} style={{ backgroundColor: tag_color }}>
                {tag}
            </span>
            {name}
        </h2>
    )

}

export default ProductTitle;