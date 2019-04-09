import logger from 'loglevel'
import i18next from 'i18next'
import { utils as kCoreUtils } from '@kalisio/kdk-core/client'
import { loadTranslation } from '../utils'

export async function configureI18n () {
  // Defines the modules to be loaded
  const modules = ['kCore', 'app']
  try {
    // Define the locale to be used
    const localeConfig = config.locale || {}
    const localeBrowser = kCoreUtils.getLocale()
    let locale = localeConfig.default || localeBrowser
    // Initializes i18next
    i18next.init({
      lng: locale,
      fallbackLng: localeConfig.fallback || 'en',
      defaultNS: ['kdk']
    })
    // Build the translation resolvers
    const translationResolvers = modules.map(module => {
      return loadTranslation(module, locale)
    })
    // Apply the resolvers and add the translation bundles to i18next
    let translations = await Promise.all(translationResolvers)
    translations.forEach((translation) => {
      i18next.addResourceBundle(locale, 'kdk', translation, true, true)
    })
  } catch (error) {
    logger.error(error.message)
  }
}
