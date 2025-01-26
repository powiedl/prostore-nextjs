const locale = new Intl.NumberFormat().resolvedOptions().locale;
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
