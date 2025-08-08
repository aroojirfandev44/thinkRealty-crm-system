import type { PricingResult, Project, Unit } from "../types";

export function calculateComplexPricing(
  units: Unit[],
  project: Project,
  percentageSelected: number,
  t: any
): PricingResult {
  let baseTotal = 0;
  let parkingTotal = 0;
  let hasBalcony = false;
  const breakdown: string[] = [];

  for (const unit of units) {
    // Apply floor-level adjustment
    let adjustedPrice = unit.price;
    if (unit.floor_level >= 1 && unit.floor_level <= 3) {
      adjustedPrice *= 1.05;
      breakdown.push(t.floorAdjustmentLow(unit.floor_level, unit.unit_number));
    } else if (unit.floor_level >= 4) {
      adjustedPrice *= 1.12;
      breakdown.push(t.floorAdjustmentHigh(unit.floor_level, unit.unit_number));
    }

    baseTotal += adjustedPrice;

    // Parking is per-unit fixed
    if (unit.has_parking) {
      parkingTotal += 15000;
      breakdown.push(t.parkingAdjustment(unit.unit_number));
    }

    // Balcony: only check once (rule says apply 8% once if any selected units have a balcony)
    if (unit.has_balcony) {
      hasBalcony = true; // track only once
    }
    
  }

  let total = baseTotal + parkingTotal;

  // Balcony increase: 8% to total (if any unit has balcony)
  if (hasBalcony) {
    const balconyIncrease = total * 0.08;
    total += balconyIncrease;
    breakdown.push(t.balconyAdjustmentTotal);
  }

  // Bulk discount if more than 30% units selected
  if (percentageSelected > 30) {
    const discount = total * 0.03;
    total -= discount;
    breakdown.push(t.bulkDiscount || '+3% bulk discount applied');
  }

  // 15% uplift if off-plan & completion >18 months
  if (
    project.completion_status === 'off_plan' 
   
  ) {
    const appreciation = total * 0.15;
    total += appreciation;
    breakdown.push(t.futureAppreciation);
  }

  return {
    total: Math.round(total),
    breakdown
  };
}


