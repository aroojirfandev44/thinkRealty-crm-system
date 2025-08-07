
import type { Unit, NotificationState, ConflictState } from '../types'

export const detectPriceChangesAndConflicts = (
  allUnits: Unit[],
  externalUnits: Unit[]
): { notifications: NotificationState[]; conflict: ConflictState | null } => {
  const notifications: NotificationState[] = []
  let conflict: ConflictState | null = null

  externalUnits.forEach((externalUnit) => {
    const localUnit = allUnits.find(u => u.unit_id === externalUnit.unit_id)

    if (localUnit && localUnit.price !== externalUnit.price) {
      notifications.push({
        id: `price-change-${externalUnit.unit_id}`,
        type: 'price',
        message: `Price updated for unit ${externalUnit.unit_number}.`,
        read: false,
        timestamp: new Date().toISOString()
      })

      if (!conflict) {
        conflict = {
          hasConflict: true,
          details: `Another user modified project ${externalUnit.project_id}`,
          conflictProjectId: externalUnit.project_id,
          mergeStrategy: undefined
        }
      }
    }
  })

  return { notifications, conflict }
}
