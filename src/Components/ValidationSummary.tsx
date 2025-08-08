import { useSelector } from 'react-redux'
import type { RootState } from '../Store/Store'
import { useTranslate } from '../Utils/useTranslate'
import { FaCheckCircle, FaExclamationTriangle, FaClipboardList, FaLightbulb } from 'react-icons/fa'

const ValidationSummary = () => {
  const validationReport = useSelector((state: RootState) => state.landingPage.validationReport)
  const t = useTranslate()

  if (!validationReport?.length) return null

  const passedCount = validationReport.filter(v => v.passed).length
  const failedCount = validationReport.filter(v => !v.passed).length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">

      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <FaClipboardList className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{t.validationSummary}</h3>
          <p className="text-sm text-gray-500">
            {passedCount} passed, {failedCount} failed
          </p>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-medium ${failedCount === 0
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
          }`}>
          {failedCount === 0 ? 'All Valid' : `${failedCount} Issues`}
        </div>
      </div>

      <div className="space-y-4">
        {validationReport.map((v, index) => (
          <div
            key={index}
            className={`relative p-4 rounded-lg border-l-4 transition-all duration-200 ${v.passed
                ? 'bg-green-50 border-l-green-500 hover:bg-green-100'
                : 'bg-red-50 border-l-red-500 hover:bg-red-100'
              }`}
          >
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${v.passed ? 'bg-green-500' : 'bg-red-500'
                }`}>
                {v.passed ? (
                  <FaCheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <FaExclamationTriangle className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-base mb-1 ${v.passed ? 'text-green-900' : 'text-red-900'
                  }`}>
                  {v.rule}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-600">{t.status}:</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.passed
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                    }`}>
                    {v.passed ? t.passed : t.failed}
                  </span>
                </div>

                {v.suggestion && (
                  <div className="flex items-start gap-2 mt-3 p-3 bg-white/70 rounded-lg border border-gray-200">
                    <FaLightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">{t.suggestion}:</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{v.suggestion}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      {failedCount > 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-medium text-amber-800">
              Please address the validation issues above before proceeding.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ValidationSummary
