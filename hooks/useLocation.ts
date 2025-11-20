import { useState, useEffect } from 'react';

interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  error: string | null;
  loading: boolean;
  permissionStatus: PermissionState | 'unknown';
}

export function useLocation() {
  const [locationState, setLocationState] = useState<LocationState>({
    coords: null,
    error: null,
    loading: true,
    permissionStatus: 'unknown',
  });

  const requestLocation = () => {
    setLocationState(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      setLocationState({
        coords: null,
        error: 'Geolocation is not supported by your browser',
        loading: false,
        permissionStatus: 'denied',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          loading: false,
          permissionStatus: 'granted',
        });
      },
      (error) => {
        let errorMessage = 'Failed to retrieve location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information is unavailable';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'The request to get user location timed out';
        }

        setLocationState({
          coords: null,
          error: errorMessage,
          loading: false,
          permissionStatus: 'denied',
        });
      }
    );
  };

  useEffect(() => {
    // Check permission status initially if possible
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestLocation();
        } else if (result.state === 'prompt') {
             // Don't auto-request if prompt, wait for user action or component mount logic
             // But for this app, we usually want to try once on mount if we don't know
             requestLocation();
        } else {
          setLocationState(prev => ({ ...prev, loading: false, permissionStatus: 'denied', error: 'Location permission denied' }));
        }
      });
    } else {
      requestLocation();
    }
  }, []);

  return { ...locationState, requestLocation };
}
