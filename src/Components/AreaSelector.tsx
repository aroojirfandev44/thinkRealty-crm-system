
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedArea } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockAreas } from '../data/data'
import { FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa'
import { useTranslate } from '../Utils/useTranslate'
import { translations } from '../types/translation'

const AreaSelector = () => {
    const dispatch = useDispatch()
    const selectedAreaId = useSelector((state: RootState) => state.landingPage.selectedAreaId)
    const t = useTranslate()
  
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t.selectArea}</h3>
            <p className="text-sm text-gray-500">{t.chooseLocation}</p>
          </div>
        </div>
  
        <div className="relative">
          <select
            value={selectedAreaId ?? ''}
            onChange={(e) => dispatch(setSelectedArea(Number(e.target.value) || null))}
            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t.chooseArea}</option>
            {mockAreas.map(area => (
              <option key={area.area_id} value={area.area_id}>
                {t === translations.ar ? area.area_name_ar : area.area_name_en}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    )
  }
  export default AreaSelector