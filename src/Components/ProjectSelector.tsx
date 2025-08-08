import { useDispatch, useSelector } from 'react-redux'
import { setSelectedProject } from '../Store/Reducer/landingPageSlice'
import type { RootState } from '../Store/Store'
import { mockProjects } from '../data/data'
import { FaHome } from 'react-icons/fa'
import DropdownSelector from './DropdownSelector'
import { useTranslate } from '../Utils/useTranslate'
import { translations } from '../types/translation'

const ProjectSelector = () => {
  const dispatch = useDispatch()
  const { selectedZoneId, selectedProject } = useSelector((state: RootState) => state.landingPage)
  const t = useTranslate()

  const filteredProjects = mockProjects.filter(p => p.zone_id === selectedZoneId)

  const options = filteredProjects.map(project => ({
    id: project.project_id,
    label: t === translations.ar ? project.project_name_ar : project.project_name_en,
  }))

  return (
    <DropdownSelector
      icon={<FaHome className="text-purple-600" />}
      title={t.selectProject}
      subtitle={t.chooseProject}
      placeholder={t.chooseProjectOption}
      value={selectedProject?.project_id ?? ''}
      onChange={(val) => {
        const project = filteredProjects.find(p => p.project_id === val)
        dispatch(setSelectedProject(project || null))
      }}
      options={options}
      disabled={!selectedZoneId}
    />
  )
}

export default ProjectSelector
