/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/types';
import { getRole } from '../../api/user';
import { getSession } from '../session';
import { io, type Socket } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';
export const socket: Socket = io(backendUrl, {
  autoConnect: false,
  transports: ['websocket'],
});

type UserContextType = {
  user: User | null;
  rating: number;
  refresh: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  rating: 10,
  refresh: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState<User | null>(null);
  const [ratingValue, setRatingValue] = useState(10);

  const fetchUserInfor = async (token: string) => {
    if (token === '') return;
    try {
      const userValue = await getRole({ token: token });
      setUserState(userValue);
      if (userValue?.isActive == false && userValue) {
        console.log(userValue);
        window.location.href = '/banned';
        return;
      }
      setRatingValue(calRating());
    } catch (err) {
      console.error(err);
    }
  };

  const calRating = () => {
    const pos = userState?.ratingPos ? userState?.ratingPos : 0;
    const neg = userState?.ratingNeg ? userState?.ratingNeg : 0;
    return (10 + pos - neg) / (pos + neg);
  };

  const getData = async () => {
    try {
      const session = await getSession();
      const curToken = typeof session?.token === 'string' ? session.token : '';

      if (curToken !== '') {
        if (socket.connected) {
          socket.disconnect();
        }
        socket.auth = { token: curToken };
        socket.connect();
      } else {
        socket.disconnect();
      }

      await fetchUserInfor(curToken);
    } catch (err) {
      window.location.reload();
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <UserContext.Provider value={{ user: userState, refresh: () => getData(), rating: ratingValue }}>
      {children}
    </UserContext.Provider>
  );
};
