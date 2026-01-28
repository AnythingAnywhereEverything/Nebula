import React from 'react';
import { ping } from '../api/ping';
import style from '@styles/home.module.scss';
import { NextPageWithLayout } from '../types/global.d';
import Head from 'next/head';
import PromotionPanel from '@components/features/home/promotionPanel';
import CategoryPanel from '@components/features/home/categoryPanel';
import AboutThisWeb from '@components/features/home/aboutThisWeb';
import { ProductContainer, ProductContainerDescription, ProductContainerHeader, ProductContainerHeaderAddon, ProductContainerHeaderGroup, ProductContainerTitle, ProductField } from '@components/ui/Nebula/product-field';
import { Button, Separator } from '@components/ui/NebulaUI';
import Link from 'next/link';

const Home: NextPageWithLayout = () => {
  const [message, setMessage] = React.useState('Pinging...');

  React.useEffect(() => {
    async function fetchPing() {
      try {
        const res = await ping();
        setMessage(res);
      } catch (err) {
        console.error(err);
        setMessage('API failed');
      }
    }
    fetchPing();
  }, []);

  return (
    <div className={style.homeContainer}>
        <Head>
            <title>Nebula - Shop However You Like</title>
        </Head>
        <PromotionPanel/>
        <CategoryPanel/>
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
                <ProductField max_rows={1}/>
            </ProductContainer>
            
            <ProductContainer>
                <ProductContainerHeader>
                    <ProductContainerHeaderGroup> 
                        <ProductContainerTitle>
                            Shop gifts by price
                        </ProductContainerTitle>
                        <ProductContainerDescription>
                            Search the gifts for cheap price.
                        </ProductContainerDescription>
                    </ProductContainerHeaderGroup>
                    <ProductContainerHeaderAddon>
                        <Button variant={"ghost"}>Show more</Button>
                    </ProductContainerHeaderAddon>
                </ProductContainerHeader>
                <ProductField max_rows={1}/>
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
            <ProductField max_rows={1}/>
        </ProductContainer>


        <ProductContainer>
            <ProductContainerHeader className={style.discoveryHeader}>
                <ProductContainerTitle>
                    Discovery
                </ProductContainerTitle>
            </ProductContainerHeader>
            <ProductField max_rows={5}/>
            <ProductContainerHeaderAddon>
                <Button size={"lg"} asChild>
                    <Link href={"/discovery"}>Show more</Link>
                </Button>
            </ProductContainerHeaderAddon>
        </ProductContainer>

        <Separator />

        <ProductContainer>
            <ProductContainerHeader>
                <ProductContainerTitle>
                    Your Broswing History
                </ProductContainerTitle>
                <ProductContainerHeaderAddon>
                    <Button variant={"ghost"} asChild>
                        <Link href={"/browsingHistory"}>
                            View or edit browsing history
                        </Link>
                    </Button>
                </ProductContainerHeaderAddon>
            </ProductContainerHeader>
            <ProductField max_rows={1}/>
        </ProductContainer>

        <Separator />

        <AboutThisWeb/>
    </div>
  );
};

export default Home;
