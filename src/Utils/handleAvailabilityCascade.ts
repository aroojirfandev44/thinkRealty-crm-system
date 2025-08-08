import { useDispatch, useSelector } from 'react-redux'
import type { Unit, DemandTrigger } from '../types'
import type { RootState } from '../Store/Store'
import { addDemandTrigger, updateCountdownTimer } from '../Store/Reducer/landingPageSlice';
export const handleAvailabilityCascade = (
  updatedUnit: Unit,
  dispatch: any,
  allUnits: Unit[],
  selectedProject: any,
  reservedUnits: Unit[],
  existingTriggers: DemandTrigger[]
) => {
  if (!selectedProject) return;

  const updatedUnits = allUnits.map(u => {
    const isJustReserved = u.unit_id === updatedUnit.unit_id;
    const isReservedInRedux = reservedUnits.some(r => r.unit_id === u.unit_id);
    return {
      ...u,
      status: isJustReserved || isReservedInRedux ? 'reserved' : 'available',
    };
  });
  console.log("updatedUnits,",updatedUnits)
  const similarUnits = updatedUnits.filter(
    u =>
      u.project_id === updatedUnit.project_id &&
      u.property_type === updatedUnit.property_type &&
      u.bedrooms === updatedUnit.bedrooms &&
      u.status === 'available'
  );

  console.log("triggeed,",similarUnits)
  similarUnits.forEach(u => { 
      dispatch(addDemandTrigger({
        unitId: u.unit_id,
        triggerType: 'high_demand',
        message: 'High demand for this unit type in this zone'
      }));
   
  });

  const totalUnits = updatedUnits.filter(u => u.project_id === updatedUnit.project_id).length;
  const availableUnits = updatedUnits.filter(
    u => u.project_id === updatedUnit.project_id && u.status === 'available'
  );

  const percentage = (availableUnits.length / totalUnits) * 100;
  if (percentage < 20) {
    availableUnits.forEach(u => {
      const alreadyLimited = existingTriggers.some(t => t.unitId === u.unit_id && t.triggerType === 'limited_availability');
      if (!alreadyLimited) {
        dispatch(addDemandTrigger({
          unitId: u.unit_id,
          triggerType: 'limited_availability',
          message: 'Limited availability - reserve within 48 hours'
        }))
       
        const expiresAt = Date.now() + 48 * 60 * 60 * 1000; // 48h in ms
        dispatch(updateCountdownTimer({
          unitId: u.unit_id,
          time: expiresAt
        }));
        
        ;
      }
    });
  }
};
