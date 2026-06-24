import { AxiosError } from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { apiErrorMessage } from '@/api/errors';

interface ApiErrorBody {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/*
 * Map the API's { message, code, errors } envelope (Phase B) onto a react-hook-form.
 * Per-field validation errors are pushed via setError so they render inline under
 * the matching field; the human-readable top-level message is returned for a
 * banner/toast. Falls back to apiErrorMessage when there are no field errors.
 */
export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fallback = 'Something went wrong.',
): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.errors) {
      for (const [field, messages] of Object.entries(body.errors)) {
        if (messages?.length) {
          setError(field as Path<T>, { type: 'server', message: messages[0] });
        }
      }
    }
  }
  return apiErrorMessage(error, fallback);
}
