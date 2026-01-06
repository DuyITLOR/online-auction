export function formatCurrency(value: string | number): string {
  if (value === null || value === undefined || value === '') return '';

  const cleanValue = String(value).replace(/\D/g, '');
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}