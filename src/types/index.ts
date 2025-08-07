// Area Interface
export interface Area {
  area_id: number
  area_name_en: string
  area_name_ar: string
}

// Zone Interface
export interface Zone {
  zone_id: number
  area_id: number
  zone_name_en: string
  zone_name_ar: string
}

// Project Interface
export interface Project {
  project_id: number
  project_name_en: string
  project_name_ar: string
  area_id: number
  zone_id: number
  completion_status: 'ready' | 'under_construction' | 'off_plan' 
  min_price: number
  max_price: number
  total_units: number
  available_units: number
}

// Unit Interface
export interface Unit {
  unit_id: number
  project_id: number
  unit_number: string
  property_type: 'apartment' | 'villa' | 'townhouse ' | 'studio'
  bedrooms: number
  area_sqft: number
  price: number
  status: 'available' | 'sold' | 'reserved'
  floor_level: number
  has_balcony: boolean
  has_parking: boolean
}

export interface PricingResult {
  total: number
  breakdown: string[]
}

// types.ts
export interface AvailabilityStatus {
  projectId: number;
  availableUnits: number;
}

export interface PersonalizationConfig {
  language: 'en' | 'ar'
  currency: 'AED' | 'USD'
  theme: 'light' | 'dark'
  focus?: ('investment' | 'family' | 'luxury')[]
}


export interface DemandTrigger {
  unitId: number;
  triggerType: string;
  message: string;
}

export interface NotificationState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  read: boolean;
}

export interface ConflictState {
  hasConflict: boolean;
  details: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ActiveUser {
  userId: string;
  username: string;
}
