import { useFormStatus } from 'react-dom';
import { Button } from '../../components/ui/button';

export function VerifyButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      disabled={pending}
      className='bg-teal-600 text-white font-bold mt-4 hover:bg-teal-700 transition-colors py-6 text-base rounded-xl shadow-teal-600/20 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {pending ? 'Đang xử lý…' : 'Hoàn tất đăng ký'}
    </Button>
  );
}
