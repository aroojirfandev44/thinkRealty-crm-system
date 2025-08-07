import AreaSelector from './Components/AreaSelector'
import ProjectSelector from './Components/ProjectSelector'
import ZoneSelector from './Components/ZoneSelector'
import UnitMultiSelect from './Components/UnitMultiSelect'
import CalculatePrice from './Components/PricingCalculator'
import { FaBuilding } from 'react-icons/fa'
import { useTranslate } from './Utils/useTranslate'
import { useSelector } from 'react-redux'
import type { RootState } from './Store/Store'
import ContentPreview from './Components/ContentPreview'
import SmartNotificationCenter from './Components/SmartNotificationCenter'
import useSimulatePriceChange from './Components/useSimulatePriceChange'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ValidationSummary from './Components/ValidationSummary'
import AdaptiveLayoutManager from './Components/AdaptiveLayoutManager'
const App = () => {
  const t = useTranslate()
  const lang = useSelector((state: RootState) => state.landingPage.contentPersonalization.language)
  useSimulatePriceChange()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
              <FaBuilding className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              ThinkRealty
            </h1>
          </div>
          <p className="text-gray-600 text-lg">{t.realEstateHeader}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto space-y-6">
          <AreaSelector />
          <ZoneSelector />
          <ProjectSelector />
          <UnitMultiSelect />
          <CalculatePrice />
          <ValidationSummary/>
          <SmartNotificationCenter/>
          <AdaptiveLayoutManager />
          {/* <ConflictBanner/> */}
          <ContentPreview/>
          <ToastContainer position="top-right" autoClose={4000} hideProgressBar />

        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
          {t.footerText}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
