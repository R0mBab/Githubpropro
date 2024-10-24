// pages/_app.tsx
import type { AppProps } from "next/app";
import { useState } from "react";
import { IntlProvider } from "react-intl";
import translations from "../translations.json";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const [locale, setLocale] = useState("en");

  return (
    <IntlProvider
      messages={translations[locale]}
      locale={locale}
      defaultLocale="en"
    >
      <Component {...pageProps} locale={locale} setLocale={setLocale} />
    </IntlProvider>
  );
}

export default MyApp;
