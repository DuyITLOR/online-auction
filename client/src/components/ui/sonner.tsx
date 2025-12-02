import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      icons={{
        success: <CircleCheckIcon className='size-5 text-green-600' />,
        info: <InfoIcon className='size-5 text-blue-600' />,
        warning: <TriangleAlertIcon className='size-5 text-yellow-600' />,
        error: <OctagonXIcon className='size-5 text-red-600' />,
        loading: <Loader2Icon className='size-5 animate-spin text-gray-500' />,
      }}
      toastOptions={{
        classNames: {
          // Sửa ở đây: Gom tất cả vào key 'toast' và dùng group-data để phân loại
          toast: `
            group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg
            
            group-data-[type=success]:!bg-green-100 group-data-[type=success]:!text-green-800 group-data-[type=success]:!border-green-200
            
            group-data-[type=error]:!bg-red-100 group-data-[type=error]:!text-red-800 group-data-[type=error]:!border-red-200
            
            group-data-[type=warning]:!bg-yellow-100 group-data-[type=warning]:!text-yellow-800 group-data-[type=warning]:!border-yellow-200
            
            group-data-[type=info]:!bg-blue-100 group-data-[type=info]:!text-blue-800 group-data-[type=info]:!border-blue-200
            
            dark:group-data-[type=success]:!bg-green-900 dark:group-data-[type=success]:!text-green-100
            dark:group-data-[type=error]:!bg-red-900 dark:group-data-[type=error]:!text-red-100
            dark:group-data-[type=warning]:!bg-yellow-900 dark:group-data-[type=warning]:!text-yellow-100
            dark:group-data-[type=info]:!bg-blue-900 dark:group-data-[type=info]:!text-blue-100
          `,
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
