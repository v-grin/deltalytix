"use client"
import { createI18nClient } from 'next-international/client'

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } = createI18nClient({
  en: () => import('./en'),
  'en-US': () => import('./en'),
  'en-GB': () => import('./en'),
  fr: () => import('./fr'),
  'fr-FR': () => import('./fr'),
  // Alias Russian locale to English to avoid runtime crashes on stale `/ru` links/cookies.
  ru: () => import('./en'),
  'ru-RU': () => import('./en'),
})
