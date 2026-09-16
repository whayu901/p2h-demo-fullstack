/** A folder under uploads/, one per record kind. */
export type PhotoFolder = 'inspections' | 'safety-talks';

/** Storage adapter for inspection/P5M photos. Chosen by STORAGE_DRIVER (see PhotoStorageService). */
export interface PenyimpananFoto {
  /** Saves base64-encoded JPEG bytes and returns the public, web-servable path. */
  simpan(folder: PhotoFolder, id: string, base64: string): string;
  /** Deletes a previously-saved photo given the public path returned by simpan(). Safe to call on a missing file. */
  hapus(publicPath: string): void;
}
