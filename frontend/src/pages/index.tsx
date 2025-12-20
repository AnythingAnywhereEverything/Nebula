import React from 'react';
import { ping } from '../api/ping';
import style from '../styles/home.module.scss';
import { NextPageWithLayout } from '../types/global.d';
import Head from 'next/head';


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
      <h1>Welcome to Nebula</h1>
      <p>{message}</p>
    </div>
  );
};

export default Home;
