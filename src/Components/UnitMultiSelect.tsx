import { useDispatch, useSelector } from 'react-redux'
import { toggleUnit,appendOrUpdateUnits } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockUnits } from '../data/data'
import { BsGrid3X3Gap } from 'react-icons/bs'
import { FaCheck } from 'react-icons/fa'
import { handleAvailabilityCascade } from '../Utils/handleAvailabilityCascade'
import { useEffect } from 'react'

const UnitMultiSelect = () => {
    const dispatch = useDispatch()
    const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
    const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
    const demandTriggers = useSelector((state: RootState) => state.landingPage.demandTriggers)
    const timers = useSelector((state: RootState) => state.landingPage.countdownTimers)
    console.log("demandTriggers",demandTriggers)
   
    const isDisabled = !selectedProject
    const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
    const filteredUnits = allUnits.filter(unit => unit.project_id === selectedProject?.project_id)
    console.log("allUnits",allUnits)
    const getBadge = (unitId: number) => {
        const trigger = demandTriggers.find(t => t.unitId === unitId)
        if (!trigger) return null
        if (trigger.triggerType === 'high_demand') return <span className="text-red-600 text-xs ml-2">🔥 High Demand</span>
        if (trigger.triggerType === 'limited_availability') return <span className="text-yellow-500 text-xs ml-2">⚠️ Limited</span>
        return null
    }

    const reservedUnits = useSelector((state: RootState) => state.landingPage.reservedUnits)
    const availabilityCascade = handleAvailabilityCascade()
    console.log("selectedUnits", selectedUnits)
    useEffect(() => {
        if (selectedProject) {
          const unitsForProject = mockUnits.filter(
            unit => unit.project_id === selectedProject.project_id
          )
          dispatch(appendOrUpdateUnits(unitsForProject))
        }
      }, [selectedProject])
      
      
      
    return (
        <div className={`bg-white rounded-xl border p-6 ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BsGrid3X3Gap className="text-orange-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Select Units</h3>
                    <p className="text-sm text-gray-500">
                        {isDisabled ? 'Please select a project first' : `Choose units from ${filteredUnits.length} available`}
                    </p>
                </div>
            </div>

            <div className="grid gap-3 grid-cols-2 max-h-64 overflow-y-auto">
                {allUnits.map((unit) => {
                    const isSelected = selectedUnits.some(u => u.unit_id === unit.unit_id)
                    const badge = getBadge(unit.unit_id)
                    const timer = timers[unit.unit_id]

                    return (
                        <label
                            key={unit.unit_id}
                            className={`flex flex-col gap-1 items-start p-4 rounded-lg border-2 cursor-pointer ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'
                                }`}
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
                            {unit.status === 'reserved' && (
                                <p className="text-xs text-red-400">Reserved</p>
                            )}

                            {timer && (
                                <p className="text-xs text-red-500 ml-6">
                                    ⏳ Reserve in {Math.ceil(timer / 3600)}h
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
    )
}
export default UnitMultiSelect
