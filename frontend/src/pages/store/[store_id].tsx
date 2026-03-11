
import { ProductSearchResponse, searchProductDatas } from "@/api/search";
import AdvanceFilter from "@components/features/search/advanceFilter";
import FilterBar from "@components/features/search/filterBar";
import { Button, ButtonGroup, Field, FieldDescription, FieldGroup, Icon, ProductContainer, ProductContainerDescription, ProductContainerHeader, ProductContainerHeaderAddon, ProductContainerHeaderGroup, ProductContainerTitle, ProductField, ProductHeader, Separator } from "@components/ui/NebulaUI";
import s from "@styles/store.module.scss"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Store() {
    const router = useRouter()

    const { store_id } = router.query;

    const searchParams = useSearchParams();

    const query = searchParams.get('q');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const rating = searchParams.get('rating');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');

    const [result, setResult] = useState<ProductSearchResponse>();

    useEffect(() => {
        if (typeof store_id !== "string") return

        const load = async () => {
            const data = await searchProductDatas(
                query,
                page,
                limit,
                rating,
                min_price,
                max_price,
                store_id
            )
            setResult(data)
            console.log(data)
        }

        load()
    }, [query, page, limit, rating, min_price, max_price, store_id])

    if (typeof store_id !== "string") return null
    
    return (
        <div className={s.pageContainer}>
            <FieldGroup>
                <StoreHeader />
                <Separator />
                <Field className={s.allItems} orientation={"horizontal"}>
                
                    <AdvanceFilter/>
                    <Field>
                        <FilterBar page={result?.page || 0} totalPages={result?.total_pages || 1}/>
                        <ProductField item_display={result?.data || []} max_rows={10}/>
                    </Field>
                </Field>
            </FieldGroup>
        </div>
    );
}

function StoreHeader(): React.ReactNode {
    return (
        <Field>
            <Field className={s.storeBanner}>
                <img src="https://placehold.co/2700x1000" alt="" />
            </Field>
            <Field className={s.storeDetail} orientation={"horizontal"}>
                <Field className={s.left} orientation={"horizontal"}>
                    <div className={s.profile}>
                        <img src="https://placehold.co/175" alt="" />
                    </div>
                    <div className={s.profileSeparator} />
                    <Field>
                        <h1>Store's Name</h1>
                        <FieldDescription>
                            Active XX minutes ago.
                        </FieldDescription>
                        <ButtonGroup>
                            <ButtonGroup>
                                <Button className={s.iconWithin} size={"sm"}><Icon></Icon>Follow</Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button className={s.iconWithin} size={"sm"}><Icon></Icon>Share</Button>
                            </ButtonGroup>
                        </ButtonGroup>
                    </Field>
                </Field>
                <div className={s.reputation}>
                    <Field orientation={"horizontal"} className={s.reputationDetail}>
                        <Icon className={s.repuIcon}></Icon>
                        Products:
                        <span className={s.highlight}>120</span>
                    </Field>
                    <Field orientation={"horizontal"} className={s.reputationDetail}>
                        <Icon className={s.repuIcon}></Icon>
                        Followers:
                        <span className={s.highlight}>1.2k</span>
                    </Field>
                    <Field orientation={"horizontal"} className={s.reputationDetail}>
                        <Icon className={s.repuIcon}></Icon>
                        Rating:
                        <span className={s.highlight}>4.7 (1.6k Rating)</span>
                    </Field>
                    <Field orientation={"horizontal"} className={s.reputationDetail}>
                        <Icon className={s.repuIcon}></Icon>
                        Joined:
                        <span className={s.highlight}>8 years ago</span>
                    </Field>
                </div>
            </Field>
        </Field>
    )
}