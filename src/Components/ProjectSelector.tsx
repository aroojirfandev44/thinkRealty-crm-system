import { useDispatch, useSelector } from 'react-redux'
import { setSelectedProject } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockProjects } from '../data/data'
import { FaHome, FaChevronDown } from 'react-icons/fa'
import { useTranslate } from '../Utils/useTranslate'
import { translations } from '../types/translation'

const ProjectSelector = () => {
  const dispatch = useDispatch()
  const selectedZoneId = useSelector((state: RootState) => state.landingPage.selectedZoneId)
  const selectedProject = useSelector((state: RootState) => state.landingPage.selectedProject)
  const t = useTranslate()

  const filteredProjects = mockProjects.filter(p => p.zone_id === selectedZoneId)
  const isDisabled = !selectedZoneId

  return (
    <div className={`bg-white rounded-xl border p-6 ${isDisabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <FaHome className="text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t.selectProject}</h3>
          <p className="text-sm text-gray-500">{t.chooseProject}</p>
        </div>
      </div>
      <div className="relative">
        <select
          value={selectedProject?.project_id ?? ''}
          onChange={(e) => {
            const project = filteredProjects.find(p => p.project_id === Number(e.target.value))
            dispatch(setSelectedProject(project || null))
          }}
          disabled={isDisabled}
          className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pr-10 text-gray-900"
        >
          <option value="">{t.chooseProject}</option>
          {filteredProjects.map((project) => (
            <option key={project.project_id} value={project.project_id}>
             {t === translations.ar ? project.project_name_ar : project.project_name_en}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
}

export default ProjectSelector
