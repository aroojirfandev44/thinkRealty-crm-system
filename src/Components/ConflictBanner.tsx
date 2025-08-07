// components/ConflictBanner.tsx
import { useSelector } from 'react-redux'
import type { RootState } from '../Store/Store'

const ConflictBanner = () => {
  const conflict = useSelector((state: RootState) => state.landingPage.conflictResolution)

  if (!conflict.hasConflict) return null

  return (
    <div className="bg-red-100 text-red-800 px-4 py-2 rounded shadow mt-4">
      <strong>Conflict detected:</strong> {conflict.details}  
      <div className="text-sm mt-2">Consider reloading or choosing a merge strategy.</div>
    </div>
  )
}

export default ConflictBanner
