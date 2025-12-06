/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types/types';
import { getRole } from '../../api/user';
import { getSession } from '../session';

type UserContextType = {
  user: User | null;
  refresh: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  refresh: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState<User | null>(null);

  const fetchUserInfor = async (token: string) => {
    if (token === '') return;
    try {
      const userValue = await getRole({ token: token });
      setUserState(userValue);
    } catch (err) {
      console.error(err);
    }
  };

  const getData = async () => {
    try {
      const session = await getSession();
      const curToken = typeof session?.token === 'string' ? session.token : '';

      await fetchUserInfor(curToken);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return <UserContext.Provider value={{ user: userState, refresh: () => getData() }}>{children}</UserContext.Provider>;
};
