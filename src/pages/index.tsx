import React from "react";

import Head from "next/head";
import { Layout, Container } from "~/components";
import type { NextPageWithLayout } from "~/types/common.types";

import Main from "~/views/Main/Main.view";
import playlistData from "~/data/playlistsData.json";
import { ModelWithId } from "~/models/Playlist.model";
import dbConnect from "~/libraries/mongoose.library";
import { getPlaylists } from "~/libraries/api.library";
import { InferGetStaticPropsType } from "next";

export const getStaticProps = async () => {
  await dbConnect();
  const limit = 0;
  const data = await getPlaylists(limit);

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      limit,
      fallbackData: {
        data,
      },
    },
    revalidate: 60,
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Index: NextPageWithLayout<Props> = ({ fallbackData, limit }) => {
  return (
    <>
      <Head>
        <title>DaftAcademy - WebApp 2022</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <Main items={playlistData as Array<ModelWithId>} />
      </Container>
    </>
  );
};

export default Index;

Index.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};
