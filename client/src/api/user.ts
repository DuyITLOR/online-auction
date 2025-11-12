import { get } from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export const getUser = async (userId: string) => {
  return get<User>(`users/${userId}`);
}