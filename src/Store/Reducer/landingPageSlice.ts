import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  Area, Zone, Project, Unit,
  PricingResult, AvailabilityStatus, PersonalizationConfig,
  DemandTrigger, NotificationState, ConflictState,
  ValidationError, ActiveUser,
  ValidationReport
} from '../../types'
import { mockAreas } from '../../data/data';
import { runValidationChain } from '../../Utils/runValidationChain';

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
  reservedUnits: Unit[];
  allUnits: Unit[]; // ✅ Add this
  validationReport: ValidationReport[];
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
  validationReport: [], // ✅ initialize
  validationErrors: [],
  concurrentUsers: [],
  reservedUnits: [],
  allUnits: [], // ✅ initialize
}

const landingPageSlice = createSlice({
  name: 'landingPage',
  initialState,
  reducers: {
    // Area/Zone selection
    setSelectedArea(state, action: PayloadAction<number | null>) {
        state.selectedAreaId = action.payload;
        state.selectedZoneId = null;
        state.selectedProject = null;
        state.selectedUnits = [];
      
        const selectedArea = mockAreas.find(a => a.area_id === action.payload);
        if (selectedArea?.area_name_ar.includes('دبي')) {
          state.contentPersonalization.language = 'ar';
        } else {
          state.contentPersonalization.language = 'en';
        }
      }
      ,
    setSelectedZone(state, action: PayloadAction<number | null>) {
      state.selectedZoneId = action.payload
      state.selectedProject = null
      state.selectedUnits = []
    },

    setSelectedProject(state, action: PayloadAction<Project | null>) {
      state.selectedProject = action.payload
      state.selectedUnits = []
    },
    toggleUnit(state, action: PayloadAction<Unit>) {
        const unitId = action.payload.unit_id;
        const existing = state.selectedUnits.find(u => u.unit_id === unitId);
        const idx = state.allUnits.findIndex(u => u.unit_id === unitId);
      
        if (existing) {
          // Remove from selected/reserved
          state.selectedUnits = state.selectedUnits.filter(u => u.unit_id !== unitId);
          state.reservedUnits = state.reservedUnits.filter(u => u.unit_id !== unitId);
      
          if (idx !== -1) {
            // Update status in allUnits to 'available'
            state.allUnits[idx] = {
              ...state.allUnits[idx],
              status: 'available'
            };
          } else {
            
            state.allUnits.push({
              ...action.payload,
              status: 'available'
            });
          }
        } else {
        
          const reservedUnit = {
            ...action.payload,
            status: 'reserved' as const
          };
      
          state.selectedUnits.push(reservedUnit);
          state.reservedUnits.push(reservedUnit);
      
          if (idx !== -1) {
            state.allUnits[idx] = reservedUnit;
          } else {
            state.allUnits.push(reservedUnit);
          }
        }
      }
,      
      
      setAllUnits(state, action: PayloadAction<Unit[]>) {
        state.allUnits = action.payload
      },
      appendOrUpdateUnits(state, action: PayloadAction<Unit[]>) {
        action.payload.forEach(newUnit => {
          const existingIndex = state.allUnits.findIndex(
            u => u.unit_id === newUnit.unit_id
          );
      
          if (existingIndex !== -1) {
            state.allUnits[existingIndex] = newUnit;
          } else {
            state.allUnits.push(newUnit);
          }
         
        });
      }
,      
    setPricingCalculations(state, action: PayloadAction<PricingResult>) {
      state.pricingCalculations = action.payload
    },
    setValidationReport(state, action: PayloadAction<ValidationReport[]>) {
        state.validationReport = action.payload;
      },
      clearValidationReport(state) {
        state.validationReport = [];
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
    setContentPersonalizationFocus(state, action: PayloadAction<('investment' | 'family' | 'luxury')[]>) {
        state.contentPersonalization.focus = action.payload
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
        const exists = state.demandTriggers.find(
          t => t.unitId === action.payload.unitId && t.triggerType === action.payload.triggerType
        )
        if (!exists) {
          state.demandTriggers.push(action.payload)
        }
      },
            
    setConflict(state, action: PayloadAction<ConflictState>) {
      state.conflictResolution = action.payload
    },
    setValidationErrorsFromChain(
        state,
        action: PayloadAction<{ selectedUnits: Unit[]; project: Project }>
      ) {
        const { selectedUnits, project } = action.payload;
        const results = runValidationChain(selectedUnits, project);
      
        state.validationErrors = results
          .filter(r => !r.passed)
          .map(r => ({
            unitId: r.unitId,
            field: r.rule,
            message: r.message
          }));
      
        state.validationReport = results.map(({ rule, passed, riskLevel, suggestion, unitId, message }) => ({
          rule,
          passed,
          riskLevel,
          suggestion,
          unitId,
          message
        }));
      }
      
,      
      
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
  appendOrUpdateUnits,
  setSelectedZone,
  setValidationReport,
clearValidationReport,
  setSelectedProject,
  toggleUnit,
  setContentPersonalizationFocus,
  setAllUnits,
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
  setValidationErrorsFromChain,
  addValidationError,
  clearValidationErrors,
  updateConcurrentUsers,
  resetLandingPageState,
} = landingPageSlice.actions

export default landingPageSlice.reducer
