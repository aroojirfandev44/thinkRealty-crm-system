import { useSelector } from 'react-redux';
import type { RootState } from '../Store/Store';
import React from 'react';

const ValidationSummary = () => {
  const validationReport = useSelector((state: RootState) => state.landingPage.validationReport);

  if (!validationReport?.length) return null;

  return (
    <div className="p-4 border border-gray-300 rounded-md mt-4">
      <h3 className="text-lg font-bold mb-2">Validation Summary</h3>
      <ul className="space-y-2">
        {validationReport?.map((v, index) => (
          <li key={index} className={`p-2 rounded-md ${v.passed ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-semibold">{v.rule}</p>
            <p>Status: {v.passed ? '✅ Passed' : '❌ Failed'}</p>
            {v.suggestion && <p className="text-sm text-gray-700">Suggestion: {v.suggestion}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationSummary;
