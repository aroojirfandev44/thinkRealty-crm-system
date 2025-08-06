import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


interface LandingPageState {
  selectedProject: string | null
  selectedUnits: string[]
}

const initialState: LandingPageState = {
  selectedProject: null,
  selectedUnits: [],
}

const landingPageSlice = createSlice({
  name: 'landingPage',
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<string>) {
      state.selectedProject = action.payload
    },
    toggleUnit(state, action: PayloadAction<string>) {
      const unitId = action.payload
      if (state.selectedUnits.includes(unitId)) {
        state.selectedUnits = state.selectedUnits.filter(id => id !== unitId)
      } else {
        state.selectedUnits.push(unitId)
      }
    },
  },
})

export const { setProject, toggleUnit } = landingPageSlice.actions
export default landingPageSlice.reducer
