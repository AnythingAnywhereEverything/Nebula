import { NextPageWithLayout } from '../types/global.d';
import '@styles/global.scss';
import DefaultLayout from '@components/layouts/main-layouts/defaultLayout';
import { AppProps } from 'next/app';

import Head from 'next/head';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from 'next-themes';
import { queryClient } from '@/hooks/clientQuery';


type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

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

            {/* * Default SEO */}
            <meta name="description" content="Nebula — discover products and shops however you like." />

            {/* * Open Graph (Facebook / Discord / LinkedIn) */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Nebula" />
            <meta property="og:title" content="Nebula - Shop However You Like" />
            <meta property="og:description" content="Discover products, explore shops, and shop however you like with Nebula." />
            <meta property="og:url" content="https://nebula.zartexvertagen.com" />
            <meta property="og:image" content="https://nebula.zartexvertagen.com/banner.png" />
            <meta property="og:image:width" content="553" />
            <meta property="og:image:height" content="297" />

            {/* * Twitter (also used by some crawlers) */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Nebula - Shop However You Like" />
            <meta name="twitter:description" content="Discover products, explore shops, and shop however you like with Nebula." />
            <meta name="twitter:image" content="https://nebula.zartexvertagen.com/banner.png" />

          </Head>
          {getLayout(<Component {...pageProps} />)}
        </GoogleOAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;