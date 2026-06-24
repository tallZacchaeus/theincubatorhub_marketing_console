import { Toaster as Sonner, type ToasterProps } from 'sonner';

/*
 * Themed toaster. The console is light-only, so we skip next-themes and map
 * sonner's CSS vars onto our shadcn tokens (card surface, ink text, gray-200
 * border) for visual consistency with the rest of the kit.
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success: 'group-[.toaster]:!text-green-700',
          error: 'group-[.toaster]:!text-red-600',
        },
      }}
      {...props}
    />
  );
}
