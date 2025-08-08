import { useDispatch, useSelector } from 'react-redux'
import { setSelectedZone } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockZones } from '../data/data'
import { MdBusiness } from 'react-icons/md'
import DropdownSelector from '../Utils/DropdownSelector'
import { useTranslate } from '../hooks/useTranslate'
import { translations } from '../types/translation'

const ZoneSelector = () => {
  const dispatch = useDispatch()
  const { selectedAreaId, selectedZoneId } = useSelector((state: RootState) => state.landingPage)
  const t = useTranslate()

  const filteredZones = mockZones.filter(zone => zone.area_id === selectedAreaId)

  const options = filteredZones.map(zone => ({
    id: zone.zone_id,
    label: t === translations.ar ? zone.zone_name_ar : zone.zone_name_en,
  }))

  return (
    <DropdownSelector
      icon={<MdBusiness className="text-green-600" />}
      title={t.selectZone}
      subtitle={t.chooseZone}
      placeholder={t.chooseZoneOption}
      value={selectedZoneId}
      onChange={(val) => dispatch(setSelectedZone(val))}
      options={options}
      disabled={!selectedAreaId}
    />
  )
}

export default ZoneSelector
