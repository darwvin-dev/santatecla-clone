import { NextIntlClientProvider } from "next-intl";
import { Manrope } from "next/font/google";
import {notFound} from 'next/navigation';

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata = {
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export function generateStaticParams() {
  return [{ locale: "it" }, { locale: "en" }];
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: "it" | "en" };
}) {
  const messages = await getMessages(locale);
  if (!messages) notFound();
  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://code.jquery.com/ui/1.12.0/themes/smoothness/jquery-ui.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Google+Sans:400,500,700|Google+Sans+Text:400,500,700&lang=en"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Google+Sans+Text:400&text=%E2%86%90%E2%86%92%E2%86%91%E2%86%93&lang=en"
        />
      </head>
      <body
        className={`archive post-type-archive post-type-archive-apartment ${manrope.variable}`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
