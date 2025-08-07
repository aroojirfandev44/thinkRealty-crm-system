import { useDispatch, useSelector } from 'react-redux'
import { toggleUnit, appendOrUpdateUnits, setValidationErrorsFromChain } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockUnits } from '../data/data'
import { BsGrid3X3Gap } from 'react-icons/bs'
import { FaCheck } from 'react-icons/fa'
import { handleAvailabilityCascade } from '../Utils/handleAvailabilityCascade'
import { useEffect } from 'react'
import { useTranslate } from '../Utils/useTranslate'
import { runValidationChain } from '../Utils/runValidationChain'

const UnitMultiSelect = () => {
    const dispatch = useDispatch()
    const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
    const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
    const demandTriggers = useSelector((state: RootState) => state.landingPage.demandTriggers)
    const timers = useSelector((state: RootState) => state.landingPage.countdownTimers)
    const lang = useSelector((state: RootState) => state.landingPage.contentPersonalization.language)
    const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
    const validationErrors = useSelector((state: RootState) => state.landingPage.validationErrors)

    const isDisabled = !selectedProject
    const filteredUnits = allUnits.filter(unit => unit.project_id === selectedProject?.project_id)
    const t = useTranslate()

    const getBadge = (unitId: number) => {
        const trigger = demandTriggers.find(t => t.unitId === unitId)
        if (!trigger) return null
        if (trigger.triggerType === 'high_demand') return <span className="text-red-600 text-xs ml-2">{t.highDemand}</span>
        if (trigger.triggerType === 'limited_availability') return <span className="text-yellow-500 text-xs ml-2">{t.limitedAvailability}</span>
        return null
    }
    const hasValidationError = (unitId: number): boolean => {
        return validationErrors.some(error => error.unitId === unitId)
    }

    const availabilityCascade = handleAvailabilityCascade()

    useEffect(() => {
        if (selectedProject) {
            const unitsForProject = mockUnits.filter(unit => unit.project_id === selectedProject.project_id)
            dispatch(appendOrUpdateUnits(unitsForProject))
        }
    }, [selectedProject])

    useEffect(() => {
        if (selectedProject) {
            dispatch(setValidationErrorsFromChain({
                selectedUnits,
                project: selectedProject
            }))
        }
    }, [selectedUnits, selectedProject, dispatch])



    return (
        <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`bg-white rounded-xl border p-6 ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BsGrid3X3Gap className="text-orange-600" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{t.selectUnits || 'Select Units'}</h3>
                    <p className="text-sm text-gray-500">
                        {isDisabled
                            ? t.selectProjectFirst || 'Please select a project first'
                            : `${t.chooseUnitsFrom || 'Choose units from'} ${filteredUnits.length} ${t.available || 'available'}`}
                    </p>
                </div>
            </div>

            <div className="grid gap-3 grid-cols-2 max-h-64 overflow-y-auto">
                {filteredUnits.map((unit) => {
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
    )
}

export default UnitMultiSelect
