export interface ILoggedUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phone: string;
  role: string;
  token: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: number;
  deleted: boolean;
}
