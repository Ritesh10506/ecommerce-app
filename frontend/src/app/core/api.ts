export const API_URL = 'http://localhost:8081/api';

/** Reads the "message" field from the backend's ErrorResponse JSON. */
export function errorMessage(err: any): string {
  if (err?.status === 0) {
    return 'Cannot reach the server. Is the backend running on port 8081?';
  }
  return err?.error?.message ?? 'Something went wrong. Please try again.';
}
