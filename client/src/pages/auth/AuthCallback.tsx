import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSession } from '../../libs/session';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const avatar = searchParams.get('avatar');
    const token = searchParams.get('token');

    if (!userId || !token || !name || !email) {
      console.error('Google Oauth failed');
      return;
    }

    const verifyToken = async () => {
      try {
        // 1. Gọi API verify
        const res = await fetch(`${import.meta.env.BACKEND_URL}/auth/verify-token`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          console.error('JWT verification failed');
          // Có thể return hoặc navigate về login nếu lỗi
        }

        // 2. Tạo session (Lưu cookie/localStorage)
        await createSession({
          user: {
            name,
            email,
            avatarUrl: avatar ?? undefined,
          },
          token,
        });

        window.dispatchEvent(new Event('session-updated'));

        setTimeout(() => {
          navigate('/');
        }, 1500);

      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  // Bạn có thể làm đẹp giao diện Loading ở đây (ví dụ thêm Spinner)
  return <div className='loader'></div>;
}
