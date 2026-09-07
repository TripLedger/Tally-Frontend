/**
 * Receipt image upload — returns a local object URL until the backend
 * provides storage. Callers must treat null as "no attachment".
 */
export async function uploadReceiptImage(
  blob: Blob,
  _tripId: string
): Promise<string | null> {
  try {
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error("Receipt upload failed:", err);
    return null;
  }
}
