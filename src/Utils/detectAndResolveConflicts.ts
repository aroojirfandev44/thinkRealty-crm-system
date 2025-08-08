// detectPriceChangesAndConflicts.ts
import type { Unit, NotificationState, ConflictState } from '../types'

export const detectPriceChangesAndConflicts = (
  allUnits: Unit[],
  externalUnits: Unit[],
  t: any // injected translations
): { notifications: NotificationState[]; conflict: ConflictState | null } => {
  const notifications: NotificationState[] = []

  const localUnitsMap = new Map(allUnits.map(unit => [unit.unit_id, unit]))

  let conflictProjectId: number | null = null
  console.log("Dtt",t)
  for (const externalUnit of externalUnits) {
    const localUnit = localUnitsMap.get(externalUnit.unit_id)

    if (localUnit && localUnit.price !== externalUnit.price) {
      notifications.push({
        id: `price-change-${externalUnit.unit_id}`,
        type: 'price',
        message: `${t.priceUpdated} ${externalUnit.unit_number}.`,
        read: false,
        timestamp: new Date().toISOString()
      })

      if (!conflictProjectId) {
        conflictProjectId = externalUnit.project_id
      }
    }
  }

  const conflict: ConflictState | null = conflictProjectId
    ? {
        hasConflict: true,
        details: `${t.conflictDetected} ${conflictProjectId}`,
        conflictProjectId,
        mergeStrategy: undefined
      }
    : null

  return { notifications, conflict }
}
