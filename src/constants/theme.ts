/**
 * Theme configuration for CropDiseaseApp.
 * Designed with deep agricultural green (#2E7D32), accessible high-contrast colors,
 * and large touch targets for Bangladeshi farmers.
 */

export const Colors = {
  light: {
    primary: '#2E7D32',
    primaryLight: '#4CAF50',
    primaryDark: '#1B5E20',
    primaryBg: '#F1F8F1',
    primarySurface: '#E8F5E9',
    
    accent: '#FFA000',
    accentLight: '#FFF8E1',
    
    // Status colors
    healthy: '#2E7D32',
    healthyBg: '#E8F5E9',
    healthyBorder: '#A5D6A7',
    
    danger: '#D32F2F',
    dangerBg: '#FFEBEE',
    dangerBorder: '#FFCDD2',
    
    warning: '#ED6C02',
    warningBg: '#FFF3E0',
    warningBorder: '#FFE082',
    
    info: '#0288D1',
    infoBg: '#E1F5FE',
    infoBorder: '#B3E5FC',
    
    // Neutrals
    background: '#FFFFFF',
    surface: '#FAFAFA',
    card: '#FFFFFF',
    border: '#E0E0E0',
    borderLight: '#EEEEEE',
    
    text: '#212121',
    textSecondary: '#616161',
    textMuted: '#9E9E9E',
    textOnPrimary: '#FFFFFF',
    
    tint: '#2E7D32',
    icon: '#616161',
    tabIconDefault: '#757575',
    tabIconSelected: '#2E7D32',
  },
  
  dark: {
    primary: '#4CAF50',
    primaryLight: '#81C784',
    primaryDark: '#2E7D32',
    primaryBg: '#1B2E1C',
    primarySurface: '#1E3A20',
    
    accent: '#FFB74D',
    accentLight: '#3E2723',
    
    healthy: '#66BB6A',
    healthyBg: '#1B381E',
    healthyBorder: '#2E7D32',
    
    danger: '#EF5350',
    dangerBg: '#3E1C1C',
    dangerBorder: '#B71C1C',
    
    warning: '#FFA726',
    warningBg: '#3E2C15',
    warningBorder: '#E65100',
    
    info: '#29B6F6',
    infoBg: '#0D3547',
    infoBorder: '#0288D1',
    
    background: '#121212',
    surface: '#1E1E1E',
    card: '#242424',
    border: '#333333',
    borderLight: '#2C2C2C',
    
    text: '#EEEEEE',
    textSecondary: '#B0BEC5',
    textMuted: '#78909C',
    textOnPrimary: '#FFFFFF',
    
    tint: '#81C784',
    icon: '#B0BEC5',
    tabIconDefault: '#90A4AE',
    tabIconSelected: '#81C784',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 30,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 26,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 23,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 23,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  button: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 22,
  },
};
