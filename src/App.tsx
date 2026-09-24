import OrderPage from "./pages/OrderPage";
import PrivacyPage from "./pages/PrivacyPage";
import RoulettePage from "./pages/RoulettePage";
import type { Locale, Page } from "./i18n";

type Props = {
  /** URL から決まる表示言語とページ。プリレンダ時は window を読めないので外から渡す。 */
  locale: Locale;
  page: Page;
};

export default function App({ locale, page }: Props) {
  switch (page) {
    case "order":
      return <OrderPage locale={locale} />;
    case "privacy":
      return <PrivacyPage locale={locale} />;
    case "roulette":
      return <RoulettePage locale={locale} />;
  }
}
