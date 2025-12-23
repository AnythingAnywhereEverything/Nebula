import React from 'react';
import { ping } from '../api/ping';
import style from '../styles/home.module.scss';
import { NextPageWithLayout } from '../types/global.d';
import Head from 'next/head';
import PromotionPanel from '@components/features/home/promotionPanel';
import OptionPanel from '@components/features/home/optionDeals';
import CategoryPanel from '@components/features/home/categoryPanel';


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
      <OptionPanel/>
      <CategoryPanel/>
    </div>
  );
};

export default Home;
