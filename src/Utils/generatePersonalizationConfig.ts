import type { Unit, Project, Area, PersonalizationConfig } from '../types'

export const generatePersonalizationConfig = (
  selectedUnits: Unit[],
  project: Project,
  area: Area
): PersonalizationConfig => {
  const config: PersonalizationConfig = {
    language: area.area_name_ar.includes('دبي') ? 'ar' : 'en',
    currency: 'AED',
    theme: 'light',
    focus: [] // NEW: add focus types like ['investment', 'family', 'luxury']
  }

  if (selectedUnits.length === 0) return config

// 1. Investment Focus
const studioOr1BRCount = selectedUnits.filter(
    u => u.property_type === 'studio' || u.bedrooms === 1
  ).length
  
  const studioOr1BRRatio = studioOr1BRCount / selectedUnits.length
  if (studioOr1BRRatio > 0.6) {
    config.focus.push('investment')
  }
  

  // 2. Family Focus
  const familyUnits = selectedUnits.filter(u => u.bedrooms > 2).length
  const familyRatio = familyUnits / selectedUnits.length
  if (familyRatio > 0.5) {
    config?.focus.push('family')
  }

  // 3. Luxury Focus
  const avgPricePerSqft =
    selectedUnits.reduce((sum, u) => sum + u.price / u?.area_sqft
    , 0) / selectedUnits.length
   
  if (avgPricePerSqft > 1200) {
    config?.focus.push('luxury')
  }

  return config
}
