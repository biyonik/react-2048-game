import Board from "@/components/board";
import Head from "next/head";
import React from "react";

export default function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>2048 Game with React</title>
        <meta name="description" content="2048 Game with React and NextJS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Board />
      </main>
    </React.Fragment>
  );
}
