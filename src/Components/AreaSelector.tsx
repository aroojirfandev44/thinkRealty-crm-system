import { useDispatch, useSelector } from 'react-redux'
import { setSelectedArea } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockAreas } from '../data/data'
import { FaMapMarkerAlt } from 'react-icons/fa'
import DropdownSelector from '../Utils/DropdownSelector'
import { useTranslate } from '../hooks/useTranslate'
import { translations } from '../types/translation'

const AreaSelector = () => {
  const dispatch = useDispatch()
  const selectedAreaId = useSelector((state: RootState) => state.landingPage.selectedAreaId)
  const t = useTranslate()

  const options = mockAreas.map(area => ({
    id: area.area_id,
    label: t === translations.ar ? area.area_name_ar : area.area_name_en,
  }))

  return (
    <DropdownSelector
      icon={<FaMapMarkerAlt className="text-blue-600" />}
      title={t.selectArea}
      subtitle={t.chooseLocation}
      placeholder={t.chooseArea}
      value={selectedAreaId}
      onChange={(val) => dispatch(setSelectedArea(val))}
      options={options}
    />
  )
}

export default AreaSelector
