import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  defaultLocale: "it",
  locales: ["it", "en"],
  localePrefix: "always",
});
