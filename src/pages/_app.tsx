import React from "react";
import type { AppProps } from "next/app";
import { PlayerProvider } from "~/contexts/player.context";
import { NextPageWithLayout } from "~/types/common.types";
import { SessionProvider } from "next-auth/react";

import "~/styles/globals.css";

type Props = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: Props) {
  const withLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <PlayerProvider>
          {withLayout(<Component {...pageProps} />)}
        </PlayerProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
