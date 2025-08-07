// components/GroupedByFloorView.tsx
import { FaCheck } from 'react-icons/fa'
import type { Unit } from '../types'
import { useDispatch, useSelector } from 'react-redux'
import { toggleUnit } from '../Store/Reducer/landingPageSlice'
import { handleAvailabilityCascade } from '../Utils/handleAvailabilityCascade'
import type { RootState } from '../Store/Store'

type Props = {
  groupedByFloor: Record<number, Unit[]>
  selectedUnits: Unit[]
  validationErrors: { unitId: number; message: string }[]
  demandTriggers: { unitId: number; triggerType: string }[]
  timers: Record<number, number>
  lang: string
  t: any
}

const GroupedByFloorView = ({
  groupedByFloor,
  selectedUnits,
  validationErrors,
  demandTriggers,
  timers,
  lang,
  t
}: Props) => {
  const dispatch = useDispatch()
  const availabilityCascade = handleAvailabilityCascade()

  const getBadge = (unitId: number) => {
    const trigger = demandTriggers.find(t => t.unitId === unitId)
    if (!trigger) return null
    if (trigger.triggerType === 'high_demand') return <span className="text-red-600 text-xs ml-2">{t.highDemand}</span>
    if (trigger.triggerType === 'limited_availability') return <span className="text-yellow-500 text-xs ml-2">{t.limitedAvailability}</span>
    return null
  }

  const hasValidationError = (unitId: number) => {
    return validationErrors.some(error => error.unitId === unitId)
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedByFloor).map(([floor, units]) => (
        <div key={floor}>
          <h4 className="font-semibold text-gray-700 text-sm mb-1">
            {t.floor || 'Floor'} {floor}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {units.map(unit => {
              const isSelected = selectedUnits.some(u => u.unit_id === unit.unit_id)
              const badge = getBadge(unit.unit_id)
              const timer = timers[unit.unit_id]

              return (
                <label
                  key={unit.unit_id}
                  className={`flex flex-col gap-1 items-start p-4 rounded-lg border-2 cursor-pointer 
                    ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'} 
                    ${hasValidationError(unit.unit_id) ? 'border-red-500 bg-red-50' : ''}`}
                >
                  <div className="flex items-center w-full justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'} flex items-center justify-center`}>
                        {isSelected && <FaCheck className="text-white w-3 h-3" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{unit.unit_number}</p>
                        <p className="text-xs text-gray-500">AED {unit.price.toLocaleString()}</p>
                      </div>
                    </div>
                    {badge}
                  </div>

                  {hasValidationError(unit.unit_id) && (
                    <p className="text-xs text-red-600 mt-1">
                      {validationErrors.find(err => err.unitId === unit.unit_id)?.message}
                    </p>
                  )}

                  {unit.status === 'reserved' && (
                    <p className="text-xs text-red-400">{t.reserved}</p>
                  )}

                  {timer && (
                    <p className="text-xs text-red-500 ml-6">
                      {t.reserveIn} {Math.ceil(timer / 3600)}h
                    </p>
                  )}

                  <input
                    type="checkbox"
                    disabled={unit.status === 'reserved'}
                    checked={isSelected}
                    onChange={() => {
                      dispatch(toggleUnit(unit))
                      availabilityCascade(unit)
                    }}
                    className="sr-only"
                  />
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GroupedByFloorView
