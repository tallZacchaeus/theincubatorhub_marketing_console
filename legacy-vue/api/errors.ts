import { AxiosError } from 'axios';

interface ApiErrorBody {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/** Extract a human-readable message from the API's { message, code, errors } envelope. */
export function apiErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.errors) {
      const first = Object.values(body.errors)[0];
      if (first && first.length) return first[0];
    }
    if (body?.message) return body.message;
  }
  return fallback;
}
