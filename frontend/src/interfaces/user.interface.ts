export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  email: string;
  phone: string;
  role: string;
  token: string;
  isVerified: boolean;
  isDeleted: boolean;
  isActive: boolean;
  createdAt: number;
  deleted: boolean;
}

export interface IFormUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}
