import { NextPageWithLayout } from '../types/global.d';
import '@styles/global.scss';
import DefaultLayout from '../components/layouts/default';
import { AppProps } from 'next/app';

import { UAParser } from 'ua-parser-js';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;