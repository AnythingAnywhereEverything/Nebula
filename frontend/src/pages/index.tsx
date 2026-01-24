import React from 'react';
import { ping } from '../api/ping';
import style from '@styles/home.module.scss';
import { NextPageWithLayout } from '../types/global.d';
import Head from 'next/head';
import PromotionPanel from '@components/features/home/promotionPanel';
import OptionPanel from '@components/features/home/optionDeals';
import CategoryPanel from '@components/features/home/categoryPanel';
import DiscoveryProduct from '@components/features/home/discovery';
import AboutThisWeb from '@components/features/home/aboutThisWeb';
import NebulaProductDisplay from '@components/ui/NebulaProductDisplay';

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
      <OptionPanel/>
      <DiscoveryProduct/>
      <div className={style.bottomContainer}>
        <NebulaProductDisplay 
              title="Your Broswing History" 
              max_rows={1} 
              type={"customLink"} 
              link="/browsingHistory"
              text="View or edit browsing history"/>
      </div>
      <AboutThisWeb/>
    </div>
  );
};

export default Home;
