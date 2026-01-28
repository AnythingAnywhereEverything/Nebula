import { ratingStars } from '@components/utilities/StarRating';
import s from '@styles/ui/Nebula/product.module.scss';
import { Icon } from './icon';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from 'src/lib/utils';
import { Slot } from 'radix-ui';

function ProductImage({
    ...props
}: React.ComponentProps<"img">) {
    return (<img data-component="productImage" {...props}/>)
}


function ProductContent ({
    ...props
}:  React.ComponentProps<"div">) {
    return <div data-component="productContent" {...props}/>
}

function ProductHeader ({
    className,
    asChild,
    ...props
}: React.ComponentProps<"header"> & {
    asChild?: boolean;
}) {
    const Comp = asChild ? Slot.Root : "header";
    return <Comp 
        data-component="productHeader" 
        className={cn(s.productHeader, className)}
        {...props}/>
}

function ProductFooter ({
    className,
    ...props
}: React.ComponentProps<"footer">) {
    return <footer 
        data-component="productFooter" 
        className={cn(s.productFooter, className)}
        {...props}/>
}

function ProductStars ({
    className,
    stars = 0,
    ...props
}:  React.ComponentProps<"p"> & {
    stars: number
}) {
    return (<p 
        data-component="productStars"
        className={cn(s.productStars, className)} {...props}>
            <Icon className={s.starColor} value={ratingStars(stars)}/> {stars}
        </p>)
}

function ProductLocation ({
    className,
    location,
}: React.ComponentProps<"footer"> & {
    location: string;
}) {
    return <span 
        data-component="productLocation" 
        className={cn(s.productLocation, className)}>
            <Icon></Icon> {location}
        </span>
}

function ProductPrice ({
    className,
    base,
    discount,
}: React.ComponentProps<"div"> & {
    base: number;
    discount?: number;
} ) {
    return <div data-component="productPrice" className={cn(s.productPrice, className)}>
        <span className={s.currencySymbol}>$</span>
        {
            !discount ?
            <span className={s.focus}>
                {base}
            </span> :
            <div className={s.discounted}>
                <span className={s.focus}>{discount}</span>
                <s className={s.strike}>{base}</s>
            </div>
        }
    </div>
}

const ProductItemVariants = cva(
    s.productItemBase,
    {
        variants: {
            orientation: {
                horizontal: s.horizontal,
                vertical: s.vertical
            }
        },
        defaultVariants:{
            orientation: "vertical"
        }
    }
)
function ProductItem ({
    orientation = "vertical",
    ...props
}:  React.ComponentProps<"article"> & 
    VariantProps<typeof ProductItemVariants>) {
    return (
        <article 
            data-component="productItem"
            data-orientation={orientation}
            className={cn(ProductItemVariants({ orientation }))}
            {...props}
        />
    )
}

export {
    ProductImage,
    ProductContent,
    ProductFooter,
    ProductHeader,
    ProductItem,
    ProductStars,
    ProductLocation,
    ProductPrice
}