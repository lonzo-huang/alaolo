export const locales = ['zh', 'en', 'ja', 'ko', 'de', 'fr', 'nl', 'es', 'it', 'ru']
export const defaultLocale = 'zh'

export const localeNames = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  de: 'Deutsch',
  fr: 'Français',
  nl: 'Nederlands',
  es: 'Español',
  it: 'Italiano',
  ru: 'Русский',
}

export const localeFlags = {
  zh: '🇨🇳', en: '🇺🇸', ja: '🇯🇵', ko: '🇰🇷',
  de: '🇩🇪', fr: '🇫🇷', nl: '🇳🇱', es: '🇪🇸', it: '🇮🇹', ru: '🇷🇺',
}

export function t(field, locale) {
  if (!field) return ''
  if (typeof field === 'string') return field
  return field[locale] || field['en'] || field['zh'] || Object.values(field)[0] || ''
}
