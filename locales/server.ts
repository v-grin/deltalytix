import { createI18nServer, setStaticParamsLocale } from 'next-international/server'

const serverI18n = createI18nServer({
  en: () => import('./en'),
  'en-US': () => import('./en'),
  'en-GB': () => import('./en'),
  fr: () => import('./fr'),
  'fr-FR': () => import('./fr'),
  // Alias Russian locale to English to avoid runtime crashes on stale `/ru` links/cookies.
  ru: () => import('./en'),
  'ru-RU': () => import('./en'),
})

const isInvalidLocaleRuntimeError = (error: unknown) => {
  if (!(error instanceof TypeError)) {
    return false
  }

  const message = String(error.message || '')
  return message.includes('a[d] is not a function')
}

export const getI18n = async () => {
  try {
    return await serverI18n.getI18n()
  } catch (error) {
    if (!isInvalidLocaleRuntimeError(error)) {
      throw error
    }

    setStaticParamsLocale('en')
    return await serverI18n.getI18n()
  }
}

export const getScopedI18n = async (scope: string) => {
  try {
    return await serverI18n.getScopedI18n(scope)
  } catch (error) {
    if (!isInvalidLocaleRuntimeError(error)) {
      throw error
    }

    setStaticParamsLocale('en')
    return await serverI18n.getScopedI18n(scope)
  }
}

export const getCurrentLocale = async () => {
  try {
    return await serverI18n.getCurrentLocale()
  } catch (error) {
    if (!isInvalidLocaleRuntimeError(error)) {
      throw error
    }

    return 'en'
  }
}

// Keep SSG limited to locales that actually have localized content directories.
export const getStaticParams = () => [{ locale: 'en' }, { locale: 'fr' }]
