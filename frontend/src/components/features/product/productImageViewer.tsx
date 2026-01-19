import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { NerdFonts } from '../../utilities/NerdFonts';
import style from '@styles/features/productmediaviewer.module.scss';
import { NebulaButton } from '@components/ui/NebulaBtn';

interface ProductImageViewerProps {
    mediaLists: string[];
}

const ProductImageViewer: React.FC<ProductImageViewerProps> = ({mediaLists}) => {
    const [previewImage, setPreviewImage] = React.useState("")
    
    React.useEffect(() => {
        setPreviewImage(mediaLists[0]);
    }, [mediaLists])
    if (mediaLists.length === 0) {
        setPreviewImage("");
    }

    return (
        <div className={style.mediaViewerContainer}>
            <div className={style.multimediaContainer}>
                {/* Contain multiple media in a row, maximum at 5*/}
                {mediaLists.map((media, index) => {
                    if (index > 4) return null;
                    if (index == 4) return (
                        <div 
                            key={index} 
                            className={style.mediaItem}
                            onClick={() => setPreviewImage(media)}
                        >
                            <div className={style.moreMediaIndicator}>
                                <p>+{mediaLists.length - 5}</p>
                            </div>
                            <img src={media} alt={`Product Media ${index + 1}`} />
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
                            <img src={media} alt={`Product Media ${index + 1}`} />
                        </div>
                    )
                })}
            </div>
            <div className={style.currentPreviewMedia}>
                <img src={previewImage} alt="Product Media Preview" />
            </div>
        </div>
    )

}

export default ProductImageViewer;