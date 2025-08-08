import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../Store/Store'
import { setAllUnits, setConflict } from '../Store/Reducer/landingPageSlice'
import { useTranslate } from '../hooks/useTranslate'
import { FaExclamationTriangle, FaShieldAlt, FaSync, FaTimes, FaInfoCircle } from 'react-icons/fa'

const ConflictResolutionModal = () => {
  const conflict = useSelector((state: RootState) => state.landingPage.conflictResolution)
  const allUnits = useSelector((state: RootState) => state.landingPage.allUnits)
  const dispatch = useDispatch()
  const t = useTranslate()

  if (!conflict.hasConflict || conflict.mergeStrategy) return null

  const handleMerge = (strategy: 'keepLocal' | 'reloadRemote') => {
    dispatch(setConflict({ ...conflict, mergeStrategy: strategy }))
    if (strategy === 'reloadRemote') {
      const updatedUnits = allUnits.map(unit =>
        unit.unit_id === conflict.conflictProjectId
          ? { ...unit, price: unit.price + 100000 } : unit
      )
      dispatch(setAllUnits(updatedUnits))
    }
  }

  const handleClose = () => {
    dispatch(setConflict({ ...conflict, hasConflict: false }))
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-500 to-orange-500 rounded-t-2xl p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.conflictDetected || 'Conflict Detected'}</h2>
              <p className="text-red-100 text-sm">Immediate attention required</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Alert Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-800 font-medium mb-1">Data Conflict Detected</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  {conflict.details}
                </p>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t.howResolve || 'How would you like to resolve this?'}
            </h3>
            <p className="text-gray-600 text-sm">
              Choose your preferred resolution strategy below:
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Keep Local Selection */}
            <button
              onClick={() => handleMerge('keepLocal')}
              className="w-full flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 hover:border-green-300 rounded-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-green-100 group-hover:bg-green-200 rounded-lg flex items-center justify-center">
                <FaShieldAlt className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-green-900">
                  {t.keepMySelection || 'Keep My Selection'}
                </p>
                <p className="text-green-700 text-sm">
                  Maintain your current choices and ignore external changes
                </p>
              </div>
            </button>

            {/* Reload Remote Data */}
            <button
              onClick={() => handleMerge('reloadRemote')}
              className="w-full flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-300 rounded-lg transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center">
                <FaSync className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-blue-900">
                  {t.reloadLatestData || 'Reload Latest Data'}
                </p>
                <p className="text-blue-700 text-sm">
                  Update with the most recent information from the server
                </p>
              </div>
            </button>
          </div>

          {/* Warning Footer */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="w-4 h-4 text-gray-500" />
              <p className="text-xs text-gray-600">
                <span className="font-medium">Note:</span> This action cannot be undone. Please choose carefully.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConflictResolutionModal
