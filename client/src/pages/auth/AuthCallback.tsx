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
            name,
            email,
            avatarUrl: avatar ?? undefined,
          },
          token,
        });

        navigate('/');
      } catch (err) {
        console.error(err);
      }
    };

    verifyToken();
  }, [searchParams, navigate]);
  return <div>loading...</div>;
}
