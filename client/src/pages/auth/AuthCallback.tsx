import { useContext, useEffect } from 'react'; // 1. Import useContext
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSession } from '../../libs/session';
import { UserContext } from '../../libs/contexts/user.context'; // 2. Import Context

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 3. Lấy hàm refresh từ Context
  const { refresh } = useContext(UserContext);

  useEffect(() => {
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const avatar = searchParams.get('avatar');
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    if (!userId || !token || !name || !email) {
      console.error('Google Oauth failed: Missing params');
      navigate('auth/login'); // Nên navigate về login nếu lỗi
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-token`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Check res.ok thay vì chỉ check 404
          throw new Error('Token verification failed');
        }

        // 1. Tạo session (Lưu xuống storage)
        await createSession({
          user: {
            id: userId,
            name,
            email,
            avatarUrl: avatar ?? undefined,
          },
          token,
        });

      
        await refresh();

        if (role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        navigate('/auth/signin');
      }
    };

    verifyToken();
  }, [searchParams, navigate, refresh]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      {/* Thêm chút UI loading cho đẹp */}
      <div className='loader'></div>
    </div>
  );
}
