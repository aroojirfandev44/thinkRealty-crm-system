import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import type { RootState } from '../Store/Store'
import { calculateComplexPricing } from '../Utils/calculateComplexPricing'
import { setPricingCalculations } from '../Store/Reducer/landingPageSlice'
import { useTranslate } from '../Utils/useTranslate'
import { FaCalculator, FaDollarSign, FaChartLine, FaPercentage, FaTags, FaArrowRight } from 'react-icons/fa'

const CalculatePrice = () => {
  const dispatch = useDispatch()
  const t = useTranslate()
  const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
  const pricingResult = useSelector((state: RootState) => state.landingPage.pricingCalculations)

  useEffect(() => {
    if (!selectedProject || selectedUnits.length === 0) return
    const percentageSelected = (selectedUnits.length / selectedProject.total_units) * 100
    const result = calculateComplexPricing(selectedUnits, selectedProject, percentageSelected, t)
    dispatch(setPricingCalculations(result))
  }, [selectedProject, selectedUnits, dispatch])

  if (!pricingResult) return null

  const formatPrice = (price: number) => `AED ${price.toLocaleString()}`
  const percentageSelected = selectedProject ? (selectedUnits.length / selectedProject.total_units) * 100 : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
          <FaCalculator className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{t.pricingBreakdown}</h2>
          <p className="text-sm text-gray-500">
            {selectedUnits.length} units selected ({percentageSelected.toFixed(1)}% of project)
          </p>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full">
          <FaChartLine className="w-3 h-3 text-blue-600" />
          <span className="text-xs font-medium text-blue-700">Live Calculation</span>
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <FaTags className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Cost Breakdown</span>
        </div>
        
        {pricingResult.breakdown.map((line, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">{line}</p>
            </div>
            <FaArrowRight className="w-3 h-3 text-gray-400 mt-2" />
          </div>
        ))}
      </div>

      {/* Total Price Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <FaDollarSign className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800 mb-1">{t.totalPrice}</p>
              <p className="text-2xl font-bold text-emerald-900">
                {formatPrice(pricingResult.total)}
              </p>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <FaPercentage className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                {percentageSelected > 30 ? 'Bulk Discount Applied' : 'Standard Pricing'}
              </span>
            </div>
            <p className="text-xs text-emerald-600">
              Per unit: {formatPrice(pricingResult.total / selectedUnits.length)}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-600 font-bold text-sm">{selectedUnits.length}</span>
          </div>
          <p className="text-xs font-medium text-blue-800">Units Selected</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaPercentage className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xs font-medium text-purple-800">
            {percentageSelected.toFixed(1)}% of Project
          </p>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaDollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xs font-medium text-amber-800">
            Avg: {formatPrice(pricingResult.total / selectedUnits.length)}
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          <span className="font-medium">Note:</span> Prices include all applicable fees, taxes, and discounts. 
          Final pricing may vary based on payment terms and completion dates.
        </p>
      </div>
    </div>
  )
}

export default CalculatePrice
