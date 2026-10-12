import ContentFrame from "../components/ContentFrame";
import {
  GUIDE_MEDIA,
  guideMediaPath,
  type GuideMediaKey,
} from "../guideMedia";
import { PAGE_PATHS, translations, type Locale } from "../i18n";

const LINK_CLASS =
  "text-ivory underline decoration-ink-400 underline-offset-4 transition-colors hover:decoration-ivory";

type Props = {
  locale: Locale;
};

function Media({
  mediaKey,
  alt,
  locale,
}: {
  mediaKey: GuideMediaKey;
  alt: string;
  locale: Locale;
}) {
  const media = GUIDE_MEDIA[mediaKey];

  return (
    <div className="mx-auto w-full max-w-[18rem] overflow-hidden rounded-2xl border border-ink-700 bg-ink-800 sm:mx-0">
      <picture>
        {media.animated ? (
          <source
            media="(prefers-reduced-motion: reduce)"
            srcSet={guideMediaPath(mediaKey, locale, true)}
          />
        ) : null}
        <img
          className="block h-auto w-full"
          src={guideMediaPath(mediaKey, locale)}
          width={media.width}
          height={media.height}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </div>
  );
}

export default function GuidePage({ locale }: Props) {
  const t = translations[locale];

  return (
    <ContentFrame
      locale={locale}
      page="guide"
      title={t.guideTitle}
      backHref={PAGE_PATHS.roulette[locale]}
      backLabel={t.privacyBackLabel}
    >
      <main className="text-[0.9375rem] leading-[1.9] text-muted">
        <p className="max-w-[62ch]">{t.guideLead}</p>

        {t.guideSections.map((section) => (
          <section key={section.id} aria-labelledby={`guide-${section.id}`} className="mt-16">
            <h2 id={`guide-${section.id}`} className="text-xl font-black text-ivory">
              {section.title}
            </h2>
            <p className="mt-3 max-w-[62ch]">{section.intro}</p>

            <ol className="mt-8 space-y-12">
              {section.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_18rem] sm:gap-10"
                >
                  <div>
                    <h3 className="flex items-baseline gap-3 text-base font-bold text-ivory">
                      <span
                        aria-hidden="true"
                        className="text-sm font-black tabular-nums text-ink-400"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {step.title}
                    </h3>
                    {step.body.map((paragraph) => (
                      <p key={paragraph} className="mt-3">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <Media mediaKey={step.media} alt={step.alt} locale={locale} />
                </li>
              ))}
            </ol>

            <p className="mt-10 text-sm">
              <a
                href={PAGE_PATHS[section.id][locale]}
                className={LINK_CLASS}
              >
                {section.id === "order" ? t.guideOpenOrder : t.guideOpenRoulette}
                <span aria-hidden="true"> →</span>
              </a>
            </p>
          </section>
        ))}

        <section aria-labelledby="guide-tips" className="mt-16 max-w-[62ch]">
          <h2 id="guide-tips" className="text-xl font-black text-ivory">
            {t.guideTipsTitle}
          </h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 marker:text-ink-400">
            {t.guideTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="guide-faq" className="mt-16 max-w-[62ch]">
          <h2 id="guide-faq" className="text-xl font-black text-ivory">
            {t.guideFaqTitle}
          </h2>
          <dl className="mt-5 space-y-6">
            {t.guideFaq.map((item) => (
              <div key={item.q}>
                <dt className="font-bold text-ivory">{item.q}</dt>
                <dd className="mt-1.5">{item.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm">
            <a
              href="https://github.com/KeitaOsaki/deki-roulette/issues"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              {t.guideIssuesLabel}
            </a>
          </p>
        </section>
      </main>
    </ContentFrame>
  );
}
