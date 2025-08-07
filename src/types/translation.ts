export const translations = {
    en: {
      selectArea: 'Select Area',
      chooseLocation: 'Choose your preferred location',
      chooseArea: 'Choose Area',
      selectZone: 'Select Zone',
      chooseZone: 'Choose your zone within the area',
      chooseZoneOption: 'Choose Zone',
  
      // Project & Units
      selectProject: 'Select Project',
      chooseProject: 'Choose your project within the zone',
      chooseProjectOption: 'Choose Project',
      selectUnits: 'Select Units',
      chooseUnitsFrom: 'Choose units from',
      available: 'available',
      selectProjectFirst: 'Please select a project first',
  
      // Demand & Reservation
      reserved: 'Reserved',
      highDemand: '🔥 High Demand',
      limitedAvailability: '⚠️ Limited',
      reserveIn: '⏳ Reserve in',
      personalizedContent: "Personalized Recommendations",
      investmentFocus: "Investment Focus",
      familyFocus: "Family Focus",
      luxuryFocus: "Luxury Focus",
      investmentDescription: "High ROI expected due to popular unit types (studio/1BR).",
      familyDescription: "Ideal for families with multiple bedrooms and amenities.",
      luxuryDescription: "Premium units with high price per sqft indicate luxury demand.",
      // Headers & Footer
      realEstateHeader: 'Real Estate Selection Platform',
      totalPrice: 'Total Price',
      pricingBreakdown: '💰 Pricing Breakdown',
      footerText: '© 2024 ThinkRealty. Professional Real Estate Solutions.',
      floorAdjustmentLow: (floor: number, unit: string) => `+5% for floor ${floor} of unit ${unit}`,
      floorAdjustmentHigh: (floor: number, unit: string) => `+12% for floor ${floor} of unit ${unit}`,
      balconyAdjustment: (unit: string) => `+8% for balcony in unit ${unit}`,
      parkingAdjustment: (unit: string) => `+AED 15,000 for parking in unit ${unit}`,
      bulkDiscount: '-3% bulk discount applied',
      futureAppreciation: '+15% future appreciation for off-plan project',
    },
    ar: {
      selectArea: 'اختر المنطقة',
      chooseLocation: 'اختر موقعك المفضل',
      chooseArea: 'اختر المنطقة',
      selectZone: 'اختر المنطقة الفرعية',
      chooseZone: 'اختر منطقتك داخل المنطقة',
      chooseZoneOption: 'اختر المنطقة الفرعية',
  
      // Project & Units
      selectProject: 'اختر المشروع',
      chooseProject: 'اختر مشروعك ضمن المنطقة الفرعية',
      chooseProjectOption: 'اختر المشروع',
      selectUnits: 'اختر الوحدات',
      chooseUnitsFrom: 'اختر الوحدات من بين',
      available: 'متاحة',
      selectProjectFirst: 'يرجى اختيار مشروع أولاً',
  
      // Demand & Reservation
      reserved: 'محجوز',
      highDemand: '🔥 طلب مرتفع',
      limitedAvailability: '⚠️ توافر محدود',
      reserveIn: '⏳ احجز خلال',
  
      // Headers & Footer
      realEstateHeader: 'منصة اختيار العقارات',
      totalPrice: 'السعر الإجمالي',
      pricingBreakdown: '💰 تفصيل التسعير',
      footerText: '© 2024 ThinkRealty. حلول عقارية احترافية.',
      floorAdjustmentLow: (floor: number, unit: string) => `+5٪ للطابق ${floor} في الوحدة ${unit}`,
      floorAdjustmentHigh: (floor: number, unit: string) => `+12٪ للطابق ${floor} في الوحدة ${unit}`,
      balconyAdjustment: (unit: string) => `+8٪ لشرفة في الوحدة ${unit}`,
      parkingAdjustment: (unit: string) => `+15,000 درهم لموقف سيارة في الوحدة ${unit}`,
      bulkDiscount: '-3٪ خصم جماعي تم تطبيقه',
      futureAppreciation: '+15٪ زيادة في القيمة لمشروع قيد الإنشاء',
       personalizedContent: "توصيات مخصصة",
    investmentFocus: "التركيز على الاستثمار",
    familyFocus: "التركيز على العائلة",
    luxuryFocus: "التركيز على الفخامة",
    investmentDescription: "عائد استثماري مرتفع متوقع بسبب الوحدات الشائعة (استوديو/غرفة واحدة).",
    familyDescription: "مثالية للعائلات مع غرف نوم متعددة وخدمات مميزة.",
    luxuryDescription: "الوحدات الفاخرة ذات السعر العالي لكل قدم مربع تشير إلى طلب فاخر.",
 
    }
  }
  