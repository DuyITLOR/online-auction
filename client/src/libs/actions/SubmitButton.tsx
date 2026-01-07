import { useFormStatus } from 'react-dom';
import { Button } from '../../components/ui/button';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type='submit'
      disabled={pending}
      className='bg-teal-600 text-white font-bold mt-2 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed'
    >
      {pending ? 'Đang xử lý…' : 'Đăng ký'}
    </Button>
  );
}
