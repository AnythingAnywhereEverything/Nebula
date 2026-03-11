import { ProductSearchResponse, searchProductDatas } from "@/api/search";
import { getCurrentShopInfo, getShopTotalProducts, Shop } from "@/api/shop";
import AdvanceFilter from "@components/features/search/advanceFilter";
import FilterBar from "@components/features/search/filterBar";
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Field,
    FieldDescription,
    FieldGroup,
    Icon,
    Input,
    ProductField,
    Separator,
} from "@components/ui/NebulaUI";
import { timeAgo } from "@lib/utils";
import s from "@styles/store.module.scss";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Store() {
    const router = useRouter();

    const { store_id } = router.query;

    const searchParams = useSearchParams();

    const query = searchParams.get("q");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const rating = searchParams.get("rating");
    const min_price = searchParams.get("min_price");
    const max_price = searchParams.get("max_price");

    const [result, setResult] = useState<ProductSearchResponse>();

    const BASE_SHOP: Shop = {
        id: "",
        name: "",
        description: "",
        owner_id: "",
        is_brand: false,
        created_at: "",
        updated_at: "",
        shop_profile_url: "",
        shop_banner_url: "",
        rating: "0",
        review_amount: "0",
    };

    const [shop, setShop] = useState<Shop>(BASE_SHOP);

    useEffect(() => {
        if (typeof store_id !== "string") return;

        const load = async () => {
            const data = await searchProductDatas(
                query,
                page,
                limit,
                rating,
                min_price,
                max_price,
                store_id,
            );
            setResult(data);
            console.log(data);
        };

        load();
    }, [query, page, limit, rating, min_price, max_price, store_id]);

    useEffect(() => {
        if (typeof store_id !== "string") return;
        const load = async () => {
            const data = await getCurrentShopInfo(store_id);
            console.log(data);
            setShop(data);
        };

        load();
    }, [store_id]);

    if (typeof store_id !== "string") return null;

    return (
        <div className={s.pageContainer}>
            <FieldGroup>
                <StoreHeader {...shop} />
                <Separator />
                <Field className={s.allItems} orientation={"horizontal"}>
                    <AdvanceFilter />
                    <Field>
                        <FilterBar
                            page={result?.page || 0}
                            totalPages={result?.total_pages || 1}
                        />
                        <ProductField
                            item_display={result?.data || []}
                            max_rows={10}
                        />
                    </Field>
                </Field>
            </FieldGroup>
        </div>
    );
}

function StoreHeader(store: Shop) {
    const banner = store.shop_banner_url
        ? `/cdn/${store.shop_banner_url}`
        : "/default/placeholder.png";

    const profile = store.shop_profile_url
        ? `/cdn/${store.shop_profile_url}`
        : "/default/placeholder.png";

    const [totalProd, setTotalProd] = useState(0)

    useEffect(() => {
        const load = async () => {
            const data = await getShopTotalProducts(store.id);
            console.log(data);
            setTotalProd(data);
        };

        load();
    }, [store.id]);

    return (
        <Field>
            <Field className={s.storeBanner}>
                <Image
                    src={banner}
                    alt="store banner"
                    width={3840}
                    height={1240}
                />
            </Field>

            <Field className={s.storeDetail} orientation={"horizontal"}>
                <Field className={s.left} orientation={"horizontal"}>
                    <div className={s.profile}>
                        <Image
                            src={profile}
                            alt="store profile"
                            fill
                            sizes="175px"
                            style={{ objectFit: "cover" }}
                        />
                    </div>

                    <div className={s.profileSeparator} />

                    <Field>
                        <h1>{store.name}</h1>

                        <FieldDescription>{store.description}</FieldDescription>

                        <ButtonGroup>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className={s.iconWithin} size={"sm"}>
                                        <Icon></Icon>
                                        Share
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Share Store</DialogTitle>
                                        <DialogDescription>
                                            Copy this link to share the store.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <Field orientation={"horizontal"}>
                                        <Input
                                            readOnly
                                            value={typeof window !== "undefined" ? window.location.href : ""}
                                        />
                                        <Button
                                            size={"sm"}
                                            onClick={() => navigator.clipboard.writeText(window.location.href)}
                                        >
                                            Copy
                                        </Button>
                                    </Field>
                                </DialogContent>
                            </Dialog>
                        </ButtonGroup>
                    </Field>
                </Field>

                <div className={s.reputation}>
                    <Field
                        orientation={"horizontal"}
                        className={s.reputationDetail}
                    >
                        <Icon className={s.repuIcon}></Icon>
                        Products:
                        <span className={s.highlight}>{totalProd}</span>
                    </Field>

                    <Field
                        orientation={"horizontal"}
                        className={s.reputationDetail}
                    >
                        <Icon className={s.repuIcon}></Icon>
                        Rating:
                        <span className={s.highlight}>
                            {store.rating} ({store.review_amount} Rating)
                        </span>
                    </Field>

                    <Field
                        orientation={"horizontal"}
                        className={s.reputationDetail}
                    >
                        <Icon className={s.repuIcon}></Icon>
                        Joined:
                        <span className={s.highlight}>{timeAgo(store.created_at)}</span>
                    </Field>
                </div>
            </Field>
        </Field>
    );
}
