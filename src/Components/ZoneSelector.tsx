import { useDispatch, useSelector } from 'react-redux'
import { setSelectedZone } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockZones } from '../data/data'
import { MdBusiness } from 'react-icons/md'
import { FaChevronDown } from 'react-icons/fa'

const ZoneSelector = () => {
  const dispatch = useDispatch()
  const selectedAreaId = useSelector((state: RootState) => state.landingPage.selectedAreaId)
  const selectedZoneId = useSelector((state: RootState) => state.landingPage.selectedZoneId)

  const filteredZones = mockZones.filter(zone => zone.area_id === selectedAreaId)
  const isDisabled = !selectedAreaId

  return (
    <div className={`bg-white rounded-xl border p-6 ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <MdBusiness className="text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Select Zone</h3>
          <p className="text-sm text-gray-500">Choose your zone within the area</p>
        </div>
      </div>
      <div className="relative">
        <select
          value={selectedZoneId ?? ''}
          onChange={(e) => dispatch(setSelectedZone(Number(e.target.value) || null))}
          disabled={isDisabled}
          className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-900"
        >
          <option value="">Choose Zone</option>
          {filteredZones.map((zone) => (
            <option key={zone.zone_id} value={zone.zone_id}>
              {zone.zone_name_en}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
}

export default ZoneSelector

