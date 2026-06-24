import { toast as sonnerToast } from 'sonner';
import { apiErrorMessage } from '@/api/errors';

/*
 * Thin toast helper used after mutations. `error()` accepts either a string or a
 * caught error — in the latter case it runs the Phase B { message, code, errors }
 * envelope through apiErrorMessage so API failures surface cleanly.
 */
export const toast = {
  success(message: string, description?: string) {
    return sonnerToast.success(message, { description });
  },
  error(error: unknown, fallback = 'Something went wrong.') {
    const message = typeof error === 'string' ? error : apiErrorMessage(error, fallback);
    return sonnerToast.error(message);
  },
  message(message: string, description?: string) {
    return sonnerToast(message, { description });
  },
};
