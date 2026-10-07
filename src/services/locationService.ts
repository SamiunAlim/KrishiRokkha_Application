/**
 * GPS Location Service for Geo-tagging scan records and regional disease tracking.
 */

import * as Location from 'expo-location';

export interface ScanLocation {
  latitude: number;
  longitude: number;
  district?: string;
  subdistrict?: string;
  formattedAddress?: string;
}

class LocationService {
  /**
   * Request foreground location permissions
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.warn('Location permission request failed:', error);
      return false;
    }
  }

  /**
   * Get current GPS location and reverse geocode to District / Upazila
   */
  public async getCurrentScanLocation(): Promise<ScanLocation | null> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const req = await this.requestPermissions();
        if (!req) return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      let district = 'বাংলাদেশ';
      let subdistrict = '';
      let formattedAddress = 'বাংলাদেশ';

      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverseGeocode && reverseGeocode.length > 0) {
          const place = reverseGeocode[0];
          district = place.subregion || place.city || place.region || 'বাংলাদেশ';
          subdistrict = place.district || place.name || '';
          formattedAddress = [subdistrict, district, place.country].filter(Boolean).join(', ');
        }
      } catch (geoError) {
        console.warn('Reverse geocoding error:', geoError);
      }

      return {
        latitude,
        longitude,
        district,
        subdistrict,
        formattedAddress,
      };
    } catch (error) {
      console.warn('Error fetching location:', error);
      return null;
    }
  }
}

export const locationService = new LocationService();
