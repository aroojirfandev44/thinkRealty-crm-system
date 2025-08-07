import { useDispatch, useSelector } from 'react-redux'
import { toggleUnit, appendOrUpdateUnits, setValidationErrorsFromChain ,updateConcurrentUsers} from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockUnits } from '../data/data'
import { FaCheck } from 'react-icons/fa'
import { handleAvailabilityCascade } from '../Utils/handleAvailabilityCascade'
import { useEffect, useRef, useState } from 'react'
import { useTranslate } from '../Utils/useTranslate'
import type { ActiveUser, Unit } from '../types'
import GroupedByFloorView from './GroupedByFloorView'
import { debounce } from 'lodash'
import { toast } from 'react-toastify';

const UnitMultiSelect = () => {
  const dispatch = useDispatch()
  const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
  const demandTriggers = useSelector((state: RootState) => state.landingPage.demandTriggers)
  const timers = useSelector((state: RootState) => state.landingPage.countdownTimers)
  const lang = useSelector((state: RootState) => state.landingPage.contentPersonalization.language)
  const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
  const validationErrors = useSelector((state: RootState) => state.landingPage.validationErrors)
  const layoutMode = useSelector((state: RootState) => state.landingPage.layoutMode)

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
  useEffect(() => {
    if (!selectedProject) return;
  
    const simulatedUser: ActiveUser = {
      userId: 'user_abc',
      username: 'another_user',
      name: 'Another User',
      action: 'selected_units',
      timestamp: Date.now(),
      projectId: selectedProject.project_id ?? -1,
      selectedUnitIds: [1, 2],
    };
  
    dispatch(updateConcurrentUsers([simulatedUser]));
  }, [selectedProject, dispatch]);

  const concurrentUsers = useSelector((state: RootState) => state.landingPage.concurrentUsers);
  
  const overlappingUnits = concurrentUsers
    .filter(user => user.projectId === selectedProject?.project_id)
    .flatMap(user => user.selectedUnitIds)
    .filter(unitId => selectedUnits.some(unit => unit.unit_id === unitId));
   
    const [shownConflictUnitIds, setShownConflictUnitIds] = useState<number[]>([]);

    useEffect(() => {
      const newConflicts = overlappingUnits.filter(
        unitId => !shownConflictUnitIds.includes(unitId)
      );
    
      if (newConflicts.length > 0) {
        newConflicts.forEach((unitId) => {
          toast.warn(`⚠️ Conflict: Unit ${unitId} is already selected by another user`, {
            toastId: `conflict-unit-${unitId}`, // unique ID per unit
            autoClose: 4000,
          });
        });
    
        setShownConflictUnitIds(prev => [...prev, ...newConflicts]);
      }
    
      if (overlappingUnits.length === 0 && shownConflictUnitIds.length > 0) {
        setShownConflictUnitIds([]); // Reset when no conflict
      }
    }, [overlappingUnits, shownConflictUnitIds]);
    
    
    
  const hasValidationError = (unitId: number): boolean =>
    validationErrors.some(error => error.unitId === unitId)

  const availabilityCascade = handleAvailabilityCascade()

  const [currentPage, setCurrentPage] = useState(1)
  const unitsPerPage = 4

  const indexOfLastUnit = currentPage * unitsPerPage
  const indexOfFirstUnit = indexOfLastUnit - unitsPerPage
  const paginatedUnits =
    layoutMode.isPerformance
      ? filteredUnits.slice(indexOfFirstUnit, indexOfLastUnit)
      : filteredUnits

  const totalPages = Math.ceil(filteredUnits.length / unitsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }


  const debouncedToggleUnit = useRef(
    debounce((unit: Unit) => {
      console.log("✅ Toggled:", unit.unit_number)
      dispatch(toggleUnit(unit))
      availabilityCascade(unit)
    }, 300, { leading: true, trailing: false }) // ← this is important
  ).current
  
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  useEffect(() => {
    if (selectedProject) {
      const unitsForProject = mockUnits.filter(unit => unit.project_id === selectedProject.project_id)
      dispatch(appendOrUpdateUnits(unitsForProject))
    }
  }, [selectedProject])

  useEffect(() => {
    if (selectedProject) {
      dispatch(setValidationErrorsFromChain({ selectedUnits, project: selectedProject }))
    }
  }, [selectedUnits, selectedProject, dispatch])

  const groupedByFloor = filteredUnits.reduce((acc, unit) => {
    const floor = unit.floor_level
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(unit)
    return acc
  }, {} as Record<number, Unit[]>)

 
  
  return (
    <>
      {layoutMode.isCompact ? (

        <GroupedByFloorView
          groupedByFloor={groupedByFloor}
          selectedUnits={selectedUnits}
          validationErrors={validationErrors}
          demandTriggers={demandTriggers}
          timers={timers}
          lang={lang}
          t={t}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
            {paginatedUnits.map((unit) => {
              const isSelected = selectedUnits.some(u => u.unit_id === unit.unit_id)
              const badge = getBadge(unit.unit_id)
              const timer = timers[unit.unit_id]
              const isTimeSensitive = layoutMode.isFocus && timer
              const isNonEssential = layoutMode.isFocus && !timer

              return (
                <label
                  key={unit.unit_id}
                  className={`flex flex-col gap-1 items-start p-4 rounded-lg border-2 cursor-pointer transition-all 
              ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'}
              ${hasValidationError(unit.unit_id) ? 'border-red-500 bg-red-50' : ''}
              ${isTimeSensitive ? 'border-yellow-500 ring-2 ring-red-300' : ''}
              ${isNonEssential ? 'opacity-50 grayscale' : ''}`}
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
                  <p className="text-xs text-blue-600">
                    Last Updated: {unit.lastUpdated ? new Date(unit.lastUpdated).toLocaleTimeString() : '—'}
                  </p>

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
                      // dispatch(toggleUnit(unit))
                      // availabilityCascade(unit)
                      debouncedToggleUnit(unit)
                    }}
                    className="sr-only"
                  />
                </label>
              )
            })}
          </div>

          {/* ✅ Pagination only if performance mode is true */}
          {layoutMode.isPerformance && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>

            </div>
          )}
          <button
            onClick={() => {
              const now = Date.now();
              const testUnit = filteredUnits[0];

              // Fake old update (should be ignored)
              dispatch(
                appendOrUpdateUnits([
                  {
                    ...testUnit,
                    price: testUnit.price + 10000,
                    lastUpdated: now - 10000, // 10 seconds older
                  },
                ])
              );

              // Fake new update (should be accepted)
              setTimeout(() => {
                dispatch(
                  appendOrUpdateUnits([
                    {
                      ...testUnit,
                      price: testUnit.price + 20000,
                      lastUpdated: now + 10000, // 10 seconds in future
                    },
                  ])
                );
              }, 1000);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Test Price Updates
          </button>

        </>
      )}


    </>
  )
}

export default UnitMultiSelect
