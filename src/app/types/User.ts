export type User = {
  name: string;
  email: string;
  id: string;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export interface IUser {
  id: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  email: string;
}
