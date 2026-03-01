import { SellerContent, SellerHeader, SellerLayout } from "@components/layouts/sellerPageLayout";
import { FieldDescription, Field, FieldLabel,
        Input, FieldGroup, DropdownMenu,
        DropdownMenuTrigger, Button, DropdownMenuContent,
        DropdownMenuItem, 
        InputGroupText,
        Textarea,
        FieldSeparator,
        Icon,
        ButtonGroup,
        } from "@components/ui/NebulaUI";
import Form from "next/form";
import React, { useRef, useState } from "react";
import s from "@styles/layouts/seller/addProduct.module.scss"


type ProductVariantType = {
    fake_id: string;
    product_img: string;
    variant_name: string;
    SKU: string;
    price: string;
    stock: string;
    status: 'in_stock' | 'out_of_stock' | 'draft';
};

type Spec = {
    fake_id: string;
    name: string;
    info: string;
};

type mainProduct = {
    fake_id: string;
    product_title: string;
    product_about: string;
    specification: Spec[];
    product_variant: ProductVariantType[];
    currency : string
    discount? : string
    shipping_cost? : string
    section? : string
    category? : string

}

const createEmptyVariant = (): ProductVariantType => ({
    fake_id: crypto.randomUUID(),
    product_img: "",
    variant_name: "",
    SKU: "",
    price: "",
    stock: "",
    status: 'in_stock'
});

