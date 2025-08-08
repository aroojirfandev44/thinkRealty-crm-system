import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../Store/Store'
import { useTranslate } from '../Utils/useTranslate'
import { useEffect } from 'react'
import { generatePersonalizationConfig } from '../Utils/generatePersonalizationConfig'
import { setPersonalization } from '../Store/Reducer/landingPageSlice'
import { mockAreas } from '../data/data'
import { FaChartLine, FaHome, FaGem, FaEye, FaMagic } from 'react-icons/fa'

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
      const config = generatePersonalizationConfig(selectedUnits, selectedArea)
      dispatch(setPersonalization(config))
    }
  }, [selectedUnits, selectedProject, selectedArea])

  if (!focus || focus.length === 0) return null

  const focusItems = [
    {
      key: 'investment',
      icon: FaChartLine,
      title: t.investmentFocus,
      description: t.investmentDescription,
      colors: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-800',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
      },
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      key: 'family',
      icon: FaHome,
      title: t.familyFocus,
      description: t.familyDescription,
      colors: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'luxury',
      icon: FaGem,
      title: t.luxuryFocus,
      description: t.luxuryDescription,
      colors: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      gradient: 'from-purple-500 to-pink-500'
    }
  ]

  const activeFocusItems = focusItems.filter(item => focus.includes(item.key as 'investment' | 'family' | 'luxury'))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
          <FaEye className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{t.personalizedContent}</h2>
          <p className="text-sm text-gray-500">Content tailored to your selection</p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-indigo-100 rounded-full">
          <FaMagic className="w-3 h-3 text-indigo-600" />
          <span className="text-xs font-medium text-indigo-700">
            {activeFocusItems.length} Focus Area{activeFocusItems.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Focus Items */}
      <div className="space-y-4">
        {activeFocusItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div
              key={item.key}
              className={`relative overflow-hidden rounded-lg border-2 ${item.colors.border} ${item.colors.bg} p-4 transition-all duration-200 hover:shadow-md group`}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${item.gradient}`} />
              
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 ${item.colors.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${item.colors.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-base mb-2 ${item.colors.text}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${item.colors.text} opacity-90`}>
                    {item.description}
                  </p>
                </div>

                {/* Number badge */}
                <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center`}>
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
              </div>

              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white to-transparent pointer-events-none" />
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <FaMagic className="w-4 h-4 text-blue-600" />
          <p className="text-sm text-gray-700">
            <span className="font-medium">Smart Personalization:</span> Content automatically adapts based on your unit selection and preferences.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContentPreview
