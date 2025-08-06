import type { Unit, Project, PricingResult } from '../types'

export function calculateComplexPricing(
  units: Unit[],
  project: Project,
  percentageSelected: number
): PricingResult {
  let total = 0
  const breakdown: string[] = []

  for (const unit of units) {
    let unitPrice = unit.price

    // Floor level adjustment
    if (unit.floor_level >= 1 && unit.floor_level <= 3) {
      unitPrice *= 1.05
      breakdown.push(`+5% for floor ${unit.floor_level} of unit ${unit.unit_number}`)
    } else if (unit.floor_level >= 4) {
      unitPrice *= 1.12
      breakdown.push(`+12% for floor ${unit.floor_level} of unit ${unit.unit_number}`)
    }

    // Balcony adjustment
    if (unit.has_balcony) {
      unitPrice *= 1.08
      breakdown.push(`+8% for balcony in unit ${unit.unit_number}`)
    }

    // Parking adjustment
    if (unit.has_parking) {
      unitPrice += 15000
      breakdown.push(`+AED 15,000 for parking in unit ${unit.unit_number}`)
    }

    total += unitPrice
  }

  // Bulk discount rule
  if (percentageSelected > 30) {
    const discount = total * 0.03
    total -= discount
    breakdown.push(`-3% bulk discount applied`)
  }
  
  if (
    project.completion_status === 'off_plan' && // ← match your enum/type
    isCompletionBeyond18Months(project)
  ) {
    const uplift = total * 0.15
    total += uplift
    breakdown.push(`+15% future appreciation for off-plan project`)
  }

  return {
    total: Math.round(total),
    breakdown
  }
}

// Dummy check – always returns true for now
function isCompletionBeyond18Months(project: Project): boolean {
  return true // Replace with actual date logic when available
}