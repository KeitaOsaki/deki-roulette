import LocaleNotice from "../components/LocaleNotice";
import LocaleSwitch from "../components/LocaleSwitch";
import { useLocaleSuggestion } from "../hooks/useLocaleSuggestion";
import { PAGE_PATHS, translations, type Locale } from "../i18n";

type Section = {
  heading: string;
  body: readonly string[];
  link?: { label: string; href: string };
};

type Props = {
  locale: Locale;
};

export default function PrivacyPage({ locale }: Props) {
  const suggestedLocale = useLocaleSuggestion(locale);
  const t = translations[locale];
  const sections: readonly Section[] = t.privacySections;

  return (
    <div className="min-h-screen bg-ink-900 font-sans text-ivory">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-5 py-10 sm:px-8">
        {suggestedLocale !== null ? (
          <LocaleNotice locale={suggestedLocale} page="privacy" />
        ) : null}

        <header className="mb-12 flex flex-col-reverse gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h1 className="shrink-0 text-[2.1rem] font-black leading-none tracking-[-0.035em] sm:text-[2.6rem]">
            {t.privacyTitle}
          </h1>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <a
              href={PAGE_PATHS.roulette[locale]}
              className="rounded-full border border-ink-700 bg-ink-800 px-3.5 py-[0.4375rem] text-xs font-bold text-muted transition-colors hover:border-ivory/40 hover:text-ivory"
            >
              <span aria-hidden="true">← </span>
              {t.privacyBackLabel}
            </a>
            <LocaleSwitch locale={locale} page="privacy" />
          </div>
        </header>

        <main className="max-w-[62ch] text-sm leading-relaxed text-muted">
          <p>{t.privacyIntro}</p>
          {sections.map((section) => (
            <section key={section.heading} className="mt-9">
              <h2 className="text-base font-bold text-ivory">
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-2.5">
                  {paragraph}
                </p>
              ))}
              {section.link !== undefined ? (
                <p className="mt-2.5">
                  <a
                    href={section.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ivory underline decoration-ink-400 underline-offset-4 transition-colors hover:decoration-ivory"
                  >
                    {section.link.label}
                  </a>
                </p>
              ) : null}
            </section>
          ))}
          <p className="mt-12">{t.privacyEstablished}</p>
        </main>

        <footer className="mt-16 border-t border-ink-700 pt-8 sm:mt-24">
          <p className="pb-2 text-xs text-muted">&copy; 2026 basekeita</p>
        </footer>
      </div>
    </div>
  );
}
