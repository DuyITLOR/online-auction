import { type ReactNode } from 'react'

interface PaymentLayoutProps {
  children: ReactNode
}

const PaymentLayout = ({ children }: PaymentLayoutProps) => {
  const paymentTheme = {
    // Màu nền và chữ
    '--background': 'oklch(0.99 0 0)',
    '--foreground': 'oklch(0.2 0 0)',

    // Màu highlight
    '--primary': 'rgb(0, 187, 167)',
    '--primary-foreground': 'oklch(1 0 0)',

    // Card colors
    '--card': 'oklch(1 0 0)',
    '--card-foreground': 'oklch(0.2 0 0)',

    // Muted colors
    '--muted': 'oklch(0.96 0 0)',
    '--muted-foreground': 'oklch(0.5 0 0)',

    // Accent colors
    '--accent': 'rgb(17, 185, 130)',
    '--accent-foreground': 'oklch(1 0 0)',

    // Borders and inputs
    '--border': 'oklch(97.468% 0.00211 14.301 / 0.887)',
    '--input': 'oklch(0.95 0 0)',
    '--ring': 'oklch(0.55 0.15 155)',

    // Status colors
    '--success': 'oklch(0.55 0.15 155)',
    '--warning': 'oklch(0.75 0.15 85)',
    '--destructive': 'oklch(0.577 0.245 27.325)',

    // Radius
    '--radius': '0.5rem',

    // Fonts
    '--font-sans': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    '--font-mono': 'ui-monospace, SFMono-Regular, Menlo, monospace',
  } as React.CSSProperties

  return (
    <div style = {paymentTheme}>
        {children}
    </div>
  )
}

export default PaymentLayout;