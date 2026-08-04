export const locales = ['zh', 'en', 'ja', 'ko']
export const defaultLocale = 'zh'

export const localeNames = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
}

export function t(field, locale) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[locale] || field['en'] || field['zh'] || Object.values(field)[0] || ''
}
