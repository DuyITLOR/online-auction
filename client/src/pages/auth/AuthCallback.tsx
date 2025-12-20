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
    const role = searchParams.get('role');

    if (!userId || !token || !name || !email) {
      console.error('Google Oauth failed');
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${import.meta.env.BACKEND_URL}/auth/verify-token`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          console.error('JWT verification failed');
        }

        await createSession({
          user: {
            id: userId,
            name,
            email,
            avatarUrl: avatar ?? undefined,
          },
          token,
        });

        window.dispatchEvent(new Event('session-updated'));

        setTimeout(() => {
          if (role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            navigate('/');
          }
        }, 1500);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };

    verifyToken();
  }, [searchParams, navigate]);

  return <div className='loader'></div>;
}
