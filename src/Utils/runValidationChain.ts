import type { Unit, Project, ValidationReport } from '../types'
import { mockUnits } from '../data/data'

export const runValidationChain = (
  selectedUnits: Unit[],
  project: Project,
  t: any // Injected translation object
): ValidationReport[] => {
  if (!project || selectedUnits.length === 0) return []

  const totalSelectedArea = selectedUnits.reduce((sum, u) => sum + u.area_sqft, 0)
  const averageUnitArea = totalSelectedArea / selectedUnits.length
  const assumedCommonArea = averageUnitArea * project.total_units * 0.2
  const maxAllowedArea = assumedCommonArea * 1.2

  const luxuryUnits = selectedUnits.filter(
    u => u.has_balcony && u.has_parking && u.bedrooms >= 4
  )

  const violations: ValidationReport[] = []

  // 🧮 Area ratio rule
  const areaPassed = totalSelectedArea <= maxAllowedArea
  violations.push({
    rule: t.areaRatioRule || 'Total selected area vs. common area (max 1.2x)',
    passed: areaPassed,
    riskLevel: areaPassed ? 'low' : 'high',
    suggestion: areaPassed ? undefined : t.areaSuggestion || 'Reduce number or size of selected units',
    message: areaPassed
      ? t.areaPassMessage || 'Total selected area is within the limit'
      : `${t.areaFailMessage?.replace('{selected}', totalSelectedArea.toFixed(0)).replace('{limit}', Math.round(maxAllowedArea).toString())}` ||
        `Selected area (${totalSelectedArea} sqft) exceeds limit (${Math.round(maxAllowedArea)} sqft)`,
    unitId: selectedUnits[0].unit_id,
  })

  // 💎 Luxury ratio rule
  const luxuryPassed = luxuryUnits.length / selectedUnits.length <= 0.4
  const luxuryRatioPercent = Math.round((luxuryUnits.length / selectedUnits.length) * 100)

  violations.push({
    rule: t.luxuryRule || 'Luxury features (balcony + parking + 4+ bedrooms) max 40%',
    passed: luxuryPassed,
    riskLevel: luxuryPassed ? 'low' : 'medium',
    suggestion: luxuryPassed ? undefined : t.luxurySuggestion || 'Reduce number of luxury-featured units',
    message: luxuryPassed
      ? t.luxuryPassMessage || 'Luxury unit ratio is within the allowed limit'
      : t.luxuryFailMessage?.replace('{percent}', `${luxuryRatioPercent}`) ||
        `${luxuryRatioPercent}% luxury units exceeds 40% limit`,
    unitId: luxuryPassed
      ? selectedUnits[0].unit_id
      : luxuryUnits[0]?.unit_id ?? selectedUnits[0].unit_id,
  })

  // ⚠️ Phase conflict check
  const selectedProjectIds = [...new Set(selectedUnits.map(u => u.unit_id))]
  const projectStatuses = selectedProjectIds
    .map(id => mockUnits.find(p => p.unit_id === id)?.status)
    .filter(Boolean)

  const uniqueStatuses = [...new Set(projectStatuses)]
  const phaseConflict = uniqueStatuses.length > 1

  violations.push({
    rule: t.phaseRule || 'Phase conflict across selected units',
    passed: !phaseConflict,
    riskLevel: phaseConflict ? 'high' : 'low',
    suggestion: phaseConflict
      ? t.phaseSuggestion || 'Avoid mixing units from different completion statuses'
      : undefined,
    message: phaseConflict
      ? t.phaseFailMessage?.replace('{statuses}', uniqueStatuses.join(', ')) ||
        `Units from multiple phases selected (${uniqueStatuses.join(', ')})`
      : t.phasePassMessage || 'All units are from the same phase',
    unitId: selectedUnits[0].unit_id,
  })

  return violations
}
