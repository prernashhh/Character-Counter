import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Home from "./[locale]/page";

export default async function RootPage() {
  const locale = "en";
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <Home />
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
