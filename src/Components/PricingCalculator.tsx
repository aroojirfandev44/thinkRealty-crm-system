import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import type { RootState } from '../Store/Store'
import { calculateComplexPricing } from '../Utils/calculateComplexPricing'
import { setPricingCalculations } from '../Store/Reducer/landingPageSlice'
const CalculatePrice = () => {
  const dispatch = useDispatch()
  const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
  const selectedUnits = useSelector((state: RootState) => state.landingPage.selectedUnits)
  const pricingResult = useSelector((state: RootState) => state.landingPage.pricingCalculations)
  useEffect(() => {
    if (!selectedProject || selectedUnits.length === 0) return
    const percentageSelected = (selectedUnits.length / selectedProject.total_units) * 100
    const result = calculateComplexPricing(selectedUnits, selectedProject, percentageSelected)
    dispatch(setPricingCalculations(result))
  }, [selectedProject, selectedUnits, dispatch])
  if (!pricingResult) return null
  return (
    <div className="mt-6 bg-white p-6 shadow rounded-lg max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">:moneybag: Pricing Breakdown</h2>
      <ul className="list-disc pl-5 text-sm text-gray-700 mb-4">
        {pricingResult.breakdown.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
      <div className="text-lg font-bold text-green-700">
        Total Price: AED {pricingResult.total.toLocaleString()}
      </div>
    </div>
  )
}
export default CalculatePrice