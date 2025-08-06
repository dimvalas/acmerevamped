import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <title>ACME - Revamped by dimvalas</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="A revamped ACME-style webstore" />
            </Head>
            <body className="antialiased">
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}