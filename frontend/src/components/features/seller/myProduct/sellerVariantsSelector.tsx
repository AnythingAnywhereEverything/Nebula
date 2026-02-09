import React from "react";
import { ProductOption, ProductVariant } from "src/types/product";

interface ProductVariantSelectorProps {
    options?: ProductOption[];
    variants: ProductVariant[];
    nsin: string;
    prodName: string;
}
const SellerVariantsSelector:React.FC<ProductVariantSelectorProps> = ({
    options,
    variants,
    nsin,
    prodName
}) => {
    const [selected, setSelected] = React.useState<Record<string, string>>({});
        
    function capitalizeFirstLetter(val:string) {
        return String(val).charAt(0).toUpperCase() + String(val).slice(1);
    }

    if (!options) return null;
    
}