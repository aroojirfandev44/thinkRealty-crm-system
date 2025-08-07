import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import type { RootState } from '../Store/Store'
import {
  appendOrUpdateUnits,
  addNotification,
  setConflict
} from '../Store/Reducer/landingPageSlice'
import { detectPriceChangesAndConflicts } from '../Utils/detectAndResolveConflicts'


const useSimulatePriceChange = () => {
  const dispatch = useDispatch()
  const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
  const notifiedUnitsRef = useRef<Set<number>>(new Set());


  useEffect(() => {
    const timer = setTimeout(() => {
      const unitIdToUpdate = 11
      const isSelected = selectedUnits.some(unit => unit.unit_id === unitIdToUpdate)
      if (!isSelected) return
      if (notifiedUnitsRef.current.has(unitIdToUpdate)) return

      const simulatedUpdates = allUnits.map(unit =>
        unit.unit_id === unitIdToUpdate
          ? { ...unit, price: unit.price + 1000 }
          : unit
      )
     
      console.log('Is unit 11 selected?', isSelected);
      const { notifications, conflict } = detectPriceChangesAndConflicts(allUnits, simulatedUpdates)

      notifications.forEach(alert => {
        dispatch(addNotification(alert))
        notifiedUnitsRef.current.add(unitIdToUpdate)
      })

      if (conflict) {
        dispatch(setConflict(conflict))
      }

      dispatch(appendOrUpdateUnits(simulatedUpdates))
    }, 1000)

    return () => clearTimeout(timer)
  }, [allUnits, selectedUnits, dispatch])
}

export default useSimulatePriceChange

