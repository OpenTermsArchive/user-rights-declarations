const HELP_CENTRE_LOCALES = [
  'ar', 'bg', 'cs', 'de', 'el', 'en', 'es', 'et', 'fr', 'hr',
  'id', 'it', 'ja', 'ko', 'lt', 'lv', 'ms', 'nl', 'pl', 'pt',
  'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'vi', 'zh',
];

const MONTH_FORMATS = [
  { month: 'long' },
  { day: 'numeric', month: 'long' },
  { year: 'numeric', month: 'long' },
];

const ENGLISH_MONTH = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  timeZone: 'UTC',
});

const MONTH_BY_NAME = new Map();

for (const locale of HELP_CENTRE_LOCALES) {
  for (const options of MONTH_FORMATS) {
    const formatter = new Intl.DateTimeFormat(locale, {
      ...options,
      calendar: 'gregory',
      timeZone: 'UTC',
    });

    for (let month = 0; month < 12; month++) {
      const parts = formatter.formatToParts(new Date(Date.UTC(2000, month, 15)));
      const name = parts.find(part => part.type === 'month').value.toLowerCase();

      if (!MONTH_BY_NAME.has(name)) {
        MONTH_BY_NAME.set(name, month);
      } else if (MONTH_BY_NAME.get(name) !== month) {
        // A name meaning different months across locales, such as "listopad", cannot be resolved and must remain so
        MONTH_BY_NAME.set(name, null);
      }
    }
  }
}

function findMonth(date) {
  const words = date.toLowerCase().split(/[\s\d\p{P}]+/u).filter(Boolean);

  for (const word of words) {
    const month = MONTH_BY_NAME.get(word);

    if (Number.isInteger(month)) {
      return month;
    }
  }

  // Some locales write the month as a number, such as Korean "2026 년 1 월"; a day up to 12 would add a second candidate and is rejected
  const numbers = (date.match(/\d+/g) || []).map(Number);
  const candidates = numbers.filter(number => number >= 1 && number <= 12);

  if (candidates.length === 1) {
    return candidates[0] - 1;
  }

  return undefined;
}

// Before hydration, the help centre renders the month in a random language
export function normalizeLastUpdatedMonth(document) {
  document.querySelectorAll('.article_wrapper_slug_updated_time').forEach(element => {
    const match = element.textContent.match(/^\s*(.*?:)\s*(.*?)\s*$/s);

    if (!match) {
      return;
    }

    const [ , label, date ] = match;
    const year = date.match(/\b\d{4}\b/)?.[0];
    const month = findMonth(date);

    if (!year || month === undefined) {
      return;
    }

    element.textContent = `${label} ${ENGLISH_MONTH.format(new Date(Date.UTC(Number(year), month, 1)))}`;
  });
}
