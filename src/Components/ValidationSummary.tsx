import { useSelector } from 'react-redux'
import type { RootState } from '../Store/Store'
import React from 'react'

const ValidationSummary = () => {
  const validationReport = useSelector((state: RootState) => state.landingPage.validationReport)

  if (!validationReport?.length) return null

  return (
    <div className="p-4 border border-gray-300 rounded-md mt-4 bg-white">
      <h3 className="text-lg font-bold mb-2 text-gray-900">Validation Summary</h3>
      <ul className="space-y-3">
        {validationReport.map((v, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg ${
              v.passed
                ? 'bg-green-100 text-green-900'
                : 'bg-red-200 text-red-900'
            }`}
          >
            <p className="font-semibold text-base">{v.rule}</p>
            <p className="font-medium mt-1">Status: {v.passed ? '✅ Passed' : '❌ Failed'}</p>
            {v.suggestion && (
              <p className="text-sm mt-1">Suggestion: {v.suggestion}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ValidationSummary
