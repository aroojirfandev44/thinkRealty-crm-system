import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../Store/Store'
import { setLayoutMode } from '../Store/Reducer/landingPageSlice'
import { calculateOptimalLayout } from '../Utils/calculateOptimalLayout'

const AdaptiveLayoutManager = () => {
  const dispatch = useDispatch()
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
  const timers = useSelector((state: RootState) => state.landingPage.countdownTimers)

  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const activeTimers = Object.keys(timers).length
    const layout = calculateOptimalLayout(selectedUnits, screenSize, activeTimers)
    dispatch(setLayoutMode(layout))
  }, [selectedUnits, timers, screenSize]) 
  return null
}

export default AdaptiveLayoutManager
