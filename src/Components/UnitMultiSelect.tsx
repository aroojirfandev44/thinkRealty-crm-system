import { useDispatch, useSelector } from 'react-redux'
import {  toggleUnit } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockUnits } from '../data/data'
import { BsGrid3X3Gap } from 'react-icons/bs'
import { FaCheck } from 'react-icons/fa'

const UnitMultiSelect = () => {
  const dispatch = useDispatch()
  const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)

  const filteredUnits = mockUnits.filter(unit => unit.project_id === selectedProject?.project_id)
  const isDisabled = !selectedProject

  return (
    <div className={`bg-white rounded-xl border p-6 ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <BsGrid3X3Gap className="text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Select Units</h3>
          <p className="text-sm text-gray-500">
            {isDisabled ? 'Please select a project first' : `Choose units from ${filteredUnits.length} available`}
          </p>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 max-h-64 overflow-y-auto">
        {filteredUnits.map((unit) => {
          const isSelected = selectedUnits.some(u => u.unit_id === unit.unit_id)
          return (
            <label
              key={unit.unit_id}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer ${
                isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-5 h-5 rounded border-2 ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'} flex items-center justify-center`}>
                  {isSelected && <FaCheck className="text-white w-3 h-3" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{unit.unit_number}</p>
                  <p className="text-xs text-gray-500">AED {unit.price.toLocaleString()}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  if (isSelected) dispatch(toggleUnit(unit))
                  else dispatch(toggleUnit(unit))
                }}
                className="sr-only"
              />
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default UnitMultiSelect

