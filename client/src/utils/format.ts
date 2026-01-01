export function formatCurrency(value: string | number): string {
  if (value === null || value === undefined || value === '') return '';

  const cleanValue = String(value).replace(/\D/g, '');
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const longTimeConversation = (dataTime1: string, dataTime: string): boolean => {
  const time1 = new Date(dataTime1).getTime();
  const time2 = new Date(dataTime).getTime();

  const diffMs = Math.abs(time2 - time1);
  
  if (diffMs >= 30 * 60 * 1000) {
    return true;
  }
  return false;
}

export const formatTimeAgo = (dateString: string): string => {
  const past = new Date(dateString).getTime();
  const now = Date.now();

  const diffMs = now - past;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) {
    return 'bây giờ';
  }

  if (diffMs < hour) {
    const mins = Math.floor(diffMs / minute);
    return `${mins} phút`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} tiếng`;
  }

  // >= 1 ngày → trả về ngày + giờ
  const date = new Date(past);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = String(date.getFullYear());
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  const nowDate = new Date();
  if (date.getFullYear() !== nowDate.getFullYear()) {
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }

  return `${dd}/${mm} ${hh}:${min}`;
};
