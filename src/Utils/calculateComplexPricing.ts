import type { Unit, Project, PricingResult } from '../types'

import { translations } from '../types/translation'
export function calculateComplexPricing(
  units: Unit[],
  project: Project,
  percentageSelected: number,
  t: translations // 👈 Accept translation object
): PricingResult {
  let total = 0
  const breakdown: string[] = []

  for (const unit of units) {
    let unitPrice = unit.price

    // Floor level adjustment
    if (unit.floor_level >= 1 && unit.floor_level <= 3) {
      unitPrice *= 1.05
      breakdown.push(t.floorAdjustmentLow(unit.floor_level, unit.unit_number))
    } else if (unit.floor_level >= 4) {
      unitPrice *= 1.12
      breakdown.push(t.floorAdjustmentHigh(unit.floor_level, unit.unit_number))
    }

    // Balcony adjustment
    if (unit.has_balcony) {
      unitPrice *= 1.08
      breakdown.push(t.balconyAdjustment(unit.unit_number))
    }

    // Parking adjustment
    if (unit.has_parking) {
      unitPrice += 15000
      breakdown.push(t.parkingAdjustment(unit.unit_number))
    }

    total += unitPrice
  }

  // Bulk discount rule
  if (percentageSelected > 30) {
    const discount = total * 0.03
    total -= discount
    breakdown.push(t.bulkDiscount)
  }

  if (
    project.completion_status === 'off_plan' &&
    isCompletionBeyond18Months(project)
  ) {
    const uplift = total * 0.15
    total += uplift
    breakdown.push(t.futureAppreciation)
  }

  return {
    total: Math.round(total),
    breakdown
  }
}

function isCompletionBeyond18Months(project: Project): boolean {
  return true
}
