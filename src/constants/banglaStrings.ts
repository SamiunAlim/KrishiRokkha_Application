/**
 * Centralized Bangla strings dictionary for CropDiseaseApp.
 * Designed for low-literacy rural farmers in Bangladesh with clear, natural language.
 */
export const BanglaStrings = {
  appName: 'কৃষি রক্ষা',
  appTagline: 'ফসলের রোগ শনাক্ত ও সমাধান',
  welcomeFarmer: 'স্বাগতম কৃষক ভাই',
  
  // Navigation & Actions
  scanNow: 'স্ক্যান করুন',
  scanCrop: 'ফসল স্ক্যান',
  galleryPick: 'গ্যালারি থেকে নিন',
  takePhoto: 'ছবি তুলুন',
  retake: 'আবার ছবি তুলুন',
  history: 'ইতিহাস',
  treatment: 'চিকিৎসা নির্দেশিকা',
  help: 'কৃষি সহায়তা',
  settings: 'সেটিংস',
  save: 'সংরক্ষণ',
  savedSuccess: 'স্ক্যান তথ্য সংরক্ষিত হয়েছে',
  share: 'শেয়ার করুন',
  delete: 'মুছুন',
  confirmDelete: 'আপনি কি এই রেকর্ডটি মুছে ফেলতে চান?',
  cancel: 'বাতিল',
  confirm: 'হ্যাঁ, মুছুন',
  back: 'ফিরে যান',
  home: 'মূল পাতা',
  retry: 'আবার চেষ্টা করুন',
  listenAudio: 'পরামর্শ শুনুন',
  stopAudio: 'থামুন',
  playingAudio: 'পরামর্শ পড়া হচ্ছে...',

  // Home Screen
  heroTitle: 'আপনার ফসলের পাতার ছবি তুলুন\nএবং তাৎক্ষণিক রোগ নির্ণয় করুন',
  recentScans: 'সাম্প্রতিক স্ক্যান',
  viewAll: 'সব দেখুন',
  noRecentScans: 'এখনও কোনো স্ক্যান করা হয়নি। আপনার ফসলের ছবি তুলে রোগ নির্ণয় করুন।',
  helplineCall: 'কৃষি কল সেন্টার (১৬১২৩)',
  helplineDesc: 'সরাসরি কৃষি কর্মকর্তার সাথে কথা বলুন (বিনামূল্যে)',

  // Camera & Scan Screen
  alignLeafInFrame: 'পাতাটি ফ্রেমের মধ্যে রাখুন',
  cameraTip: 'ভালো আলোতে আক্রান্ত পাতার স্পষ্ট ছবি তুলুন',
  cameraPermissionTitle: 'ক্যামেরার অনুমতি প্রয়োজন',
  cameraPermissionDesc: 'ফসলের রোগ শনাক্ত করতে ক্যামেরা ব্যবহারের অনুমতি দিন।',
  grantPermission: 'অনুমতি দিন',
  flashOn: 'ফ্ল্যাশ চালু',
  flashOff: 'ফ্ল্যাশ বন্ধ',
  processingImage: 'ছবি বিশ্লেষণ করা হচ্ছে...',
  aiDiagnosing: 'এআই মডেল রোগ নির্ণয় করছে...',

  // Result Screen
  resultTitle: 'রোগ নির্ণয়ের ফলাফল',
  diseaseName: 'শনাক্তকৃত রোগ / সমস্যা',
  confidence: 'নিশ্চিততা',
  severity: 'ক্ষতির মাত্রা',
  healthyStatus: 'সুস্থ ফসল',
  infectedStatus: 'রোগাক্রান্ত',
  healthyDesc: 'মাশাআল্লাহ! আপনার ফসলের পাতা সুস্থ দেখাচ্ছে। কোনো দৃশ্যমান রোগ নেই।',
  diseaseDetails: 'রোগের লক্ষণ ও কারণ',
  organicTreatment: 'জৈব ও প্রাকৃতিক প্রতিকার',
  chemicalTreatment: 'রাসায়নিক চিকিৎসা',
  preventionTips: 'ভবিষ্যৎ প্রতিরোধমূলক ব্যবস্থা',
  locationCaptured: 'শনাক্তকরণ এলাকা',
  unknownLocation: 'বাংলাদেশ',
  scannedAt: 'স্ক্যানের সময়',

  // Severity labels
  severityLow: 'কম',
  severityMedium: 'মাঝারি',
  severityHigh: 'মারাত্মক',

  // History Screen
  myScans: 'আমার স্ক্যানের ইতিহাস',
  totalScans: 'মোট স্ক্যান',
  sickCount: 'আক্রান্ত',
  healthyCount: 'সুস্থ',
  allFilter: 'সকল',
  sickFilter: 'আক্রান্ত',
  healthyFilter: 'সুস্থ',
  emptyHistoryTitle: 'কোনো স্ক্যান রেকর্ড পাওয়া যায়নি',
  emptyHistoryDesc: 'ফসলের ছবি তুলে সংরক্ষণ করলে এখানে দেখতে পাবেন।',

  // Settings & Sync Screen
  settingsTitle: 'সেটিংস ও তথ্য',
  offlineMode: 'অফলাইন মোড',
  offlineModeDesc: 'ইন্টারনেট ছাড়াই এআই মডেল আপনার ফোনে সরাসরি কাজ করবে।',
  syncStatus: 'ক্লাউড সিঙ্ক স্ট্যাটাস',
  syncNow: 'এখনই সিঙ্ক করুন',
  syncing: 'সিঙ্ক হচ্ছে...',
  allSynced: 'সকল তথ্য ক্লাউডে সিঙ্ক করা হয়েছে',
  pendingSync: 'টি রেকর্ড সিঙ্কের অপেক্ষায় আছে',
  storageInfo: 'মেমরি ও ডেটা',
  clearCache: 'ক্যাশ ডেটা মুছুন',
  clearCacheConfirm: 'সব লোকাল ক্যাশ মুছে ফেলা হবে। আপনি কি নিশ্চিত?',
  cacheCleared: 'ক্যাশ সফলভাবে মুছে ফেলা হয়েছে',
  aboutApp: 'অ্যাপ সম্পর্কে',
  version: 'ভার্সন ১.০.০ (বাংলাদেশ এডিশন)',
  modelInfo: 'এআই মডেল: প্ল্যান্টভিলেজ সিএনএন (PlantVillage CNN)',
  emergencyContacts: 'জরুরি কৃষি সেবা',
  daeBangladesh: 'কৃষি সম্প্রসারণ অধিদপ্তর (DAE)',
  brri: 'বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (BRRI)',
  bari: 'বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (BARI)',

  // Error Messages
  errorGeneral: 'একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
  errorNoImage: 'কোনো ছবি পাওয়া যায়নি।',
  errorModelInference: 'ছবিটি শনাক্ত করতে সমস্যা হয়েছে। পরিষ্কারভাবে আরেকটি ছবি তুলুন।',
  errorLocationPermission: 'জিপিএস লোকেশন চালু করলে আপনার এলাকার রোগ মনিটরিং সহজ হবে।',
  networkOfflineAlert: 'আপনি অফলাইনে আছেন। তথ্য ফোনে সংরক্ষিত হয়েছে এবং অনলাইন হলে স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।',
};
