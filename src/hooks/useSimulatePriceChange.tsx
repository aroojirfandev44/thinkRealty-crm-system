import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import type { RootState } from '../Store/Store'
import {
  appendOrUpdateUnits,
  addNotification,
  setConflict
} from '../Store/Reducer/landingPageSlice'
import { detectPriceChangesAndConflicts } from '../Utils/detectAndResolveConflicts'
import { useTranslate } from './useTranslate'

const useSimulatePriceChange = () => {
  const dispatch = useDispatch()
  const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
  const notifiedUnitsRef = useRef<Set<number>>(new Set());
  const t = useTranslate()

  useEffect(() => {
    const timer = setTimeout(() => {
      const unit11 = 11
      const unit12 = 12

      // === Handle Unit 11: Simulate Price Change Notification Only ===
      const isUnit11Selected = selectedUnits.some(unit => unit.unit_id === unit11)
      if (isUnit11Selected && !notifiedUnitsRef.current.has(unit11)) {
        const updatedUnits11 = allUnits.map(unit =>
          unit.unit_id === unit11 ? { ...unit, price: unit.price + 1000 } : unit
        )

        const { notifications } = detectPriceChangesAndConflicts(allUnits, updatedUnits11, t)

        notifications.forEach(alert => {
          dispatch(addNotification(alert))
          notifiedUnitsRef.current.add(unit11)
        })

        dispatch(appendOrUpdateUnits(updatedUnits11))
      }

      // === Handle Unit 12: Simulate Conflict Only ===
      const isUnit12Selected = selectedUnits.some(unit => unit.unit_id === unit12)
      if (isUnit12Selected && !notifiedUnitsRef.current.has(unit12)) {
        const updatedUnits12 = allUnits.map(unit =>
          unit.unit_id === unit12 ? { ...unit, price: unit.price + 500 } : unit
        )

        const { conflict } = detectPriceChangesAndConflicts(allUnits, updatedUnits12, t)

        if (conflict) {
          dispatch(setConflict(conflict))
          notifiedUnitsRef.current.add(unit12)
        }

        dispatch(appendOrUpdateUnits(updatedUnits12))
      }

    }, 1000)

    return () => clearTimeout(timer)
  }, [allUnits, selectedUnits, dispatch])
}

export default useSimulatePriceChange
