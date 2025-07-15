import { User } from "../user";

export interface SignUp {
  id: number;
  email: string;
  name: string;
  address: string;
  phone: number;
  web: string;
  fax: number;
  logo: string;
  userDto: User;
  entryUserID: number;
  entryDate: Date;
  updateUserID: string | null;
  updateDate: Date | null;
}
