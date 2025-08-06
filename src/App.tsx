import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './Store/Store'
import { setProject, toggleUnit } from './Store/Reducer/landingPageSlice'

const App = () => {
  const dispatch = useDispatch()
  const project = useSelector((state: RootState) => state.landingPage.selectedProject)
  const units = useSelector((state: RootState) => state.landingPage.selectedUnits)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600">Redux Toolkit Test</h1>

      <div className="mt-4 space-x-4">
        <button
          onClick={() => dispatch(setProject('Project A'))}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Set Project
        </button>

        <button
          onClick={() => dispatch(toggleUnit('unit_1'))}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Toggle Unit 1
        </button>
      </div>

      <div className="mt-6">
        <p>Selected Project: <strong>{project}</strong></p>
        <p>Selected Units: <strong>{units.join(', ')}</strong></p>
      </div>
    </div>
  )
}

export default App
