import { FaCheck, FaFire, FaClock, FaLayerGroup, FaExclamationTriangle, FaLock } from 'react-icons/fa'
import type { DemandTrigger, Unit } from '../types'
import { toggleUnit } from '../Store/Reducer/landingPageSlice'
import { handleAvailabilityCascade } from '../Utils/handleAvailabilityCascade'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../Store/Store'
import { useCallback, useEffect } from 'react'
import TimerDisplay from './TimerDisplay'

type Props = {
  groupedByFloor: Record<number, Unit[]>
  selectedUnits: Unit[]
  validationErrors: { unitId: number; message: string }[]
  timers: Record<number, number>
  lang: string
  t: any
}

const GroupedByFloorView = ({
  groupedByFloor,
  selectedUnits,
  validationErrors,
  timers,
  lang,
  t,
}: Props) => {
  const dispatch = useDispatch()
  const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
  const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
  const reservedUnits = useSelector((state: RootState) => state.landingPage.reservedUnits)
  const demandTriggers = useSelector((state: RootState) => state.landingPage.demandTriggers)
  const layoutMode = useSelector((state: RootState) => state.landingPage.layoutMode)

  const getBadge = useCallback((unitId: number) => {
    const trigger = demandTriggers.find(t => t.unitId === unitId)
    if (!trigger) return null
    if (trigger.triggerType === 'high_demand') 
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          🔥 {t.highDemand}
        </span>
      )
    if (trigger.triggerType === 'limited_availability') 
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
          ⚡ {t.limitedAvailability}
        </span>
      )
    return null
  }, [demandTriggers, t])

  const hasValidationError = (unitId: number) => {
    return validationErrors.some(error => error.unitId === unitId)
  }

  useEffect(() => {
    if (!selectedProject) return
    const lastSelectedUnit = selectedUnits[selectedUnits.length - 1]
    if (!lastSelectedUnit) return
    handleAvailabilityCascade(lastSelectedUnit, dispatch, allUnits, selectedProject, reservedUnits, demandTriggers)
  }, [selectedUnits, selectedProject, allUnits])

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <FaLayerGroup className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.groupedByFloor || 'Units Grouped by Floor'}</h3>
          <p className="text-sm text-gray-500">A compact view for large selections</p>
        </div>
      </div>

      {Object.entries(groupedByFloor).map(([floor, units]) => (
        <div key={floor} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <h4 className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-800 font-semibold text-sm border-b border-gray-200">
            <FaLayerGroup className="w-4 h-4 text-gray-500" />
            {t.floor || 'Floor'} {floor}
            <span className="ml-auto text-gray-500 font-normal">({units.length} units)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {units.map(unit => {
              const isSelected = selectedUnits.some(u => u.unit_id === unit.unit_id)
              const badge = getBadge(unit.unit_id)
              const timer = timers[unit.unit_id]
              const isTimeSensitive = layoutMode.isFocus && timer
              const isNonEssential = layoutMode.isFocus && !timer
              const isLocked = !!(timers[unit.unit_id] && timers[unit.unit_id] > Date.now());

              return (
                <label
                  key={unit.unit_id}
                  className={`relative flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'
                  } ${hasValidationError(unit.unit_id) ? 'border-red-500 bg-red-50' : ''} ${
                    isTimeSensitive ? 'border-yellow-500 ring-2 ring-yellow-300' : ''
                  } ${isNonEssential ? 'opacity-50 grayscale' : ''} ${
                    isLocked ? 'cursor-not-allowed opacity-75' : 'hover:shadow-md'
                  }`}
                >
                  {/* Lock Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-gray-900/20 rounded-lg flex items-center justify-center">
                      <div className="bg-white rounded-full p-2 shadow-lg">
                        <FaLock className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  )}

                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 ${
                    isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'
                  } flex items-center justify-center`}>
                    {isSelected && <FaCheck className="text-white w-3 h-3" />}
                  </div>

                  {/* Unit Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-900 truncate">{unit.unit_number}</p>
                        <p className="text-xs text-gray-600 font-medium">AED {unit.price.toLocaleString()}</p>
                      </div>
                      {badge && <div className="ml-2 flex-shrink-0">{badge}</div>}
                    </div>

                    {/* Status Messages */}
                    <div className="mt-1 space-y-1">
                      {hasValidationError(unit.unit_id) && (
                        <div className="flex items-center gap-1">
                          <FaExclamationTriangle className="w-3 h-3 text-red-500" />
                          <p className="text-xs text-red-600">
                            {validationErrors.find(err => err.unitId === unit.unit_id)?.message}
                          </p>
                        </div>
                      )}
                      {unit.status === 'reserved' && (
                        <p className="text-xs text-red-500 font-medium">{t.reserved}</p>
                      )}
                      {timer && (
                        <div className="flex items-center gap-1">
                          <FaClock className="w-3 h-3 text-red-500" />
                          <p className="text-xs text-red-500 font-medium">
                            {t.reserveIn} 48h
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    disabled={isLocked}
                    checked={isSelected}
                    onChange={() => {
                      if (isLocked) return;
                      dispatch(toggleUnit(unit))
                      handleAvailabilityCascade(unit, dispatch, allUnits, selectedProject, reservedUnits, demandTriggers)
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
