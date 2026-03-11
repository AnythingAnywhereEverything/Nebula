import React, { useEffect, useState } from "react";
import { ping } from "../api/ping";
import style from "@styles/home.module.scss";
import { NextPageWithLayout } from "../types/global.d";
import PromotionPanel from "@components/features/home/promotionPanel";
import AboutThisWeb from "@components/features/home/aboutThisWeb";
import {
    ProductContainer,
    ProductContainerDescription,
    ProductContainerHeader,
    ProductContainerHeaderAddon,
    ProductContainerHeaderGroup,
    ProductContainerTitle,
    ProductField,
} from "@components/ui/Nebula/product-field";
import { Button, Separator } from "@components/ui/NebulaUI";
import Link from "next/link";
import { ProductDatas, searchProductDatas } from "@/api/search";

const Home: NextPageWithLayout = () => {

    const [gifts, setGifts] = useState<ProductDatas[]>([]);
    const [holiday, setHoliday] = useState<ProductDatas[]>([]);
    const [seasonal, setSeasonal] = useState<ProductDatas[]>([]);

    const [discovery, setDiscovery] = useState<ProductDatas[]>([]);

    useEffect(() => {
        async function load() {
            const gifts = await searchProductDatas("gift", "0", "10");
            setGifts(gifts.data);

            const holiday = await searchProductDatas("holiday", "0", "10");
            setHoliday(holiday.data);

            const seasonal = await searchProductDatas("seasonal", "0", "10");
            setSeasonal(seasonal.data);

            const discovery = await searchProductDatas(undefined, "0", "25");
            setDiscovery(discovery.data);
        }

        load();
    }, []);

    return (
        <div className={style.homeContainer}>
            <PromotionPanel />
            <div className={style.giftsContainer}>
                <ProductContainer>
                    <ProductContainerHeader>
                        <ProductContainerHeaderGroup>
                            <ProductContainerTitle>
                                Shop gifts for someone
                            </ProductContainerTitle>
                            <ProductContainerDescription>
                                Search the gifts for someone you like.
                            </ProductContainerDescription>
                        </ProductContainerHeaderGroup>
                        <ProductContainerHeaderAddon>
                            <Button variant={"ghost"}>Show more</Button>
                        </ProductContainerHeaderAddon>
                    </ProductContainerHeader>
                    <ProductField item_display={gifts} max_rows={1} />
                </ProductContainer>

                <ProductContainer>
                    <ProductContainerHeader>
                        <ProductContainerHeaderGroup>
                            <ProductContainerTitle>
                                Shop holiday products
                            </ProductContainerTitle>
                            <ProductContainerDescription>
                                Search the holiday product for someone you like.
                            </ProductContainerDescription>
                        </ProductContainerHeaderGroup>
                        <ProductContainerHeaderAddon>
                            <Button variant={"ghost"}>Show more</Button>
                        </ProductContainerHeaderAddon>
                    </ProductContainerHeader>
                    <ProductField item_display={holiday} max_rows={1} />
                </ProductContainer>
            </div>

            <ProductContainer>
                <ProductContainerHeader>
                    <ProductContainerHeaderGroup>
                        <ProductContainerTitle>
                            Seasonal products
                        </ProductContainerTitle>
                        <ProductContainerDescription>
                            Search the seasonal items for your holiday!
                        </ProductContainerDescription>
                    </ProductContainerHeaderGroup>
                    <ProductContainerHeaderAddon>
                        <Button variant={"ghost"}>Show more</Button>
                    </ProductContainerHeaderAddon>
                </ProductContainerHeader>
                <ProductField item_display={seasonal} max_rows={1} />
            </ProductContainer>

            <ProductContainer>
                <ProductContainerHeader className={style.discoveryHeader}>
                    <ProductContainerTitle>Discovery</ProductContainerTitle>
                </ProductContainerHeader>
                <ProductField item_display={discovery} max_rows={5} />
                <ProductContainerHeaderAddon>
                    <Button size={"lg"} asChild>
                        <Link href={"/discovery"}>Show more</Link>
                    </Button>
                </ProductContainerHeaderAddon>
            </ProductContainer>

            <Separator />

            <AboutThisWeb />
        </div>
    );
};

export default Home;
