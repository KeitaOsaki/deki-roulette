import ContentFrame from "../components/ContentFrame";
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
  const t = translations[locale];
  const sections: readonly Section[] = t.privacySections;

  return (
    <ContentFrame
      locale={locale}
      page="privacy"
      title={t.privacyTitle}
      backHref={PAGE_PATHS.roulette[locale]}
      backLabel={t.privacyBackLabel}
    >
      <main className="max-w-[62ch] text-sm leading-relaxed text-muted">
        <p>{t.privacyIntro}</p>
        {sections.map((section) => (
          <section key={section.heading} className="mt-9">
            <h2 className="text-base font-bold text-ivory">{section.heading}</h2>
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
    </ContentFrame>
  );
}
