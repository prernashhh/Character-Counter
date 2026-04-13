import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale =
    requestLocale && typeof requestLocale.then === "function"
      ? await requestLocale
      : requestLocale;

  const locale =
    requestedLocale && routing.locales.includes(requestedLocale)
      ? requestedLocale
      : routing.defaultLocale;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
