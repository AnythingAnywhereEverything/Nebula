import React from 'react';
import style from '@styles/layouts/productlayout.module.scss';
import ReactMarkdown from 'react-markdown';

interface ProductFullDetailProps {
    specs?: {id: number, name:string, info:string}[];
    about?: string;
}

const ProductFullDetail: React.FC<ProductFullDetailProps> = ({specs, about}) => {
    

    return (
        <>
            {specs &&
                <div className={style.detailContainer}>
                    <h5 className={style.header}>Product Specifications</h5>
                    <table className={style.specContainer}>
                        <thead>
                            <tr>
                                <th>Spec name</th>
                                <th>Spec info</th>
                            </tr>
                        </thead>
                        <tbody>
                        { specs.map((spec) => {
                            return (
                                <tr key={spec.id}>
                                    <td className={style.specName}>
                                        <p>{spec.name}</p>
                                    </td>
                                    <td className={style.specInfo}>
                                        <p>{spec.info}</p>
                                    </td>
                                </tr>
                            )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            }
            <div className={style.detailContainer}>
                <h5 className={style.header}>About this Product</h5>
                <div className={style.markdownContainer}>
                    <ReactMarkdown>{about}</ReactMarkdown> 
                </div>
            </div>
        </>
    )

}

export default ProductFullDetail;