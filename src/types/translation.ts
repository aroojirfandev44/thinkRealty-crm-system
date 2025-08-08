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
    validationSummary: 'Validation Summary',
    status: 'Status',
    passed: '✅ Passed',
    failed: '❌ Failed',
    suggestion: 'Suggestion',
    priceUpdated: 'Price updated for unit',
    conflictDetected: 'Another user modified project',
    areaRatioRule: 'Total selected area vs. common area (max 1.2x)',
    areaSuggestion: 'Reduce number or size of selected units',
    areaPassMessage: 'Total selected area is within the limit',
    areaFailMessage: 'Selected area ({selected} sqft) exceeds limit ({limit} sqft)',

    luxuryRule: 'Luxury features (balcony + parking + 4+ bedrooms) max 40%',
    luxurySuggestion: 'Reduce number of luxury-featured units',
    luxuryPassMessage: 'Luxury unit ratio is within the allowed limit',
    luxuryFailMessage: '{percent}% luxury units exceeds 40% limit',

    phaseRule: 'Phase conflict across selected units',
    phaseSuggestion: 'Avoid mixing units from different completion statuses',
    phasePassMessage: 'All units are from the same phase',
    phaseFailMessage: 'Units from multiple phases selected ({statuses})',

    howResolve: 'How would you like to resolve this?',
    keepMySelection: 'Keep My Selection',
    reloadLatestData: 'Reload Latest Data',





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
    validationSummary: 'ملخص التحقق',
    status: 'الحالة',
    passed: '✅ ناجح',
    failed: '❌ فشل',
    suggestion: 'اقتراح',
    priceUpdated: 'تم تحديث السعر للوحدة',
    conflictDetected: 'قام مستخدم آخر بتعديل المشروع',
    areaRatioRule: 'إجمالي المساحة المحددة مقابل المساحة المشتركة (الحد الأقصى 1.2x)',
    areaSuggestion: 'قلل عدد أو حجم الوحدات المحددة',
    areaPassMessage: 'إجمالي المساحة المحددة ضمن الحد المسموح',
    areaFailMessage: 'المساحة المحددة ({selected} قدم²) تتجاوز الحد المسموح ({limit} قدم²)',

    luxuryRule: 'الميزات الفاخرة (شرفة + موقف سيارات + 4 غرف نوم أو أكثر) بحد أقصى 40%',
    luxurySuggestion: 'قلل عدد الوحدات ذات الميزات الفاخرة',
    luxuryPassMessage: 'نسبة الوحدات الفاخرة ضمن الحد المسموح',
    luxuryFailMessage: 'نسبة الوحدات الفاخرة ({percent}٪) تتجاوز الحد المسموح 40٪',

    phaseRule: 'تضارب في مراحل إنجاز الوحدات المحددة',
    phaseSuggestion: 'تجنب اختيار وحدات من مراحل إنجاز مختلفة',
    phasePassMessage: 'جميع الوحدات من نفس المرحلة',
    phaseFailMessage: 'تم اختيار وحدات من مراحل مختلفة ({statuses})',

    howResolve: 'كيف تود حل هذا التعارض؟',
    keepMySelection: 'احتفظ باختياري',
    reloadLatestData: 'تحميل البيانات الأحدث',




  }
}
