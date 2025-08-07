import type { Unit, Project, ValidationReport } from '../types';
import { mockProjects, mockUnits } from '../data/data';

export const runValidationChain = (
  selectedUnits: Unit[],
  project: Project
): ValidationReport[] => {
  if (!project || selectedUnits.length === 0) return [];

  const totalSelectedArea = selectedUnits.reduce((sum, u) => sum + u.area_sqft, 0);
  const averageUnitArea = totalSelectedArea / selectedUnits.length;
  const assumedCommonArea = averageUnitArea * project.total_units * 0.2;
  const maxAllowedArea = assumedCommonArea * 1.2;

  const luxuryUnits = selectedUnits.filter(
    u => u.has_balcony && u.has_parking && u.bedrooms >= 4
  );

  const violations: ValidationReport[] = [];

  // 🧮 Area ratio rule
  const areaPassed = totalSelectedArea <= maxAllowedArea;
  violations.push({
    rule: 'Total selected area vs. common area (max 1.2x)',
    passed: areaPassed,
    riskLevel: areaPassed ? 'low' : 'high',
    suggestion: areaPassed ? undefined : 'Reduce number or size of selected units',
    message: areaPassed
      ? 'Total selected area is within the limit'
      : `Selected area (${totalSelectedArea} sqft) exceeds limit (${Math.round(maxAllowedArea)} sqft)`,
    unitId: selectedUnits[0].unit_id,
  });

  // 💎 Luxury ratio rule
  const luxuryPassed = luxuryUnits.length / selectedUnits.length <= 0.4;
  violations.push({
    rule: 'Luxury features (balcony + parking + 4+ bedrooms) max 40%',
    passed: luxuryPassed,
    riskLevel: luxuryPassed ? 'low' : 'medium',
    suggestion: luxuryPassed ? undefined : 'Reduce number of luxury-featured units',
    message: luxuryPassed
      ? 'Luxury unit ratio is within the allowed limit'
      : `${Math.round((luxuryUnits.length / selectedUnits.length) * 100)}% luxury units exceeds 40% limit`,
    unitId: luxuryPassed
      ? selectedUnits[0].unit_id
      : luxuryUnits[0]?.unit_id ?? selectedUnits[0].unit_id,
  });

  // ⚠️ Phase conflict check
  const selectedProjectIds = [...new Set(selectedUnits.map(u => u.unit_id))];
  const projectStatuses = selectedProjectIds
    .map(id => mockUnits.find(p => p.unit_id === id)?.status)
    .filter(Boolean);
  
  const uniqueStatuses = [...new Set(projectStatuses)];
  const phaseConflict = uniqueStatuses.length > 1;

  violations.push({
    rule: 'Phase conflict across selected units',
    passed: !phaseConflict,
    riskLevel: phaseConflict ? 'high' : 'low',
    suggestion: phaseConflict ? 'Avoid mixing units from different completion statuses' : undefined,
    message: phaseConflict
      ? `Units from multiple phases selected (${uniqueStatuses.join(', ')})`
      : 'All units are from the same phase',
    unitId: selectedUnits[0].unit_id,
  });

  return violations;
};