export default function AddNewProduct() {
    
    const createEmptySpec = (): Spec => ({
        fake_id: crypto.randomUUID(),
        name: "",
        info: "",
    });

    const addSpec = () => {
        if (spec.length >= 10) return;
        setSpec(prev => [...prev, createEmptySpec()]);
    };

    const removeSpec = (id: string) => {
        setSpec(prev => prev.filter(s => s.fake_id !== id));
    };

    const updateSpec = (
        id: string, 
        field: "name" | "info", 
        value: string
    ) => {
        setSpec(prev =>
            prev.map(s =>
                s.fake_id === id ? { ...s, [field]: value } : s
            )
        );
    };

    const [spec, setSpec] = useState<Spec[]>([createEmptySpec()]);
    const [variant, setVariant] = useState<ProductVariantType[]>([
        createEmptyVariant()
    ]);
    const [allVariant , setAllVariant] = useState<mainProduct>({
            fake_id: crypto.randomUUID(),
            product_title: "",
            product_about: "",
            specification: [],
            product_variant: [],
            currency: "$" // fixed
        }
    )
    const finalProduct: mainProduct ={
        ...allVariant,
        specification: spec,
        product_variant: variant
    }
    return(
        <SellerLayout>
            <SellerHeader>Add new product</SellerHeader>
            <Field orientation={'horizontal'} style={{alignItems: 'stretch'}}>
                <Form action={'#'} className={s.productContainer}>
                    <Field>
                        <SellerContent>
                            <FieldGroup>
                            {/* Parent item ID here*/}
                                <Field >
                                    <Button
                                    onClick={() => console.log(finalProduct)}
                                    >
                                        Main product Btn
                                    </Button>
                                    <FieldGroup>
                                        {/* Parent item Main Title */}
                                        <FieldLabel>Product Name</FieldLabel>
                                        <Input 
                                        id="add-product-name" 
                                        placeholder="Product name here"
                                        onChange={(e) => 
                                            setAllVariant(prev => ({
                                                ...prev,
                                                product_title: e.target.value
                                            }))
                                        }
                                        />
                                        {/* Parent item About */}
                                        <FieldLabel>Product About</FieldLabel>
                                        <Textarea 
                                        id="add-product-about" 
                                        placeholder="About product"
                                        onChange={(e) => 
                                            setAllVariant(perv => ({
                                            ...perv,
                                            product_about: e.target.value
                                        }))}
                                        />
                                    </FieldGroup>
                                        <FieldSeparator/>
                                    <FieldGroup>
                                        <FieldLabel>Specification</FieldLabel>
                                        <Field>
                                            {/* Parent item Specification*/}
                                            <table className={s.productTable}>
                                                <thead>
                                                    <tr style={{
                                                        textAlign: 'left',
                                                        }}>
                                                        <th>
                                                            <FieldLabel>
                                                                Specification Name
                                                            </FieldLabel>
                                                        </th>
                                                        <th>
                                                            <FieldLabel>
                                                                Specification Info
                                                            </FieldLabel>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {spec.map((item) => (
                                                        <tr key={item.fake_id}>
                                                            <td style={{ width: "50%" }}>
                                                                <Input
                                                                    placeholder="Name"
                                                                    value={item.name}
                                                                    onChange={(e) =>
                                                                        updateSpec(item.fake_id, "name", e.target.value)
                                                                    }
                                                                />
                                                            </td>
                                                            <td style={{ width: "50%" }}>
                                                                <Input
                                                                    placeholder="Info"
                                                                    value={item.info}
                                                                    onChange={(e) =>
                                                                        updateSpec(item.fake_id, "info", e.target.value)
                                                                    }
                                                                />
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={() => removeSpec(item.fake_id)}
                                                                >
                                                                    <Icon></Icon>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {spec.length < 10 && (
                                                    <tr>
                                                        <td colSpan={3}>
                                                            <Field>
                                                                <Button
                                                                variant={'outline'}
                                                                size={'sm'}
                                                                onClick={addSpec}
                                                                >
                                                                    <Icon></Icon>
                                                                </Button>
                                                            </Field>
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </table>                                         
                                        </Field>
                                    </FieldGroup>
                                </Field>
                            </FieldGroup>
                        </SellerContent>
                    </Field>
                </Form>

                <Field style={{width: "400px", alignItems: 'stretch'}}>
                    <SellerContent>
                        <FieldGroup>
                            <FieldLabel>Shipping</FieldLabel>
                        </FieldGroup>
                    </SellerContent>
                </Field>

            </Field>

            <ProductVariant
                variant={variant}
                setVariant={setVariant}
            />
        </SellerLayout>
    )
}

const ProductVariant:React.FC<{
    variant: ProductVariantType[];
    setVariant: React.Dispatch<React.SetStateAction<ProductVariantType[]>>;
}> = ({ variant, setVariant }) => {

    const statusList = [
      {name: "Active"   ,value:"in_stock"},
      {name: "In active",value:"out_of_stock"},
      {name: 'Draft'    ,value:"draft"},
    ] as const

    const [loading, setLoading] = useState(false);
    //
    const [error,setError]= useState<string | null>(null);
    
    const handleImageChange = (
        id: string,
        field: 'product_img',
        value: React.ChangeEvent<HTMLInputElement>
    ) => {
            const file = value.target.files?.[0]
            if (!file) return;

            setError(null);

            if(file.size > 8 * 1024 * 1024){
                setError("File too large. Maximum size is 8MB.")
                return;
            }

            if (!["image/png", "image/jpeg"].includes(file.type)) {
                setError("Only PNG and JPEG images are allowed.");
                return;
            }
            const objectUrl = URL.createObjectURL(file);

            setVariant(prev =>
            prev.map(v =>
                v.fake_id === id
                    ? { ...v, [field]: objectUrl }
                    : v
            )
        );
    };

    const addVariant = () => {
        if (variant.length >= 20) return;
        setVariant(prev => [...prev, createEmptyVariant()]);
    };

    const removeVariant = (id: string) => {
        setVariant(prev => prev.filter(s => s.fake_id !== id));
    };

    const updateVariant = <K extends keyof ProductVariantType>
    (
      id: string,
      field: K,
      value: ProductVariantType[K]
    ) => {
      setVariant(prev =>
        prev.map(v =>
          v.fake_id === id ? { ...v, [field]: value } : v
        )
      );
    };

    return(     
        <Field>   
            <SellerContent>
                {/*  Products */}
                <Field orientation={'horizontal'}>
                    <FieldLabel>
                        Product Variant
                    </FieldLabel>
                        <Button 
                            variant={'outline'}
                            size={'sm'}
                            onClick={addVariant}
                            >
                                Add Variant
                        </Button>
                        <Button 
                            size={'sm'}
                            onClick={() => console.log(variant)}
                            >
                                Debug Variant
                        </Button>

                </Field>

                <Field>
                    <table
                    style={{
                        borderCollapse: 'separate',
                        borderSpacing: 'calc(var(--spacing)*3)'
                    }} 
                    className={s.productTable}>
                        <thead>
                            <tr style={{textAlign: "center"}}>
                                <td style={{width: "10%"}}>
                                    <FieldLabel>
                                        Image
                                    </FieldLabel>
                                </td>
                                <td style={{width: "30%"}}>
                                    <FieldLabel>
                                        Variant
                                    </FieldLabel>
                                </td>
                                <td style={{width: "20%"}}>
                                    <FieldLabel>
                                        SKU
                                    </FieldLabel>
                                </td>
                                <td style={{width: "15%"}}>
                                    <FieldLabel>
                                        Price
                                    </FieldLabel>
                                </td>
                                <td style={{width: "15%"}}>
                                    <FieldLabel>
                                        Stocks
                                    </FieldLabel>
                                </td>
                                <td style={{width: "10%"}}>
                                    <FieldLabel>
                                        Status
                                    </FieldLabel>
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            {variant.map((item) => (
                                <tr 
                                key={item.fake_id}
                                >
                                    <td style={{alignItems: 'center'}}>
                                        <FieldGroup className={s.productImg}>
                                            <FieldLabel htmlFor={`product-img-${item.fake_id}`}>
                                                <img src={item.product_img || "https://placehold.co/200"} alt="" />
                                            </FieldLabel>

                                            <Input
                                                type="file"
                                                id={`product-img-${item.fake_id}`}
                                                name="file"
                                                accept="image/png, image/jpeg"
                                                hidden
                                                onChange={(e) => {
                                                        handleImageChange(item.fake_id, 'product_img', e)
                                                    }}
                                                />
                                        </FieldGroup>
                                    </td>
                                    <td>
                                        <Field className={s.variantInputField}> 
                                            <Input
                                            value={item.variant_name}
                                            onChange={(e) =>
                                                updateVariant(item.fake_id, "variant_name", e.target.value)
                                            }
                                            placeholder="Variant name"/>
                                        </Field>
                                    </td>
                                    <td>
                                        <Field className={s.variantInputField}>
                                            <Input
                                            value={item.SKU}
                                            onChange={(e) =>
                                                updateVariant(item.fake_id, "SKU", e.target.value)
                                            } 
                                            placeholder="NB-PRODUCT-NAME"/>
                                        </Field>
                                    </td>
                                    {/* Price */}
                                    <td>
                                        <Field className={s.variantInputField}>
                                            <Input 
                                            value={item.price}
                                            onChange={(e) => {
                                                updateVariant(item.fake_id, "price", e.target.value)
                                            }}
                                            placeholder="10"/>
                                        </Field>
                                    </td>
                                    {/* Stock */}
                                    <td>
                                        <Field className={s.variantInputField}>
                                            <Input 
                                            value={item.stock}
                                            onChange={(e) => {
                                                updateVariant(item.fake_id, "stock", e.target.value)
                                            }}
                                            placeholder="10"/>
                                        </Field>
                                    </td>
                                    <td>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Field>
                                                    <Button
                                                    id={`status-${item.status}`}
                                                    variant={'outline'}
                                                    value={item.status}
                                                    >
                                                        {statusList.find(s => s.value === item.status)?.name}
                                                    </Button>
                                                </Field>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent>
                                                {statusList.map(option => (
                                                    <DropdownMenuItem
                                                    key={option.value}
                                                    onClick={() =>
                                                        updateVariant(item.fake_id, 'status', option.value)
                                                    }>
                                                        {option.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                    <td 
                                    style={{paddingLeft: 'calc(var(--spacing)*3)'}}>
                                        <Button 
                                        variant={'destructive'}
                                        onClick={() => removeVariant(item.fake_id)}
                                        >
                                            <Icon></Icon>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Field>


            </SellerContent>
            <VariantImageTable
                images_set={variant.map((v => ({
                    id: v.fake_id,
                    image_url: v.product_img
                })))}
            />
                
        </Field>
    )
}
type imageProp ={
    id: string
    image_url: string
}

type imageContainer = {
    images_set: imageProp[]
}
const VariantImageTable:React.FC<imageContainer> = ({
    images_set
}) => {
    return (
        <SellerContent>
            <Field>
                <Field orientation={'vertical'}>
                    <FieldLabel>Product Images Display</FieldLabel>
                    <FieldDescription>Click to preview image</FieldDescription>
                    <div>
                        <Button onClick={() => {console.log(images_set)}}>Images print</Button>
                    </div>
                </Field>
                <ul className={s.imageField}>
                    {images_set.map((item) => (
                        item.image_url ? (
                            <li key={item.id}
                            className={s.imgContainer}
                            >
                                        <img 
                                        src={item.image_url} 
                                        alt="" />
                            </li>
                        ):(
                            null
                        )
                    ))}
                </ul>
            </Field>
        </SellerContent>
    )
}