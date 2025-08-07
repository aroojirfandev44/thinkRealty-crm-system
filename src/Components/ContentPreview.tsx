import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../Store/Store'
import { useTranslate } from '../Utils/useTranslate'
import { useEffect } from 'react'
import { generatePersonalizationConfig } from '../Utils/generatePersonalizationConfig'
import { setPersonalization } from '../Store/Reducer/landingPageSlice'
import { mockAreas } from '../data/data' 

const ContentPreview = () => {
  const dispatch = useDispatch()
  const t = useTranslate()

  const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
  const selectedAreaId = useSelector((state: RootState) => state.landingPage.selectedAreaId)
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
  const { focus } = useSelector((state: RootState) => state.landingPage.contentPersonalization)

  const selectedArea = mockAreas.find(area => area.area_id === selectedAreaId)

  useEffect(() => {
    if (selectedUnits.length > 0 && selectedProject && selectedArea) {
      const config = generatePersonalizationConfig(selectedUnits, selectedProject, selectedArea)
      dispatch(setPersonalization(config))
    }
  }, [selectedUnits, selectedProject, selectedArea])

  if (!focus || focus.length === 0) return null

  return (
    <div className="mt-6 bg-white p-6 shadow rounded-lg max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-indigo-700">{t.personalizedContent}</h2>

      {focus.includes('investment') && (
        <div className="p-3 border border-green-200 rounded bg-green-50 text-green-700">
          💹 <strong>{t.investmentFocus}</strong>: {t.investmentDescription}
        </div>
      )}

      {focus.includes('family') && (
        <div className="p-3 border border-blue-200 rounded bg-blue-50 text-blue-700">
          👨‍👩‍👧 <strong>{t.familyFocus}</strong>: {t.familyDescription}
        </div>
      )}

      {focus.includes('luxury') && (
        <div className="p-3 border border-purple-200 rounded bg-purple-50 text-purple-700">
          💎 <strong>{t.luxuryFocus}</strong>: {t.luxuryDescription}
        </div>
      )}
    </div>
  )
}

export default ContentPreview
