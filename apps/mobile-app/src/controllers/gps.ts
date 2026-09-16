import * as Location from 'expo-location';

/** GPS timeout: saving must never hang waiting for a fix. */
const GPS_TIMEOUT_MS = 5000;

export interface CapturedLocation {
  latitude: number | null;
  longitude: number | null;
  /** True when the platform flagged this position as mocked (fake GPS). Android only; defaults to `false` when unknown. */
  mock: boolean;
  akurasiMeter: number | null;
}

const NO_LOCATION: CapturedLocation = {
  latitude: null,
  longitude: null,
  mock: false,
  akurasiMeter: null,
};

function delay(ms: number): Promise<null> {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms));
}

/**
 * `LocationObject.mocked` (see `expo-location`'s `Location.types.d.ts`: "Whether
 * the location coordinates is mocked or not. @platform android") is only ever
 * reported on Android and is `undefined` when the platform doesn't report it —
 * treated as "not mocked" per the spec above.
 */
function toCapturedLocation(position: Location.LocationObject): CapturedLocation {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    mock: position.mocked ?? false,
    akurasiMeter: position.coords.accuracy,
  };
}

/**
 * Captures the device's current position for a new record. Tries the
 * last-known position first (instant, works offline/airplane mode), then
 * falls back to a fresh fix raced against a timeout. Never throws and never
 * hangs longer than `GPS_TIMEOUT_MS` — on any failure or denied permission it
 * resolves to `{ latitude: null, longitude: null, mock: false, akurasiMeter: null }`.
 */
export async function captureLocation(): Promise<CapturedLocation> {
  try {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      return NO_LOCATION;
    }

    const lastKnown = await Location.getLastKnownPositionAsync().catch(() => null);
    if (lastKnown) {
      return toCapturedLocation(lastKnown);
    }

    const current = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.LocationAccuracy.Balanced }).catch(
        () => null
      ),
      delay(GPS_TIMEOUT_MS),
    ]);

    if (current) {
      return toCapturedLocation(current);
    }
    return NO_LOCATION;
  } catch {
    return NO_LOCATION;
  }
}
