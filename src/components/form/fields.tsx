import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

/*
 * Thin field helpers over shadcn Form + react-hook-form. Each renders a label,
 * the control, optional hint text, and an inline validation/error message
 * (FormMessage shows both zod errors and server errors applied via
 * applyApiErrors). Controls use rounded-xl with the green focus ring per the
 * design tokens. Must be used inside a <Form> (FormProvider).
 */

// rounded-xl override (the shared Input is rounded-lg for inline controls).
const FIELD = 'rounded-xl';

interface BaseFieldProps {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
}

export function TextField({
  name,
  label,
  hint,
  placeholder,
  type = 'text',
}: BaseFieldProps & { type?: string }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} className={FIELD} {...field} />
          </FormControl>
          {hint ? <FormDescription>{hint}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TextareaField({ name, label, hint, placeholder, rows = 4 }: BaseFieldProps & { rows?: number }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              rows={rows}
              placeholder={placeholder}
              className={cn(
                FIELD,
                'focus-visible:border-green-500 focus-visible:ring-2 focus-visible:ring-green-100',
              )}
              {...field}
            />
          </FormControl>
          {hint ? <FormDescription>{hint}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CheckboxField({ name, label, hint }: { name: string; label: string; hint?: string }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-xl border border-border p-3">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">{label}</FormLabel>
            {hint ? <FormDescription>{hint}</FormDescription> : null}
          </div>
        </FormItem>
      )}
    />
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export function SelectField({
  name,
  label,
  hint,
  placeholder = 'Select…',
  options,
}: BaseFieldProps & { options: SelectOption[] }) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger
                className={cn(
                  FIELD,
                  'focus:border-green-500 focus:ring-2 focus:ring-green-100',
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hint ? <FormDescription>{hint}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
