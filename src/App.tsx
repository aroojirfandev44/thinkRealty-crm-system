import AreaSelector from './Components/AreaSelector'
import ProjectSelector from './Components/ProjectSelector'
import ZoneSelector from './Components/ZoneSelector'
import UnitMultiSelect from './Components/UnitMultiSelect'
import CalculatePrice from './Components/PricingCalculator'
import { FaBuilding, FaMapMarkedAlt, FaCogs, FaChartBar, FaChevronRight } from 'react-icons/fa'
import { useTranslate } from './hooks/useTranslate'
import { useSelector } from 'react-redux'
import type { RootState } from './Store/Store'
import ContentPreview from './Components/ContentPreview'
import SmartNotificationCenter from './Components/SmartNotificationCenter'
import useSimulatePriceChange from './hooks/useSimulatePriceChange'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ValidationSummary from './Components/ValidationSummary'
import AdaptiveLayoutManager from './Components/AdaptiveLayoutManager'

const App = () => {
  const t = useTranslate()
  const lang = useSelector((state: RootState) => state.landingPage.contentPersonalization.language)
  const selectedAreaId = useSelector((state: RootState) => state.landingPage.selectedAreaId)
  const selectedZoneId = useSelector((state: RootState) => state.landingPage.selectedZoneId)
  const selectedProjectId = useSelector((state: RootState) => state.landingPage.selectedProject)
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits) // Get selected units

  useSimulatePriceChange()

  const unitsSelected = selectedUnits.length > 0; // Determine if units are selected

  const steps = [
    { id: 'area', name: 'Select Area', isComplete: !!selectedAreaId },
    { id: 'zone', name: 'Select Zone', isComplete: !!selectedZoneId },
    { id: 'project', name: 'Select Project', isComplete: !!selectedProjectId },
    { id: 'units', name: 'Select Units', isComplete: unitsSelected }, // Use unitsSelected here
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Circles/Blobs for visual interest */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
        <header className="text-center mb-12 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg animate-bounce-slow">
              <FaBuilding className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                ThinkRealty
              </h1>
              <p className="text-lg text-gray-600 mt-1">{t.realEstateHeader}</p>
            </div>
          </div>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-6"></div>
        </header>

        {/* Step Indicator */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-4 flex justify-around items-center flex-wrap gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step.isComplete ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step.isComplete ? 'text-gray-800' : 'text-gray-500'
              } hidden sm:inline`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <FaChevronRight className="ml-2 text-gray-400 hidden sm:inline" />
              )}
            </div>
          ))}
        </div>

        {/* Main Content Grid - Conditional Layout */}
        <main className={`transition-all duration-500 ease-in-out ${
          unitsSelected 
            ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' 
            : 'max-w-2xl mx-auto space-y-6' // Centered single column
        }`}>
          {/* Left Column: Selectors */}
          <section className={`space-y-6 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 ${
            unitsSelected ? 'lg:col-span-2' : '' // Apply col-span only when units are selected
          }`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Selection</h2>
            <AreaSelector />
            <ZoneSelector />
            <ProjectSelector />
            <UnitMultiSelect />
          </section>

          {/* Right Column: Summaries & Tools */}
          <aside className={`space-y-6 ${
            unitsSelected ? 'lg:col-span-1' : '' // Apply col-span only when units are selected
          }`}>
            <CalculatePrice />
            <ValidationSummary />
            <ContentPreview />
            <SmartNotificationCenter />
            <AdaptiveLayoutManager />
          </aside>
        </main>

        {/* Footer Section */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            {t.footerText}
          </p>
          <div className="flex justify-center gap-4 mt-4 text-gray-400">
            <a href="#" className="hover:text-blue-600 transition-colors"><FaMapMarkedAlt className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><FaCogs className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-600 transition-colors"><FaChartBar className="w-5 h-5" /></a>
          </div>
        </footer>

        <ToastContainer position="top-right" autoClose={4000} hideProgressBar />
      </div>
    </div>
  )
}

export default App
