// utils/calculateOptimalLayout.ts

import type { layoutMode, Unit } from '../types'

export interface ScreenDimensions {
  width: number
  height: number
}

export const calculateOptimalLayout = (
    selectedUnits: Unit[],
    screenSize: ScreenDimensions,
    activeTimers: number
  ): layoutMode => {
    const isMobile = screenSize.width <= 768
    const selectedCount = selectedUnits.length
  
    const isFocus = activeTimers > 0
    const isCompact = isMobile && selectedCount > 2
    const isPerformance = !isMobile && selectedCount > 4
    const isStandard = !isFocus && !isCompact && !isPerformance
  
    return {
      isCompact,
      isPerformance,
      isFocus,
      isStandard,
    }
  }
  