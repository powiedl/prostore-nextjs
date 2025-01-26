const locale = process.env.DEFAULT_LOCALE || 'de-AT';
//new Intl.NumberFormat().resolvedOptions().locale; // gets the locale string from the server (en-US at vercel)
function getSeparator(locale: string, separatorType: string) {
  const numberWithGroupAndDecimalSeparator = 1000.1;
  return Intl.NumberFormat(locale)
    ?.formatToParts(numberWithGroupAndDecimalSeparator)
    ?.find((part) => part.type === separatorType)?.value;
}

export const format = {
  locale,
  decimal: getSeparator(locale, 'decimal'),
  group: getSeparator(locale, 'group'),
};
