import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../Store/Store'
import { setAllUnits, setConflict } from '../Store/Reducer/landingPageSlice'

const ConflictResolutionModal = () => {
  const conflict = useSelector((state: RootState) => state.landingPage.conflictResolution)
  const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
  const dispatch = useDispatch()

  if (!conflict.hasConflict || conflict.mergeStrategy) return null

  const handleMerge = (strategy: 'keepLocal' | 'reloadRemote') => {
    dispatch(setConflict({ ...conflict, mergeStrategy: strategy }))

    if (strategy === 'reloadRemote') {
     
      const updatedUnits = allUnits.map(unit =>
        unit.unit_id === conflict.conflictProjectId
          ? { ...unit, price: unit.price + 100000 } // Simulate remote update
          : unit
      )
      dispatch(setAllUnits(updatedUnits))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[100]">
      <div className="bg-white w-[90%] max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Conflict Detected</h2>
        <p className="mb-4 text-gray-700">{conflict.details}</p>
        <p className="mb-4">How would you like to resolve this?</p>
        <div className="flex justify-between">
          <button
            onClick={() => handleMerge('keepLocal')}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Keep My Selection
          </button>
          <button
            onClick={() => handleMerge('reloadRemote')}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Reload Latest Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConflictResolutionModal
