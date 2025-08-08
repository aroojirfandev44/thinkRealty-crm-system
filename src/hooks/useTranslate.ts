// hooks/useTranslate.ts
import { useSelector } from 'react-redux'
import type { RootState } from '../Store/Store'
import { translations } from '../types/translation'


export const useTranslate = () => {
  const lang = useSelector((state: RootState) => state.landingPage.contentPersonalization.language)
  const t = translations[lang] || translations.en
  return t
}
