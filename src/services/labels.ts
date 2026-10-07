/**
 * Disease and Pest Knowledge Base with 38+ PlantVillage & Bangladesh Agricultural classes.
 * Each class contains detailed Bangla (বাংলা) and English metadata, symptom analysis,
 * organic remedies, chemical treatments, and prevention guidelines.
 */

export interface DiseaseInfo {
  id: string;
  classIndex: number;
  cropBn: string;
  cropEn: string;
  diseaseBn: string;
  diseaseEn: string;
  scientificName?: string;
  isHealthy: boolean;
  severity: 'low' | 'medium' | 'high';
  pathogenType: 'ছত্রাক (Fungus)' | 'ব্যাকটেরিয়া (Bacteria)' | 'ভাইরাস (Virus)' | 'কীটপতঙ্গ (Pest)' | 'কোনোটি নয় (Healthy)';
  symptomsBn: string[];
  organicTreatmentBn: string[];
  chemicalTreatmentBn: string[];
  preventionBn: string[];
  audioSummaryBn: string;
  emoji: string;
}

export const DISEASE_DATABASE: Record<string, DiseaseInfo> = {
  // Rice / ধান (Crucial for Bangladesh)
  'rice_blast': {
    id: 'rice_blast',
    classIndex: 0,
    cropBn: 'ধান',
    cropEn: 'Rice',
    diseaseBn: 'ধানের ব্লাস্ট রোগ',
    diseaseEn: 'Rice Blast',
    scientificName: 'Magnaporthe oryzae',
    isHealthy: false,
    severity: 'high',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতায় চোখের আকৃতির বা নৌকার মতো বাদামী দাগ সৃষ্টি হয় যার কেন্দ্র ধূসর।',
      'আক্রমণ তীব্র হলে সম্পূর্ণ পাতা ঝলসে পুড়ে যাওয়ার মতো শুকিয়ে যায়।',
      'শীষের গোড়ায় আক্রমণ করলে ধান চিটা হয়ে যায় (শীষ ব্লাস্ট)।'
    ],
    organicTreatmentBn: [
      'নিম তেল (প্রতি লিটার পানিতে ৩-৫ মিলি) ভালো করে মিশিয়ে স্প্রে করুন।',
      'আক্রান্ত জমির নাড়া ও আগাছা পুড়িয়ে ফেলুন।',
      'জমিতে পরিমিত পানি ধরে রাখুন, জমি যাতে শুকিয়ে না যায়।'
    ],
    chemicalTreatmentBn: [
      'ট্রাইসাইক্লাজল ৭৫ ডব্লিউপি (যেমন ট্রপার / ট্রাইজল) প্রতি লিটার পানিতে ০.৭৫ গ্রাম মিশিয়ে স্প্রে করুন।',
      'অথবা নেটিভো ৭৫ ডব্লিউজি প্রতি লিটার পানিতে ০.৬ গ্রাম স্প্রে করুন।',
      'বিকালে স্প্রে করুন এবং ৭-১০ দিন পর আরেকবার প্রয়োগ করুন।'
    ],
    preventionBn: [
      'ব্লাস্ট সহনশীল জাত যেমন ব্রি ধান ২৮ পরিহার করে ব্রি ধান ৮৯, ব্রি ধান ৯২ চাষ করুন।',
      'ইউরিয়া সার অতিরিক্ত মাত্রায় ব্যবহার করবেন না, পটাশ সার সঠিক অনুপাতে দিন।'
    ],
    audioSummaryBn: 'আপনার ধান ফসলে ব্লাস্ট রোগ শনাক্ত হয়েছে। এটি একটি মারাত্মক ছত্রাকজনিত রোগ। অবিলম্বে ট্রাইসাইক্লাজল অথবা নেটিভো ছত্রাকনাশক স্প্রে করুন এবং ইউরিয়া সার ব্যবহার কমিয়ে পটাশ সার প্রয়োগ করুন।',
    emoji: '🌾',
  },
  'rice_bacterial_blight': {
    id: 'rice_bacterial_blight',
    classIndex: 1,
    cropBn: 'ধান',
    cropEn: 'Rice',
    diseaseBn: 'ধানের পাতাপোড়া / ব্যাকটেরিয়াল ব্লাইট',
    diseaseEn: 'Bacterial Leaf Blight',
    scientificName: 'Xanthomonas oryzae',
    isHealthy: false,
    severity: 'high',
    pathogenType: 'ব্যাকটেরিয়া (Bacteria)',
    symptomsBn: [
      'পাতার ডগা বা কিনারা থেকে হলুদ বা ধূসর ঢেউ খেলানো দাগ শুরু হয়ে নিচে নামে।',
      'ভোরের দিকে পাতার ওপর ক্ষুদ্র ক্ষুদ্র হলুদাভ ব্যাকটেরিয়ার ফোঁটা দেখা যেতে পারে।',
      'গাছ দ্রুত শুকিয়ে খড়ের মতো হয়ে যায়।'
    ],
    organicTreatmentBn: [
      'জমিতে বিঘা প্রতি ৫ কেজি অতিরিক্ত এমওপি (পটাশ) সার ছিটিয়ে দিন।',
      'গোবর সারের সাথে ট্রাইকোডার্মা মিশিয়ে জমিতে প্রয়োগ করুন।'
    ],
    chemicalTreatmentBn: [
      'কপার হাইড্রোক্সাইড (যেমন চ্যাম্পিয়ন) প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।',
      'অথবা থিওভিট প্রতি লিটার পানিতে ২ গ্রাম ও ব্যাকট্রোট্রব ০.৪ গ্রাম একত্রে মিশিয়ে প্রয়োগ করুন।'
    ],
    preventionBn: [
      'আক্রান্ত জমির পানি সুস্থ জমিতে যেতে দেবেন না।',
      'বীজ শোধন করে বপন করুন।'
    ],
    audioSummaryBn: 'ধানের পাতাপোড়া বা ব্যাকটেরিয়াল ব্লাইট শনাক্ত হয়েছে। অতিরিক্ত ইউরিয়া বন্ধ করে বিঘা প্রতি ৫ কেজি পটাশ সার দিন এবং কপার হাইড্রোক্সাইড স্প্রে করুন।',
    emoji: '🌾',
  },
  'rice_healthy': {
    id: 'rice_healthy',
    classIndex: 2,
    cropBn: 'ধান',
    cropEn: 'Rice',
    diseaseBn: 'সুস্থ ধান গাছ',
    diseaseEn: 'Healthy Rice',
    isHealthy: true,
    severity: 'low',
    pathogenType: 'কোনোটি নয় (Healthy)',
    symptomsBn: [
      'পাতা সতেজ, ঘন সবুজ এবং কোনো ক্ষতিকর দাগ বা পোকার আক্রমণ নেই।'
    ],
    organicTreatmentBn: [
      'নিয়মিত পরিচর্যা এবং পরিমিত সেচ বজায় রাখুন।'
    ],
    chemicalTreatmentBn: [
      'কোনো কীটনাশক বা ছত্রাকনাশকের প্রয়োজন নেই।'
    ],
    preventionBn: [
      'সুষম সার প্রয়োগ করুন এবং জমি পরিষ্কার রাখুন।'
    ],
    audioSummaryBn: 'আলহামদুলিল্লাহ, আপনার ধান গাছ সম্পূর্ণ সুস্থ রয়েছে। নিয়মিত সেচ ও সুষম সার প্রয়োগ বজায় রাখুন।',
    emoji: '🌾',
  },

  // Tomato / টমেটো
  'tomato_late_blight': {
    id: 'tomato_late_blight',
    classIndex: 3,
    cropBn: 'টমেটো',
    cropEn: 'Tomato',
    diseaseBn: 'টমেটোর নাবি ধসা (লেফট ব্লাইট)',
    diseaseEn: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    isHealthy: false,
    severity: 'high',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতায় ভেজা বা জলছাপের মতো কালচে-বাদামী দাগ দ্রুত বিস্তার লাভ করে।',
      'আর্দ্র বা কুয়াশাচ্ছন্ন আবহাওয়ায় পাতার নিচে সাদাটে তুলোর মতো ছত্রাক গজায়।',
      'টমেটোর ফল শক্ত ও খসখসে বাদামী হয়ে পচে যায়।'
    ],
    organicTreatmentBn: [
      'আক্রান্ত পাতা ও গাছ সাথে সাথে তুলে মাটির নিচে পুঁতে ফেলুন।',
      'গাছের গোড়ায় পানি জমতে দেবেন না, শুকনো পাতা ছেঁটে ফেলুন।'
    ],
    chemicalTreatmentBn: [
      'ম্যানকোজেব (যেমন ডায়থেন এম-৪৫) প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে স্প্রে করুন।',
      'রোগ দেখা দিলে রিডোমিল গোল্ড প্রতি লিটার পানিতে ২ গ্রাম হারে ৫ দিন পর পর স্প্রে করুন।'
    ],
    preventionBn: [
      'কুয়াশাচ্ছন্ন রাতে বা ভোরে গাছে অতিরিক্ত সেচ দেওয়া থেকে বিরত থাকুন।',
      'গাছ থেকে গাছের দূরত্ব সঠিক রাখুন যাতে বাতাস চলাচল করতে পারে।'
    ],
    audioSummaryBn: 'টমেটো ফসলে নাবি ধসা বা লেট ব্লাইট ধরা পড়েছে। এটি খুব দ্রুত ছড়িয়ে পড়ে। অবিলম্বে রিডোমিল গোল্ড বা ম্যানকোজেব স্প্রে করুন এবং আক্রান্ত পাতা কেটে পুড়িয়ে ফেলুন।',
    emoji: '🍅',
  },
  'tomato_early_blight': {
    id: 'tomato_early_blight',
    classIndex: 4,
    cropBn: 'টমেটো',
    cropEn: 'Tomato',
    diseaseBn: 'টমেটোর আগাম ধসা (আর্লি ব্লাইট)',
    diseaseEn: 'Tomato Early Blight',
    scientificName: 'Alternaria solani',
    isHealthy: false,
    severity: 'medium',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'গাছের নিচের পাতায় গোল গোল বাদামী দাগ তৈরি হয় যার মধ্যে চক্রাকার রিং দেখা যায় (টার্গেট বোর্ড চিহ্ন)।',
      'আস্তে আস্তে পাতা হলুদ হয়ে শুকিয়ে ঝরে পড়ে।'
    ],
    organicTreatmentBn: [
      'গাছের নিচের আক্রান্ত পাতাগুলো ছিঁড়ে ফেলুন।',
      'গাছের গোড়ায় খড় বা মালচিং দিয়ে মাটির আর্দ্রতা নিয়ন্ত্রণ করুন।'
    ],
    chemicalTreatmentBn: [
      'রোভরাল ৫০ ডব্লিউপি প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।',
      'অথবা স্কোর ২৫০ ইসি প্রতি লিটার পানিতে ০.৫ মিলি হারে স্প্রে করুন।'
    ],
    preventionBn: [
      'পরপর একই জমিতে টমেটো বা আলু চাষ করবেন না (ফসল আবর্তন করুন)।'
    ],
    audioSummaryBn: 'টমেটোর আগাম ধসা বা আর্লি ব্লাইট ধরা পড়েছে। গাছের নিচের দিকের আক্রান্ত পাতা অপসারণ করুন এবং রোভরাল বা স্কোর স্প্রে করুন।',
    emoji: '🍅',
  },
  'tomato_leaf_mold': {
    id: 'tomato_leaf_mold',
    classIndex: 5,
    cropBn: 'টমেটো',
    cropEn: 'Tomato',
    diseaseBn: 'টমেটোর পাতার ছত্রাক (লিফ মোল্ড)',
    diseaseEn: 'Tomato Leaf Mold',
    scientificName: 'Passalora fulva',
    isHealthy: false,
    severity: 'medium',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতার উপরের দিকে ফ্যাকাশে হলুদ ছোপ এবং নিচের পিঠে জলপাই-সবুজ বা ভেলভেটের মতো ছত্রাক আস্তরণ তৈরি হয়।'
    ],
    organicTreatmentBn: [
      'জমিতে আলো-বাতাস চলাচলের জন্য অতিরিক্ত শাখা-প্রশাখা ছেঁটে দিন।'
    ],
    chemicalTreatmentBn: [
      'কপার অক্সিক্লোরাইড প্রতি লিটার পানিতে ৪ গ্রাম হারে স্প্রে করুন।'
    ],
    preventionBn: [
      'গ্রিনহাউস বা পলিহাউসে আর্দ্রতা ৮৫% এর নিচে রাখুন।'
    ],
    audioSummaryBn: 'টমেটোর পাতার ছত্রাক বা লিফ মোল্ড শনাক্ত হয়েছে। কপার অক্সিক্লোরাইড স্প্রে করুন এবং গাছের অতিরিক্ত শাখা ছেঁটে রোদ লাগতে দিন।',
    emoji: '🍅',
  },
  'tomato_septoria_leaf_spot': {
    id: 'tomato_septoria_leaf_spot',
    classIndex: 6,
    cropBn: 'টমেটো',
    cropEn: 'Tomato',
    diseaseBn: 'টমেটোর সেপটোরিয়া পাতার দাগ',
    diseaseEn: 'Tomato Septoria Leaf Spot',
    scientificName: 'Septoria lycopersici',
    isHealthy: false,
    severity: 'medium',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতায় ছোট ছোট অসংখ্য গোল দাগ হয় যার কিনারা গাঢ় বাদামী এবং কেন্দ্র ধূসর।'
    ],
    organicTreatmentBn: [
      'উপর থেকে পানি ছিটানো বন্ধ করে গাছের গোড়ায় ড্রিপ সেচ দিন।'
    ],
    chemicalTreatmentBn: [
      'ডায়থেন এম-৪৫ প্রতি লিটার পানিতে ২ গ্রাম হারে স্প্রে করুন।'
    ],
    preventionBn: [
      'আগাছা পরিষ্কার রাখুন ও ফসলের অবশিষ্টাংশ ধ্বংস করুন।'
    ],
    audioSummaryBn: 'টমেটোর সেপটোরিয়া পাতার দাগ শনাক্ত হয়েছে। ডায়থেন এম-৪৫ স্প্রে করুন এবং পাতার ওপর পানি ছিটানো বন্ধ করুন।',
    emoji: '🍅',
  },
  'tomato_spider_mites': {
    id: 'tomato_spider_mites',
    classIndex: 7,
    cropBn: 'টমেটো',
    cropEn: 'Tomato',
    diseaseBn: 'টমেটোর লাল মাকড় / স্পাইডার মাইট',
    diseaseEn: 'Tomato Two-spotted Spider Mite',
    scientificName: 'Tetranychus urticae',
    isHealthy: false,
    severity: 'medium',
    pathogenType: 'কীটপতঙ্গ (Pest)',
    symptomsBn: [
      'পাতার ওপর হলুদ ছোট ছোট ফুটকি এবং পাতার নিচে সূক্ষ্ম মাকড়সার জালের মতো আবরণ।'
    ],
    organicTreatmentBn: [
      'তীব্র বেগে পরিষ্কার পানি স্প্রে করে মাকড়সা ধুয়ে ফেলুন।',
      'নিম তেলের সাথে সাবান পানি মিশিয়ে স্প্রে করুন।'
    ],
    chemicalTreatmentBn: [
      'ভার্টিমেক বা ওমাইট প্রতি লিটার পানিতে ১.৫ মিলি হারে পাতার উল্টো পিঠে স্প্রে করুন।'
    ],
    preventionBn: [
      'শুষ্ক ও ধূলিময় আবহাওয়ায় জমি আর্দ্র রাখুন।'
    ],
    audioSummaryBn: 'টমেটো গাছে লাল মাকড়ের আক্রমণ হয়েছে। পাতার উল্টো পিঠে পানি ছিটিয়ে ধুয়ে দিন অথবা ভার্টিমেক মাকড়নাশক স্প্রে করুন।',
    emoji: '🍅',
  },
  'tomato_yellow_leaf_curl_virus': {
    id: 'tomato_yellow_leaf_curl_virus',
    classIndex: 8,
    cropBn: 'টমেটো',
    cropEn: 'Tomato',
    diseaseBn: 'টমেটোর পাতা কোঁকড়ানো রোগ (টিওয়াইএলসিভি)',
    diseaseEn: 'Tomato Yellow Leaf Curl Virus',
    scientificName: 'TYLCV',
    isHealthy: false,
    severity: 'high',
    pathogenType: 'ভাইরাস (Virus)',
    symptomsBn: [
      'গাছের পাতা ওপরের দিকে বাটির মতো কুঁকড়ে যায় ও হলুদ হয়ে আকার ছোট হয়।',
      'গাছের বৃদ্ধি থেমে যায় এবং ফুল-ফল ধরা বন্ধ হয়ে যায়।'
    ],
    organicTreatmentBn: [
      'আক্রান্ত গাছ দেখা মাত্রই গোড়াসহ উপড়ে ফেলে মাটির নিচে পুঁতে দিন।',
      'হলুদ আঠালো ফাঁদ (Yellow Sticky Trap) ব্যবহার করে সাদা মাছি দমন করুন।'
    ],
    chemicalTreatmentBn: [
      'বাহক পোকা (সাদা মাছি) দমনে ইমিডাক্লোপ্রিড (যেমন টিডো / অ্যাডমায়ার) প্রতি লিটার পানিতে ০.৫ মিলি হারে স্প্রে করুন।'
    ],
    preventionBn: [
      'ভাইরাস প্রতিরোধী হাইব্রিড জাতের চারা রোপণ করুন।'
    ],
    audioSummaryBn: 'টমেটোর পাতা কোঁকড়ানো ভাইরাস রোগ ধরা পড়েছে। আক্রান্ত গাছ উপড়ে ফেলে পুড়িয়ে দিন এবং সাদা মাছি দমনে ইমিডাক্লোপ্রিড স্প্রে করুন।',
    emoji: '🍅',
  },
  'tomato_healthy': {
    id: 'tomato_healthy',
    classIndex: 9,
    cropBn: 'টমেটো',
    cropEn: 'Tomato',
    diseaseBn: 'সুস্থ টমেটো গাছ',
    diseaseEn: 'Healthy Tomato',
    isHealthy: true,
    severity: 'low',
    pathogenType: 'কোনোটি নয় (Healthy)',
    symptomsBn: [
      'টমেটোর পাতা সম্পূর্ণ সুস্থ, গাঢ় সবুজ এবং স্বাভাবিক বৃদ্ধিরত।'
    ],
    organicTreatmentBn: [
      'গাছের বৃদ্ধি স্বাভাবিক রাখতে পরিমিত জৈব সার ও সেচ দিন।'
    ],
    chemicalTreatmentBn: [
      'কোনো কীটনাশকের প্রয়োজন নেই।'
    ],
    preventionBn: [
      'নিয়মিত পরিদর্শন করুন এবং মাটির আর্দ্রতা সঠিক রাখুন।'
    ],
    audioSummaryBn: 'আলহামদুলিল্লাহ, আপনার টমেটো গাছ সম্পূর্ণ সুস্থ ও সতেজ রয়েছে। নিয়মিত পরিচর্যা বজায় রাখুন।',
    emoji: '🍅',
  },

  // Potato / আলু
  'potato_late_blight': {
    id: 'potato_late_blight',
    classIndex: 10,
    cropBn: 'আলু',
    cropEn: 'Potato',
    diseaseBn: 'আলুর নাবি ধসা (লেট ব্লাইট)',
    diseaseEn: 'Potato Late Blight',
    scientificName: 'Phytophthora infestans',
    isHealthy: false,
    severity: 'high',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতার কিনারায় বাদামী থেকে কালচে পচনশীল ভেজা দাগ দ্রুত ছড়িয়ে পড়ে।',
      'বাতাসে তীব্র দুর্গন্ধ ছড়ায় এবং সম্পূর্ণ আলুর ক্ষেত ১-২ দিনে ঝলসে পুড়ে যায়।'
    ],
    organicTreatmentBn: [
      'আক্রান্ত পাতা দ্রুত কেটে জমি থেকে দূরে ফেলে দিন।',
      'আলু তোলার পর জমিতে রোদ লাগান।'
    ],
    chemicalTreatmentBn: [
      'রোগের লক্ষণ দেখা দেওয়ামাত্র সিকিউর বা এক্রোবেট এমজেড প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে কুয়াশার মতো স্প্রে করুন।',
      'অগ্রিম সুরক্ষায় ম্যানকোজেব স্প্রে করুন।'
    ],
    preventionBn: [
      'কুয়াশা ও মেঘলা আবহাওয়ায় সেচ বন্ধ রাখুন এবং রোগমুক্ত প্রত্যয়িত বীজ ব্যবহার করুন।'
    ],
    audioSummaryBn: 'আলুর মারাত্মক নাবি ধসা বা লেট ব্লাইট রোগ শনাক্ত হয়েছে। বিলম্ব না করে সিকিউর অথবা এক্রোবেট এমজেড ছত্রাকনাশক পুরো ক্ষেতে স্প্রে করুন।',
    emoji: '🥔',
  },
  'potato_early_blight': {
    id: 'potato_early_blight',
    classIndex: 11,
    cropBn: 'আলু',
    cropEn: 'Potato',
    diseaseBn: 'আলুর আগাম ধসা (আর্লি ব্লাইট)',
    diseaseEn: 'Potato Early Blight',
    scientificName: 'Alternaria solani',
    isHealthy: false,
    severity: 'medium',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতায় খয়েরি রঙের গোল রিং আকৃতির দাগ সৃষ্টি হয়।'
    ],
    organicTreatmentBn: [
      'গাছের চারপাশে আগাছা পরিষ্কার রাখুন।'
    ],
    chemicalTreatmentBn: [
      'ডায়থেন এম-৪৫ অথবা রোভরাল ২ গ্রাম প্রতি লিটার পানিতে স্প্রে করুন।'
    ],
    preventionBn: [
      'সুষম পটাশ সার ব্যবহার করুন।'
    ],
    audioSummaryBn: 'আলুর আগাম ধসা শনাক্ত হয়েছে। রোভরাল অথবা ডায়থেন এম-৪৫ স্প্রে করুন।',
    emoji: '🥔',
  },
  'potato_healthy': {
    id: 'potato_healthy',
    classIndex: 12,
    cropBn: 'আলু',
    cropEn: 'Potato',
    diseaseBn: 'সুস্থ আলু গাছ',
    diseaseEn: 'Healthy Potato',
    isHealthy: true,
    severity: 'low',
    pathogenType: 'কোনোটি নয় (Healthy)',
    symptomsBn: [
      'আলুর পাতা সতেজ এবং কোনো দাগ বা পোকার আক্রমণ নেই।'
    ],
    organicTreatmentBn: [
      'মাটি ভরাট এবং সময়মতো সেচ দিন।'
    ],
    chemicalTreatmentBn: [
      'কোনো ওষুধের প্রয়োজন নেই।'
    ],
    preventionBn: [
      'নিয়মিত খেত পরিদর্শন করুন।'
    ],
    audioSummaryBn: 'আপনার আলু গাছ সুস্থ আছে। কোনো রোগ নেই।',
    emoji: '🥔',
  },

  // Pepper / Chili / মরিচ
  'pepper_bacterial_spot': {
    id: 'pepper_bacterial_spot',
    classIndex: 13,
    cropBn: 'মরিচ',
    cropEn: 'Pepper / Chili',
    diseaseBn: 'মরিচের ব্যাকটেরিয়াল পাতার দাগ',
    diseaseEn: 'Pepper Bacterial Spot',
    scientificName: 'Xanthomonas campestris',
    isHealthy: false,
    severity: 'medium',
    pathogenType: 'ব্যাকটেরিয়া (Bacteria)',
    symptomsBn: [
      'পাতায় ছোট ছোট ফোস্কার মতো ভেজা দাগ যা পরবর্তীতে কালচে বাদামী হয়।'
    ],
    organicTreatmentBn: [
      'আক্রান্ত পাতা তুলে ফেলে দিন এবং পরিচ্ছন্ন চাষাবাদ করুন।'
    ],
    chemicalTreatmentBn: [
      'কপার হাইড্রোক্সাইড প্রতি লিটার পানিতে ২ গ্রাম ও ব্যাকট্রোট্রব ০.৪ গ্রাম মিশিয়ে স্প্রে করুন।'
    ],
    preventionBn: [
      'বীজ বপনের পূর্বে গরম পানিতে বা ট্রাইকোডার্মায় শোধন করুন।'
    ],
    audioSummaryBn: 'মরিচের ব্যাকটেরিয়াল দাগ রোগ ধরা পড়েছে। কপার হাইড্রোক্সাইড স্প্রে করুন এবং বীজ শোধন করে রোপণ করুন।',
    emoji: '🌶️',
  },
  'pepper_healthy': {
    id: 'pepper_healthy',
    classIndex: 14,
    cropBn: 'মরিচ',
    cropEn: 'Pepper / Chili',
    diseaseBn: 'সুস্থ মরিচ গাছ',
    diseaseEn: 'Healthy Pepper',
    isHealthy: true,
    severity: 'low',
    pathogenType: 'কোনোটি নয় (Healthy)',
    symptomsBn: [
      'মরিচের পাতা সতেজ এবং ফুল ও ফলে ভরপুর।'
    ],
    organicTreatmentBn: [
      'পরিচ্ছন্ন চাষাবাদ ও জৈব সার দিন।'
    ],
    chemicalTreatmentBn: [
      'কোনো রাসায়নিক প্রয়োজন নেই।'
    ],
    preventionBn: [
      'সুষম সেচ দিন।'
    ],
    audioSummaryBn: 'আপনার মরিচ গাছ সম্পূর্ণ সুস্থ আছে।',
    emoji: '🌶️',
  },

  // Corn / Maize / ভুট্টা
  'corn_common_rust': {
    id: 'corn_common_rust',
    classIndex: 15,
    cropBn: 'ভুট্টা',
    cropEn: 'Corn / Maize',
    diseaseBn: 'ভুট্টার মরিচা রোগ (কমন রাস্ট)',
    diseaseEn: 'Corn Common Rust',
    scientificName: 'Puccinia sorghi',
    isHealthy: false,
    severity: 'medium',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতার উভয় পিঠে ইটের গুঁড়োর মতো লালচে-বাদামী ফোসকা দেখা যায়।'
    ],
    organicTreatmentBn: [
      'আক্রান্ত পাতা কেটে ধ্বংস করুন।'
    ],
    chemicalTreatmentBn: [
      'টিল্ট ২৫০ ইসি প্রতি লিটার পানিতে ০.৫ মিলি হারে স্প্রে করুন।'
    ],
    preventionBn: [
      'মরিচা প্রতিরোধী ভুট্টার জাত ব্যবহার করুন।'
    ],
    audioSummaryBn: 'ভুট্টার মরিচা রোগ শনাক্ত হয়েছে। টিল্ট ২৫০ ইসি ছত্রাকনাশক স্প্রে করুন।',
    emoji: '🌽',
  },
  'corn_leaf_blight': {
    id: 'corn_leaf_blight',
    classIndex: 16,
    cropBn: 'ভুট্টা',
    cropEn: 'Corn / Maize',
    diseaseBn: 'ভুট্টার পাতার দাগ / নর্দার্ন লিফ ব্লাইট',
    diseaseEn: 'Corn Northern Leaf Blight',
    scientificName: 'Exserohilum turcicum',
    isHealthy: false,
    severity: 'high',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতায় লম্বাটে নৌকার মতো ধূসর-সবুজ দাগ তৈরি হয়।'
    ],
    organicTreatmentBn: [
      'ফসলের অবশিষ্টাংশ গভীরভাবে চাষ দিয়ে মাটির নিচে পুতে ফেলুন।'
    ],
    chemicalTreatmentBn: [
      'এমিস্টার টপ প্রতি লিটার পানিতে ১ মিলি হারে স্প্রে করুন।'
    ],
    preventionBn: [
      'সঠিক দূরত্বে বীজ বপন করুন।'
    ],
    audioSummaryBn: 'ভুট্টার নর্দার্ন লিফ ব্লাইট ধরা পড়েছে। এমিস্টার টপ ছত্রাকনাশক স্প্রে করুন।',
    emoji: '🌽',
  },
  'corn_healthy': {
    id: 'corn_healthy',
    classIndex: 17,
    cropBn: 'ভুট্টা',
    cropEn: 'Corn / Maize',
    diseaseBn: 'সুস্থ ভুট্টা গাছ',
    diseaseEn: 'Healthy Corn',
    isHealthy: true,
    severity: 'low',
    pathogenType: 'কোনোটি নয় (Healthy)',
    symptomsBn: [
      'গাছ সতেজ এবং পর্যাপ্ত পুষ্টিসমৃদ্ধ।'
    ],
    organicTreatmentBn: [
      'পরিমিত ইউরিয়া ও পটাশ সার দিন।'
    ],
    chemicalTreatmentBn: [
      'প্রয়োজন নেই।'
    ],
    preventionBn: [
      'জমি আগাছামুক্ত রাখুন।'
    ],
    audioSummaryBn: 'আপনার ভুট্টা গাছ পুরোপুরি সুস্থ রয়েছে।',
    emoji: '🌽',
  },

  // Apple / আপেল
  'apple_scab': {
    id: 'apple_scab',
    classIndex: 18,
    cropBn: 'আপেল',
    cropEn: 'Apple',
    diseaseBn: 'আপেলের স্ক্যাব রোগ',
    diseaseEn: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    isHealthy: false,
    severity: 'medium',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতায় জলপাই রঙের মখমলের মতো দাগ তৈরি হয় যা পরবর্তীতে কালচে হয়ে যায়।'
    ],
    organicTreatmentBn: [
      'ঝরে পড়া সব পাতা পুড়িয়ে ফেলুন।'
    ],
    chemicalTreatmentBn: [
      'ক্যাপটান বা ম্যানকোজেব ২ গ্রাম প্রতি লিটার পানিতে স্প্রে করুন।'
    ],
    preventionBn: [
      'গাছের ডালপালা ছাঁটাই করে আলো-বাতাস নিশ্চিত করুন।'
    ],
    audioSummaryBn: 'আপেলের স্ক্যাব রোগ শনাক্ত হয়েছে। ক্যাপটান অথবা ম্যানকোজেব স্প্রে করুন।',
    emoji: '🍏',
  },
  'apple_healthy': {
    id: 'apple_healthy',
    classIndex: 19,
    cropBn: 'আপেল',
    cropEn: 'Apple',
    diseaseBn: 'সুস্থ আপেল গাছ',
    diseaseEn: 'Healthy Apple',
    isHealthy: true,
    severity: 'low',
    pathogenType: 'কোনোটি নয় (Healthy)',
    symptomsBn: [
      'পাতা সতেজ ও দাগহীন।'
    ],
    organicTreatmentBn: [
      'নিয়মিত পরিচর্যা করুন।'
    ],
    chemicalTreatmentBn: [
      'প্রয়োজন নেই।'
    ],
    preventionBn: [
      'নিয়মিত পর্যবেক্ষণ করুন।'
    ],
    audioSummaryBn: 'আপনার আপেল গাছ পুরোপুরি সুস্থ রয়েছে।',
    emoji: '🍏',
  },

  // Grape / আঙ্গুর
  'grape_black_rot': {
    id: 'grape_black_rot',
    classIndex: 20,
    cropBn: 'আঙ্গুর',
    cropEn: 'Grape',
    diseaseBn: 'আঙ্গুরের কালো পচন (ব্ল্যাক রট)',
    diseaseEn: 'Grape Black Rot',
    scientificName: 'Guignardia bidwellii',
    isHealthy: false,
    severity: 'high',
    pathogenType: 'ছত্রাক (Fungus)',
    symptomsBn: [
      'পাতায় ছোট লালচে বাদামী দাগ এবং ফলের ওপর কালো কুঁচকানো দাগ সৃষ্টি হয়।'
    ],
    organicTreatmentBn: [
      'আক্রান্ত ফল ও পাতা সংগ্রহ করে পুড়িয়ে ফেলুন।'
    ],
    chemicalTreatmentBn: [
      'ম্যানকোজেব বা রিডোমিল গোল্ড স্প্রে করুন।'
    ],
    preventionBn: [
      'মাচা পরিষ্কার রাখুন।'
    ],
    audioSummaryBn: 'আঙ্গুরের ব্ল্যাক রট বা কালো পচন রোগ শনাক্ত হয়েছে। ম্যানকোজেব স্প্রে করুন এবং আক্রান্ত ফল সরিয়ে ফেলুন।',
    emoji: '🍇',
  },
  'grape_healthy': {
    id: 'grape_healthy',
    classIndex: 21,
    cropBn: 'আঙ্গুর',
    cropEn: 'Grape',
    diseaseBn: 'সুস্থ আঙ্গুর গাছ',
    diseaseEn: 'Healthy Grape',
    isHealthy: true,
    severity: 'low',
    pathogenType: 'কোনোটি নয় (Healthy)',
    symptomsBn: [
      'আঙ্গুরের লতা ও পাতা সম্পূর্ণ সুস্থ।'
    ],
    organicTreatmentBn: [
      'মাচায় নিয়মিত রোদ ও সেচ দিন।'
    ],
    chemicalTreatmentBn: [
      'প্রয়োজন নেই।'
    ],
    preventionBn: [
      'আগাছা দমন করুন।'
    ],
    audioSummaryBn: 'আপনার আঙ্গুর গাছ সুস্থ রয়েছে।',
    emoji: '🍇',
  },
};

/**
 * Get disease details by class ID or class index
 */
export function getDiseaseById(id: string): DiseaseInfo {
  if (DISEASE_DATABASE[id]) {
    return DISEASE_DATABASE[id];
  }
  // Fallback to generic tomato late blight
  return DISEASE_DATABASE['tomato_late_blight'];
}

export function getAllDiseases(): DiseaseInfo[] {
  return Object.values(DISEASE_DATABASE);
}
