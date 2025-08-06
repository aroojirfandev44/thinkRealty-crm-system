import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  Area, Zone, Project, Unit,
  PricingResult, AvailabilityStatus, PersonalizationConfig,
  DemandTrigger, NotificationState, ConflictState,
  ValidationError, ActiveUser
} from '../../types'

interface LandingPageState {
  selectedAreaId: number | null;
  selectedZoneId: number | null;
  selectedProject: Project | null;
  selectedUnits: Unit[];
  pricingCalculations: PricingResult | null;
  availabilityStatus: AvailabilityStatus | null;
  contentPersonalization: PersonalizationConfig;
  countdownTimers: { [unitId: number]: number };
  bulkDiscountEligible: boolean;
  demandTriggers: DemandTrigger[];
  notifications: NotificationState[];
  conflictResolution: ConflictState;
  layoutMode: 'standard' | 'compact' | 'performance' | 'focus';
  validationErrors: ValidationError[];
  concurrentUsers: ActiveUser[];
}

const initialState: LandingPageState = {
  selectedAreaId: null,
  selectedZoneId: null,
  selectedProject: null,
  selectedUnits: [],
  pricingCalculations: null,
  availabilityStatus: null,
  contentPersonalization: {
    language: 'en',
    currency: 'AED',
    theme: 'light',
  },
  countdownTimers: {},
  bulkDiscountEligible: false,
  demandTriggers: [],
  notifications: [],
  conflictResolution: {
    hasConflict: false,
    details: '',
  },
  layoutMode: 'standard',
  validationErrors: [],
  concurrentUsers: [],
}

const landingPageSlice = createSlice({
  name: 'landingPage',
  initialState,
  reducers: {
    // Area/Zone selection
    setSelectedArea(state, action: PayloadAction<number | null>) {
      state.selectedAreaId = action.payload
      state.selectedZoneId = null
      state.selectedProject = null
      state.selectedUnits = []
    },
    setSelectedZone(state, action: PayloadAction<number | null>) {
      state.selectedZoneId = action.payload
      state.selectedProject = null
      state.selectedUnits = []
    },

    // Project/Unit selection
    setSelectedProject(state, action: PayloadAction<Project | null>) {
      state.selectedProject = action.payload
      state.selectedUnits = []
    },
    toggleUnit(state, action: PayloadAction<Unit>) {
      const existing = state.selectedUnits.find(u => u.unit_id === action.payload.unit_id)
      if (existing) {
        state.selectedUnits = state.selectedUnits.filter(u => u.unit_id !== action.payload.unit_id)
      } else {
        state.selectedUnits.push(action.payload)
      }
    },

    // Pricing and availability
    setPricingCalculations(state, action: PayloadAction<PricingResult>) {
      state.pricingCalculations = action.payload
    },
    setAvailabilityStatus(state, action: PayloadAction<AvailabilityStatus>) {
      state.availabilityStatus = action.payload
    },

    // Timers & discounts
    updateCountdownTimer(state, action: PayloadAction<{ unitId: number; time: number }>) {
      state.countdownTimers[action.payload.unitId] = action.payload.time
    },
    setBulkDiscountEligible(state, action: PayloadAction<boolean>) {
      state.bulkDiscountEligible = action.payload
    },

    // Personalization & Layout
    setPersonalization(state, action: PayloadAction<PersonalizationConfig>) {
      state.contentPersonalization = action.payload
    },
    setLayoutMode(state, action: PayloadAction<LandingPageState['layoutMode']>) {
      state.layoutMode = action.payload
    },

    // Notifications
    addNotification(state, action: PayloadAction<NotificationState>) {
      state.notifications.push(action.payload)
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notif = state.notifications.find(n => n.id === action.payload)
      if (notif) notif.read = true
    },

    // Demand, Conflicts, Errors, Users
    addDemandTrigger(state, action: PayloadAction<DemandTrigger>) {
      state.demandTriggers.push(action.payload)
    },
    setConflict(state, action: PayloadAction<ConflictState>) {
      state.conflictResolution = action.payload
    },
    addValidationError(state, action: PayloadAction<ValidationError>) {
      state.validationErrors.push(action.payload)
    },
    clearValidationErrors(state) {
      state.validationErrors = []
    },
    updateConcurrentUsers(state, action: PayloadAction<ActiveUser[]>) {
      state.concurrentUsers = action.payload
    },

    resetLandingPageState() {
      return initialState
    },
  },
})

export const {
  setSelectedArea,
  setSelectedZone,
  setSelectedProject,
  toggleUnit,
  setPricingCalculations,
  setAvailabilityStatus,
  updateCountdownTimer,
  setBulkDiscountEligible,
  setPersonalization,
  setLayoutMode,
  addNotification,
  markNotificationRead,
  addDemandTrigger,
  setConflict,
  addValidationError,
  clearValidationErrors,
  updateConcurrentUsers,
  resetLandingPageState,
} = landingPageSlice.actions

export default landingPageSlice.reducer
