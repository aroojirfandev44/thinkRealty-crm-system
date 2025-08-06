import { useDispatch, useSelector } from 'react-redux'
import type { Unit, DemandTrigger } from '../types'
import type { RootState } from '../Store/Store'
export const handleAvailabilityCascade = () => {
    const dispatch = useDispatch()
    const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
    const allProjects = useSelector((state: RootState) =>
      state.landingPage.selectedProject ? [state.landingPage.selectedProject] : []
    )
    const selectedReservedUnits = useSelector((state: RootState) => state.landingPage.reservedUnits)
  
    return (updatedUnit: Unit) => {
      const project = allProjects.find(p => p.project_id === updatedUnit.project_id)
      if (!project) return
  
      const zoneId = project.zone_id
  
      // ✅ Ensure latest reserved state (including newly selected unit)
      const updatedUnits = allUnits.map(u => {
        const isJustReserved = u.unit_id === updatedUnit.unit_id
        const isReservedInRedux = selectedReservedUnits.some(r => r.unit_id === u.unit_id)
        return {
          ...u,
          status: isJustReserved || isReservedInRedux ? 'reserved' : 'available'
        }
      })
   console.log("updatedUnits",updatedUnits)
      // ✅ Find similar available units
      const similarUnits = updatedUnits.filter(
        u =>
          u.project_id === updatedUnit.project_id &&
          u.property_type === updatedUnit.property_type &&
          u.bedrooms === updatedUnit.bedrooms &&
          u.status === 'available'
      )
      console.log("similarUnits",similarUnits)
    
      if (similarUnits.length > 0) {
        const similarUnitsInZone = updatedUnits.filter(
          u =>
            u.project_id !== updatedUnit.project_id &&
            allProjects.find(p => p.project_id === u.project_id)?.zone_id === zoneId &&
            u.property_type === updatedUnit.property_type &&
            u.bedrooms === updatedUnit.bedrooms
        )
        console.log("similarUnitsInZone",similarUnitsInZone)
        similarUnits.forEach(u => {
          dispatch({
            type: 'landingPage/addDemandTrigger',
            payload: {
              unitId: u.unit_id,
              triggerType: 'high_demand',
              message: 'High demand for this unit type in this zone'
            } as DemandTrigger
          })
        })
      }
  
      // ✅ Check limited availability (less than 20%)
      const totalUnits = updatedUnits.filter(u => u.project_id === updatedUnit.project_id).length
      const availableUnits = updatedUnits.filter(
        u => u.project_id === updatedUnit.project_id && u.status === 'available'
      )
      const percentage = (availableUnits.length / totalUnits) * 100
  console.log("percentage",percentage,availableUnits)

      if (percentage < 20) {
        console.log("availableUnitsssssss",availableUnits)
        availableUnits.forEach(u => {
          dispatch({
            type: 'landingPage/addDemandTrigger',
            payload: {
              unitId: u.unit_id,
              triggerType: 'limited_availability',
              message: 'Limited availability - reserve within 48 hours'
            } as DemandTrigger
          })
          dispatch({
            type: 'landingPage/updateCountdownTimer',
            payload: {
              unitId: u.unit_id,
              time: 48 * 60 * 60 
            }
          })
        })
      }
    }
  }
  