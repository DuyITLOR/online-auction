import { CheckCircle2, Info, Loader2, XCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      position='bottom-right'
      gap={10}
      icons={{
        success: <CheckCircle2 className='size-5 text-teal-500' />,
        info: <Info className='size-5 text-blue-500' />,
        warning: <AlertTriangle className='size-5 text-amber-500' />,
        error: <XCircle className='size-5 text-red-500' />,
        loading: <Loader2 className='size-5 animate-spin text-gray-400' />,
      }}
      toastOptions={{
        classNames: {
          toast: `
            group toast 
            group-[.toaster]:bg-white dark:group-[.toaster]:bg-zinc-950 
            group-[.toaster]:text-gray-900 dark:group-[.toaster]:text-gray-50 
            group-[.toaster]:border-gray-100 dark:group-[.toaster]:border-zinc-800 
            group-[.toaster]:shadow-xl dark:group-[.toaster]:shadow-2xl 
            group-[.toaster]:rounded-xl
            font-sans
          `,

          title: 'group-[.toast]:font-semibold group-[.toast]:text-sm',
          description: 'group-[.toast]:text-gray-500 dark:group-[.toast]:text-gray-400 group-[.toast]:text-xs',

          actionButton: 'group-[.toast]:bg-teal-600 group-[.toast]:text-white font-medium',
          cancelButton:
            'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-gray-300',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
