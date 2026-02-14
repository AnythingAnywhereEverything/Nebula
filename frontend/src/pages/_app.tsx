import { NextPageWithLayout } from '../types/global.d';
import '@styles/global.scss';
import DefaultLayout from '@components/layouts/main-layouts/defaultLayout';
import { AppProps } from 'next/app';

import Head from 'next/head';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from 'next-themes';


type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider themes={["light", "dark", "midnight"]} attribute={"data-theme"}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <Head>
            <title>Nebula - Shop However You Like</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <link rel="apple-touch-icon" href="/logo192.png" />
            <link rel="manifest" href="/manifest.json" />
          </Head>
          {getLayout(<Component {...pageProps} />)}
        </GoogleOAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;