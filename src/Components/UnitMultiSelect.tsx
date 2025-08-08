import { useDispatch, useSelector } from 'react-redux'
import { toggleUnit, appendOrUpdateUnits, setValidationErrorsFromChain, updateConcurrentUsers } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockUnits } from '../data/data'
import { FaCheck, FaClock, FaUsers, FaExclamationTriangle, FaLock, FaFlask, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { BsGrid3X3Gap } from 'react-icons/bs'
import { handleAvailabilityCascade } from '../Utils/handleAvailabilityCascade'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslate } from '../hooks/useTranslate'
import type { ActiveUser, Unit } from '../types'
import GroupedByFloorView from './GroupedByFloorView'
import { debounce } from 'lodash'
import { toast } from 'react-toastify'
import TimerDisplay from './TimerDisplay'

const UnitMultiSelect = () => {
  const dispatch = useDispatch()
  const [shownConflictUnitIds, setShownConflictUnitIds] = useState<number[]>([])
  const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
  const demandTriggers = useSelector((state: RootState) => state.landingPage.demandTriggers)
  const timers = useSelector((state: RootState) => state.landingPage.countdownTimers)
  const lang = useSelector((state: RootState) => state.landingPage.contentPersonalization.language)
  const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
  const validationErrors = useSelector((state: RootState) => state.landingPage.validationErrors)
  const layoutMode = useSelector((state: RootState) => state.landingPage.layoutMode)
  const concurrentUsers = useSelector((state: RootState) => state.landingPage.concurrentUsers)
  const filteredUnits = allUnits.filter(unit => unit.project_id === selectedProject?.project_id)
  const reservedUnits = useSelector((state: RootState) => state.landingPage.reservedUnits)
  const t = useTranslate()

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

  useEffect(() => {
    if (!selectedProject) return
    const simulatedUser: ActiveUser = {
      userId: 'user_abc',
      username: 'another_user',
      name: 'Another User',
      action: 'selected_units',
      timestamp: Date.now(),
      projectId: selectedProject.project_id ?? -1,
      selectedUnitIds: [1, 2],
    }
    dispatch(updateConcurrentUsers([simulatedUser]))
  }, [selectedProject, dispatch])

  useEffect(() => {
    if (!selectedProject) return
    const lastSelectedUnit = selectedUnits[selectedUnits.length - 1]
    if (!lastSelectedUnit) return
    handleAvailabilityCascade(lastSelectedUnit, dispatch, allUnits, selectedProject, reservedUnits, demandTriggers)
  }, [selectedUnits, selectedProject, allUnits])

  const overlappingUnits = concurrentUsers
    .filter(user => user.projectId === selectedProject?.project_id)
    .flatMap(user => user.selectedUnitIds)
    .filter(unitId => selectedUnits.some(unit => unit.unit_id === unitId))

  useEffect(() => {
    const newConflicts = overlappingUnits.filter(unitId => !shownConflictUnitIds.includes(unitId))
    if (newConflicts.length > 0) {
      newConflicts.forEach((unitId) => {
        toast.warn(`⚠️ Conflict: Unit ${unitId} is already selected by another user`, {
          toastId: `conflict-unit-${unitId}`,
          autoClose: 4000,
        })
      })
      setShownConflictUnitIds(prev => [...prev, ...newConflicts])
    }
    if (overlappingUnits.length === 0 && shownConflictUnitIds.length > 0) {
      setShownConflictUnitIds([])
    }
  }, [overlappingUnits, shownConflictUnitIds])

  const hasValidationError = (unitId: number): boolean =>
    validationErrors.some(error => error.unitId === unitId)

  const [currentPage, setCurrentPage] = useState(1)
  const unitsPerPage = 4
  const indexOfLastUnit = currentPage * unitsPerPage
  const indexOfFirstUnit = indexOfLastUnit - unitsPerPage
  const paginatedUnits = layoutMode.isPerformance
    ? filteredUnits.slice(indexOfFirstUnit, indexOfLastUnit)
    : filteredUnits
  const totalPages = Math.ceil(filteredUnits.length / unitsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

  const debouncedToggleUnit = useRef(
    debounce((unit: Unit) => {
      dispatch(toggleUnit(unit))
      handleAvailabilityCascade(unit, dispatch, allUnits, selectedProject, reservedUnits, demandTriggers)
    }, 50, { leading: true, trailing: false })
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
      dispatch(setValidationErrorsFromChain({ selectedUnits, project: selectedProject, t }))
    }
  }, [selectedUnits, selectedProject, dispatch, t])

  const groupedByFloor = filteredUnits.reduce((acc, unit) => {
    const floor = unit.floor_level
    if (!acc[floor]) acc[floor] = []
    acc[floor].push(unit)
    return acc
  }, {} as Record<number, Unit[]>)

  const isDisabled = !selectedProject

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 ${isDisabled ? 'opacity-50' : 'hover:shadow-md'
      }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${isDisabled ? 'bg-gray-100' : 'bg-orange-100'
          }`}>
          <BsGrid3X3Gap className={`w-5 h-5 ${isDisabled ? 'text-gray-400' : 'text-orange-600'}`} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
            {t.selectUnits}
          </h3>
          <p className={`text-sm ${isDisabled ? 'text-gray-300' : 'text-gray-500'}`}>
            {isDisabled
              ? t.selectProjectFirst
              : `${t.chooseUnitsFrom} ${filteredUnits.length} ${t.available}`}
          </p>
        </div>

        {!isDisabled && (
          <div className="flex items-center gap-2">
            {concurrentUsers.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                <FaUsers className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">
                  {concurrentUsers.length} active
                </span>
              </div>
            )}
            {selectedUnits.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                <FaCheck className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  {selectedUnits.length} selected
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {layoutMode.isCompact ? (
        <GroupedByFloorView
          groupedByFloor={groupedByFloor}
          selectedUnits={selectedUnits}
          validationErrors={validationErrors}
          timers={timers}
          lang={lang}
          t={t}
        />
      ) : (
        <>
          {/* Units Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
            {paginatedUnits.map((unit) => {
              const isSelected = selectedUnits.some(u => u.unit_id === unit.unit_id)
              const badge = getBadge(unit.unit_id)
              const timer = timers[unit.unit_id]
              const isTimeSensitive = layoutMode.isFocus && timer
              const isNonEssential = layoutMode.isFocus && !timer
              const isLocked = !!(timers[unit.unit_id] && timers[unit.unit_id] > Date.now())

              return (
                <label
                  key={unit.unit_id}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'
                    } ${hasValidationError(unit.unit_id) ? 'border-red-500 bg-red-50' : ''} ${isTimeSensitive ? 'border-yellow-500 ring-2 ring-yellow-300' : ''
                    } ${isNonEssential ? 'opacity-50 grayscale' : ''} ${isLocked ? 'cursor-not-allowed opacity-75' : 'hover:shadow-md'
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

                  {/* Main Content */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'
                        } flex items-center justify-center`}>
                        {isSelected && <FaCheck className="text-white w-3 h-3" />}
                      </div>

                      {/* Unit Info */}
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{unit.unit_number}</p>
                        <p className="text-xs text-gray-600 font-medium">
                          AED {unit.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Badge */}
                    {badge && <div className="flex-shrink-0">{badge}</div>}
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center gap-1 mb-2">
                    <FaClock className="w-3 h-3 text-blue-500" />
                    <p className="text-xs text-blue-600">
                      Last Updated: {unit.lastUpdated ? new Date(unit.lastUpdated).toLocaleTimeString() : '—'}
                    </p>
                  </div>

                  {/* Timer Display */}
                  {timers[unit.unit_id] && (
                    <div className="mb-2">
                      <TimerDisplay expiresAt={timers[unit.unit_id]} />
                    </div>
                  )}

                  {/* Status Messages */}
                  <div className="space-y-1">
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
                      <p className="text-xs text-red-500 font-medium">
                        {t.reserveIn} 48h
                      </p>
                    )}
                  </div>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    disabled={isLocked}
                    onChange={(e) => {
                      e.preventDefault()
                      if (isLocked) return
                      debouncedToggleUnit(unit)
                    }}
                    className="sr-only"
                  />
                </label>
              )
            })}
          </div>

          {/* Pagination */}
          {layoutMode.isPerformance && (
            <div className="flex justify-between items-center mt-6 px-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-black text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed  hover:bg-gray-50 transition-colors"
              >
                <FaChevronLeft className="w-3 h-3" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2  bg-black text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed  hover:bg-gray-50 transition-colors"
              >
                Next
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Test Button */}
          <button
            onClick={() => {
              const now = Date.now()
              const testUnit = filteredUnits[0]
              // Fake old update (should be ignored)
              dispatch(appendOrUpdateUnits([
                {
                  ...testUnit,
                  price: testUnit.price + 10000,
                  lastUpdated: now - 10000, // 10 seconds older
                },
              ]))
              // Fake new update (should be accepted)
              setTimeout(() => {
                dispatch(appendOrUpdateUnits([
                  {
                    ...testUnit,
                    price: testUnit.price + 20000,
                    lastUpdated: now + 10000, // 10 seconds in future
                  },
                ]))
              }, 1000)
            }}

            className="mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FaFlask className="w-4 h-4" />
            Test Price Updates
          </button>
          <button
            onClick={() => {
              const unit = filteredUnits[0];
              const now = Date.now();

              // Test: noisy small update (should be ignored)
              dispatch(
                appendOrUpdateUnits([
                  { ...unit, price: unit.price + 10, lastUpdated: now + 1000 } // < threshold
                ])
              );

              // Test: meaningful update (should be accepted)
              setTimeout(() => {
                dispatch(
                  appendOrUpdateUnits([
                    { ...unit, price: unit.price + 1000, lastUpdated: now + 2000 }
                  ])
                );
              }, 500);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Test Intelligent Debounce
          </button>

        </>
      )}
    </div>
  )
}

export default UnitMultiSelect
