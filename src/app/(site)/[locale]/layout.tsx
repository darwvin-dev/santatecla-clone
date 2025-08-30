import { NextIntlClientProvider } from "next-intl";
import { Manrope } from "next/font/google";
import Head from "next/head";
import { notFound } from "next/navigation";
import React from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export function generateStaticParams() {
  return [{ locale: "it" }, { locale: "en" }];
}

async function getMessages(locale: string) {
  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.error("Error loading messages:", error);
    return null;
  }
}

export default async function RootLayout(props: { children: React.ReactNode; params: Promise<{ locale: "it" | "en" }> }) {
  const { children, params } = props;
  const { locale } = await params;

  const messages = await getMessages(locale);
  if (!messages) notFound();

  return (
    <html lang={locale}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Your website description" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />

        {/* Favicon Links */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* External stylesheets */}
        <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Google+Sans:wght@400;500;700&display=swap"
        />

      </Head>
      <body className={`archive post-type-archive post-type-archive-apartment ${manrope.variable}`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
