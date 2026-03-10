import React from 'react';
import style from '@styles/features/productmediaviewer.module.scss';

interface ProductImageViewerProps {
    mediaLists: string[];
}

const ProductImageViewer: React.FC<ProductImageViewerProps> = ({mediaLists}) => {
    const [previewImage, setPreviewImage] = React.useState("")
    
    React.useEffect(() => {
        if (mediaLists.length === 0) {
            setPreviewImage("");
        } else {
            setPreviewImage(mediaLists[0]);
        }
    }, [mediaLists])

    return (
        <div className={style.mediaViewerContainer}>
            <div className={style.multimediaContainer}>
                {/* Contain multiple media in a row, maximum at 5*/}
                {mediaLists.map((media, index) => {
                    if (index > 5) return null;
                    if (index == 5) return (
                        <div 
                            key={index} 
                            className={style.mediaItem}
                            onClick={() => setPreviewImage(media)}
                        >
                            <div className={style.moreMediaIndicator}>
                                <p>+{mediaLists.length - 5}</p>
                            </div>
                            <img src={`/cdn/${media}`} alt={`Product Media ${index + 1}`} />
                        </div>
                    );
                    return(
                        <div 
                            key={index} 
                            className={`
                                ${style.mediaItem}
                                ${previewImage === media ? style.active : ''} 
                            `}
                            onClick={() => setPreviewImage(media)}
                        >
                            <img src={`/cdn/${media}`} alt={`Product Media ${index + 1}`} />
                        </div>
                    )
                })}
            </div>
            <div className={style.currentPreviewMedia}>
                {previewImage && <img src={`/cdn/${previewImage}`} alt="Product Media Preview" />}
            </div>
        </div>
    )

}

export default ProductImageViewer;